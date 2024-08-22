#!/usr/bin/env python3
from smswithoutborders_libsig.keypairs import Keypairs, x25519

from Crypto.Protocol.KDF import HKDF
from Crypto.Random import get_random_bytes
from Crypto.Hash import SHA512, SHA256, HMAC
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad

import logging
import struct
import smswithoutborders_libsig.helpers as helpers
import pickle
import base64

class States:
    DHs: Keypairs = None
    DHr: bytes = None

    RK: bytes = None
    CKs: bytes = None
    CKr: bytes = None

    Ns = 0
    Nr = 0

    PN = 0

    MKSKIPPED = {}

    def serialize(self) -> bytes:
        if not hasattr(self, 'DHs') or self.DHs == None or \
                not hasattr(self, 'RK') or self.RK == None: 
                    raise Exception("State cannot be serialized: reason DHs == None or RK == None")

        s_keypairs = self.DHs.serialize()

        s_keypairs_len = len(s_keypairs)
        dhr_len  = len(self.DHr) if not self.DHr is None else 0
        rk_len = len(self.RK) if not self.RK is None else 0
        ck_len  = len(self.CKs) if not self.CKs is None else 0
        cr_len  = len(self.CKr) if not self.CKr is None else 0

        len_start = struct.pack(f"<{'i'*5}", s_keypairs_len, rk_len, dhr_len, ck_len, cr_len)
        _serialized = len_start + s_keypairs + self.RK
        for i in [self.DHr, self.CKs, self.CKr]:
            if i: 
                _serialized = _serialized + i
        _serialized = _serialized + struct.pack("<iii", self.Ns, self.Nr, self.PN) + \
                pickle.dumps(self.MKSKIPPED)
        return _serialized

    @staticmethod
    def deserialize(data):
        state = States()

        s_keypairs_len, dhr_len, rk_len, cks_len, ckr_len = \
                struct.unpack(f"<{'i'*5}", data[0:4*5])

        data = data[4*5:]

        state.DHs = x25519().deserialize(data[:s_keypairs_len])
        state.RK = data[s_keypairs_len: (s_keypairs_len + rk_len)]
        state.DHr = data[(s_keypairs_len + rk_len): (s_keypairs_len + dhr_len + rk_len)]
        state.CKs = data[(s_keypairs_len + dhr_len + rk_len): (s_keypairs_len + dhr_len + rk_len + cks_len)]
        if state.CKs == b'':
            state.CKs = None
        state.CKr = data[(s_keypairs_len + dhr_len + rk_len + cks_len): (s_keypairs_len + dhr_len + \
                rk_len + cks_len + ckr_len)]
        if state.CKr == b'':
            state.CKr = None
        state.Ns, state.Nr, state.PN = \
                struct.unpack("<iii", 
                              data[(s_keypairs_len + dhr_len + rk_len + cks_len + ckr_len): 
                                   (s_keypairs_len + dhr_len + rk_len + cks_len + ckr_len + 3*4)])
        state.MKSKIPPED = pickle.loads(data[(s_keypairs_len + dhr_len + rk_len + cks_len + ckr_len + 3*4):])

        return state

    def __eq__(self, other):
        if not isinstance(other, States):
            return NotImplemented

        return (self.DHs == other.DHs and self.DHr == other.DHr 
                and self.RK == other.RK and self.CKs == other.CKs
                and self.CKr == other.CKr and self.Ns == other.Ns
                and self.Nr == other.Nr and self.PN == other.PN
                and self.MKSKIPPED == other.MKSKIPPED)

class HEADERS:
    dh: bytes # public key bytes
    pn = None
    n = None
    
    LEN = None
    
    def __init__(self, dh_pair: bytes=None, pn=None, n=None):
        if dh_pair:
            self.dh = dh_pair.get_public_key()
        self.pn = pn
        self.n = n

    def serialize(self) -> bytes:
        return struct.pack("<ii", self.pn, self.n) + self.dh

    """
    def deserialize(self, data):
        self.pn, self.n = struct.unpack("<ii", data[0:8])
        self.dh = data[12:]
    """

    @staticmethod
    def deserialize(data):
        pn, n = struct.unpack("<ii", data[0:8])
        headers = HEADERS(pn=pn, n=n)
        headers.dh = data[8:]

        return headers

    def __eq__(self, other):
        return (self.dh == other.dh and 
                self.pn == other.pn and
                self.n == other.n)

class DHRatchet:
    def __init__(self, state: States, header: HEADERS):
        state.PN = state.Ns
        state.Ns = 0
        state.Nr = 0

        state.DHr = header.dh
        shared_secret = DH(state.DHs, state.DHr)
        state.RK, state.CKr = KDF_RK(state.RK, shared_secret)
        state.DHs = GENERATE_DH(state.DHs.keystore_path, state.DHs.secret_key)
        shared_secret = DH(state.DHs, state.DHr)
        state.RK, state.CKs = KDF_RK(state.RK, shared_secret)


def GENERATE_DH(keystore_path: str=None, secret_key = None) -> bytes:
    x = x25519(keystore_path=keystore_path, secret_key=secret_key)
    x.init()
    return x

def DH(dh_pair: Keypairs, dh_pub: bytes) -> bytes:
    return dh_pair.agree(dh_pub)

def KDF_RK(rk, dh_out): 
    length=32
    num_keys=2

    # TODO: make meaninful information
    information=b'KDF_RK'

    return HKDF(master=dh_out, 
                 key_len=length, 
                 salt=rk, 
                 hashmod=SHA512, 
                 num_keys=num_keys, context=information)


def KDF_CK(ck):
    d_ck = HMAC.new(ck, digestmod=SHA256)
    _ck = d_ck.update(b'\x01').digest()

    d_ck = HMAC.new(ck, digestmod=SHA256)
    mk = d_ck.update(b'\x02').digest()
    return _ck, mk


def ENCRYPT(mk, plaintext, associated_data) -> bytes:
    key, auth_key, iv = helpers.get_mac_parameters(mk)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    cipher_text = cipher.encrypt(pad(plaintext,  AES.block_size))
    hmac = helpers.build_verification_hash(auth_key, associated_data, cipher_text)
    return cipher_text + hmac.digest()


def DECRYPT(mk, ciphertext, associated_data):
    # Throws an exception in case cannot verify
    cipher_text = helpers.verify_signature(mk, ciphertext, associated_data)
    key, _, iv = helpers.get_mac_parameters(mk)
    # iv = cipher_text[:AES.block_size]
    # data = cipher_text[AES.block_size:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    return unpad(cipher.decrypt(cipher_text), AES.block_size)


def CONCAT(ad: bytes, header: HEADERS):
    # ex_len = struct.pack("<i", len(ad))
    # return ex_len + ad + header.serialize()
    return ad + header.serialize()
