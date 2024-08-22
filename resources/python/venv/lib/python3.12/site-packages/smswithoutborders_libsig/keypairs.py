#!/usr/bin/env python3
from abc import ABC, abstractmethod

# ECDH
from ecdsa import ECDH, NIST256p
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

# X25519
from cryptography.hazmat.primitives import hashes 
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey, X25519PublicKey
from cryptography.hazmat.primitives import serialization
import binascii
import base64
from cryptography.hazmat.primitives.kdf.hkdf import HKDF

from smswithoutborders_libsig.keystore import Keystore

import base64
import secrets
import uuid
import struct

class Keypairs(ABC):
    size = 32

    @abstractmethod
    def init(self):
        pass

    @abstractmethod
    def agree(self, public_key, info, salt):
        pass

    @abstractmethod
    def get_public_key(self):
        pass

    @abstractmethod
    def load_keystore(self):
        pass

    @abstractmethod
    def serialize(self):
        pass

    @abstractmethod
    def deserialize(self):
        pass

    def store(pk, _pk, keystore_path, pnt_keystore, info=b"x25591_key_exchange", 
            salt=None, secret_key=None):
        if not secret_key:
            secret_key = secrets.token_bytes(Keypairs.size) # store this
            extended_derived_key = HKDF(algorithm=hashes.SHA256(),
                               length=Keypairs.size,
                               salt=salt,
                               info=info,).derive(secret_key)
            secret_key = base64.b64encode(extended_derived_key).decode()

        keystore = Keystore(keystore_path, secret_key)
        keystore.store(keypair=(pk, _pk), pnt=pnt_keystore)

        return secret_key

    def fetch(pnt_keystore, secret_key, keystore_path=None):
        keystore = Keystore(keystore_path, secret_key)
        return keystore.fetch(pnt_keystore)
    

    def __agree__(secret_key, info=b"x25591_key_exchange", salt=None):
        return HKDF(algorithm=hashes.SHA256(), 
                    length=Keypairs.size, salt=salt, info=info,).derive(secret_key) 


class ecdh(Keypairs):
    def __init__(self, pnt_keystore=None, keystore_path=None, secret_key=None):
        self.pnt_keystore = pnt_keystore
        self.keystore_path = keystore_path

    def init(self):
        ecdh = ECDH(curve=NIST256p)
        pk = ecdh.generate_private_key()
        self.pnt_keystore = uuid.uuid4().hex

        if not self.keystore_path:
            self.keystore_path = f"db_keys/{self.pnt_keystore}.db"

        self.secret_key = Keypairs.store(pk.to_string(), 
                                         ecdh.private_key.to_string(), 
                                         self.keystore_path, 
                                         self.pnt_keystore)
        return pk.to_string()

    def get_public_key(self):
        ppk = Keypairs.fetch(self.pnt_keystore, self.secret_key, self.keystore_path )
        return ppk[0]
    
    def load_keystore(self):
        pass

    def agree(self, public_key, info=b"x25591_key_exchange", salt=None) -> bytes:
        if not self.keystore_path:
            self.keystore_path = f"db_keys/{pnt_keystore}.db"
        ppk = Keypairs.fetch(self.pnt_keystore, self.secret_key, self.keystore_path )
        if ppk:
            ecdh = ECDH(curve=NIST256p)
            ecdh.load_private_key_bytes(ppk[1])
            # ecdh.load_received_public_key_pem(public_key)
            ecdh.load_received_public_key_bytes(public_key)
            shared_key = ecdh.generate_sharedsecret_bytes()
            return Keypairs.__agree__(shared_key, info, salt)


class x25519(Keypairs):
    def __init__(self, keystore_path=None, pnt_keystore=None, secret_key=None):
        self.keystore_path = keystore_path
        self.pnt_keystore = pnt_keystore
        self.secret_key = secret_key

    def init(self):
        x = X25519PrivateKey.generate()
        pk = x.public_key().public_bytes_raw()

        """
        _pk = x.private_bytes(encoding=serialization.Encoding.PEM, 
                              format=serialization.PrivateFormat.PKCS8, 
                              encryption_algorithm=serialization.NoEncryption()) 
        """
        _pk = x.private_bytes_raw()
        self.pnt_keystore = uuid.uuid4().hex

        if not self.keystore_path:
            self.keystore_path = f"db_keys/{self.pnt_keystore}.db"

        self.secret_key = Keypairs.store(pk, _pk, self.keystore_path, 
                self.pnt_keystore, secret_key=self.secret_key)
        return pk

    def serialize(self) -> bytes:
        """
        """
        if not hasattr(self, 'pnt_keystore') or self.pnt_keystore == None or \
                not hasattr(self, 'keystore_path') or self.keystore_path == None or \
                not hasattr(self, 'secret_key') or self.secret_key == None:
            raise Exception("keypair not initialized -- init()")

        keystore_path_len = len(self.keystore_path)
        pnt_keystore_len = len(self.pnt_keystore)
        return struct.pack("<ii", keystore_path_len, pnt_keystore_len) + \
                self.keystore_path.encode() + \
                self.pnt_keystore.encode() + self.secret_key.encode()

    def deserialize(self, data) -> Keypairs:
        """
        """
        x = x25519()

        keystore_path_len, pnt_keystore_len = struct.unpack("<ii", data[0:8])
        x.keystore_path = data[8 : (8 + keystore_path_len)].decode()
        x.pnt_keystore = data[(8 + keystore_path_len) : (8 + keystore_path_len + pnt_keystore_len)].decode()
        x.secret_key = data[(8 + keystore_path_len + pnt_keystore_len):].decode()
        return x

    def __eq__(self, other):
        if not isinstance(other, Keypairs):
            return NotImplemented

        return (other.keystore_path == self.keystore_path and
                other.pnt_keystore == self.pnt_keystore and
                other.secret_key == self.secret_key)

    def load_keystore(self, pnt_keystore: str, secret_key: bytes):
        if not self.keystore_path:
            self.keystore_path = f"db_keys/{pnt_keystore}.db"
        ppk = Keypairs.fetch(pnt_keystore, secret_key, self.keystore_path )
        if ppk:
            self.pnt_keystore = pnt_keystore
            self.secret_key = secret_key

            return X25519PrivateKey.from_private_bytes(ppk[1])


    def get_public_key(self):
        ppk = Keypairs.fetch(self.pnt_keystore, self.secret_key, self.keystore_path )
        if ppk:
            return ppk[0]

    def agree(self, public_key, info=b"x25591_key_exchange", salt=None) -> bytes:
        x = self.load_keystore(self.pnt_keystore, self.secret_key)
        shared_key = x.exchange(X25519PublicKey.from_public_bytes(public_key))
        return Keypairs.__agree__(shared_key, info, salt)


if __name__ == "__main__":
    client1 = x25519()
    client1_public_key = client1.init()

    client2 = x25519()
    client2_public_key = client2.init()

    dk = client1.agree(client2_public_key)
    dk1 = client2.agree(client1_public_key)

    assert(dk != None)
    assert(dk1 != None)
    assert(dk == dk1)

    s_c1 = client1.serialize()
    d_c1 = client1.deserialize(s_c1)

    assert(d_c1 == client1)
