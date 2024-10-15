"""
This program is free software: you can redistribute it under the terms
of the GNU General Public License, v. 3.0. If a copy of the GNU General
Public License was not distributed with this file, see <https://www.gnu.org/licenses/>.
"""

import base64
from Crypto.Hash import SHA512, SHA256, HMAC
from Crypto.Protocol.KDF import HKDF

def build_verification_hash(auth_key, associated_data, cipher_text):
    return HMAC.new(auth_key, digestmod=SHA256).update(
            associated_data + cipher_text)

def get_mac_parameters(mk):
    hash_len = 80
    information = b'ENCRYPT'
    salt = bytes(hash_len)
    hkdf_out = HKDF(master=mk, 
                 key_len=hash_len, 
                 salt=salt, 
                 hashmod=SHA512, 
                 num_keys=1, context=information)

    key = hkdf_out[:32]
    auth_key = hkdf_out[32:64]
    iv = hkdf_out[64:(64+16)]

    return key, auth_key, iv

def verify_signature(mk, cipher_text_mac, associated_data):
    """
    Throws ValueError – if the MAC does not match. 
    It means that the message has been tampered with or that 
        the MAC key is incorrect.
    """ 
    _, auth_key, _ = get_mac_parameters(mk)
    mac = cipher_text_mac[len(cipher_text_mac) - SHA256.digest_size:]
    cipher_text = cipher_text_mac[:len(cipher_text_mac) - SHA256.digest_size]
    hmac = build_verification_hash(auth_key, associated_data, cipher_text)
    hmac.verify(mac)
    return cipher_text
