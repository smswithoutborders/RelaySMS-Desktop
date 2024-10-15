"""
A module that implements the ratchet mechanism.
 
This program is free software: you can redistribute it under the terms
of the GNU General Public License, v. 3.0. If a copy of the GNU General
Public License was not distributed with this file, see <https://www.gnu.org/licenses/>.
"""

import os
from smswithoutborders_libsig.protocols import (
    States,
    HEADERS,
    GENERATE_DH,
    DH,
    KDF_CK,
    KDF_RK,
    ENCRYPT,
    DECRYPT,
    CONCAT,
    DHRatchet,
)

from smswithoutborders_libsig.keypairs import Keypairs, x25519


class Ratchets:
    """
    A class to handle the ratchet mechanism.

    Attributes:
        MAX_SKIP (int): Maximum number of skipped message keys.
    """

    MAX_SKIP = int(os.environ.get("MKSKIPPED", 100))

    @staticmethod
    def alice_init(
        state: States, SK: bytes, bob_dh_public_key: bytes, keystore_path: str = None
    ):
        """
        Initializes the state for Alice.

        Args:
            state (States): The state to be initialized.
            SK (bytes): The shared secret key.
            bob_dh_public_key (bytes): Bob's public Diffie-Hellman key.
            keystore_path (str, optional): The path to the keystore. Defaults to None.
        """
        state.DHs = GENERATE_DH(keystore_path)
        state.DHr = bob_dh_public_key
        state.RK, state.CKs = KDF_RK(SK, DH(state.DHs, state.DHr))
        state.CKr = None
        state.Ns = 0
        state.Nr = 0
        state.PN = 0
        state.MKSKIPPED = {}

    @staticmethod
    def bob_init(state: States, SK: bytes, bob_dh_key_pair: Keypairs):
        """
        Initializes the state for Bob.

        Args:
            state (States): The state to be initialized.
            SK (bytes): The shared secret key.
            bob_dh_key_pair (Keypairs): Bob's Diffie-Hellman key pair.
        """
        state.DHs = bob_dh_key_pair
        state.DHr = None
        state.RK = SK
        state.CKs = None
        state.CKr = None
        state.Ns = 0
        state.Nr = 0
        state.PN = 0
        state.MKSKIPPED = {}

    @staticmethod
    def encrypt(*, state: States, data: bytes, AD: bytes):
        """
        Encrypts data using the current state.

        Args:
            state (States): The current state.
            data (bytes): The data to be encrypted.
            AD (bytes): The associated data.

        Returns:
            tuple: A tuple containing the header and the encrypted data.
        """
        state.CKs, mk = KDF_CK(state.CKs)
        header = HEADERS(state.DHs, state.PN, state.Ns)
        state.Ns += 1
        return header, ENCRYPT(mk, data, CONCAT(AD, header))

    @staticmethod
    def decrypt(*, state: States, header: HEADERS, ciphertext: bytes, AD: bytes):
        """
        Decrypts data using the current state.

        Args:
            state (States): The current state.
            header (HEADERS): The header of the encrypted message.
            ciphertext (bytes): The encrypted data.
            AD (bytes): The associated data.

        Returns:
            bytes: The decrypted data.
        """
        plaintext = Ratchets.try_skip_message_keys(state, header, ciphertext, AD)
        if plaintext:
            return plaintext

        if header.dh != state.DHr:
            Ratchets.skip_message_keys(state, header.pn)
            DHRatchet(state, header)

        Ratchets.skip_message_keys(state, header.n)
        state.CKr, mk = KDF_CK(state.CKr)
        state.Nr += 1
        return DECRYPT(mk, ciphertext, CONCAT(AD, header))

    @staticmethod
    def try_skip_message_keys(
        state: States, header: HEADERS, ciphertext: bytes, AD: bytes
    ):
        """
        Tries to skip message keys if they are already present in the skipped keys.

        Args:
            state (States): The current state.
            header (HEADERS): The header of the encrypted message.
            ciphertext (bytes): The encrypted data.
            AD (bytes): The associated data.

        Returns:
            bytes: The decrypted data if a skipped key is found, else None.
        """
        if (header.dh, header.n) in state.MKSKIPPED:
            mk = state.MKSKIPPED[header.dh, header.n]
            del state.MKSKIPPED[header.dh, header.n]
            return DECRYPT(mk, ciphertext, CONCAT(AD, header))

        return None

    @staticmethod
    def skip_message_keys(state: States, until: int):
        """
        Skips message keys until a certain number is reached.

        Args:
            state (States): The current state.
            until (int): The number until which to skip message keys.

        Raises:
            Exception: If the number of skipped keys exceeds MAX_SKIP.
        """
        if state.Nr + Ratchets.MAX_SKIP < until:
            raise Exception("MAX_SKIP Exceeded")

        if state.CKr:
            while state.Nr < until:
                state.CKr, mk = KDF_CK(state.CKr)
                state.MKSKIPPED[state.DHr, state.Nr] = mk
                state.Nr += 1


if __name__ == "__main__":
    import base64
    import struct

    bob = x25519("db_keys/bobs_keys.db")
    bob_public_key_original = (
        bob.init()
    )  # not an encryption key, won't work unless for AD
    print(base64.b64encode(bob_public_key_original))

    alice = x25519()
    alice_public_key_original = alice.init()
    """
    alice_public_key_original = input("alice pubkey: ")
    alice_public_key_original = base64.b64decode(alice_public_key_original.encode())
    """

    SK = alice.agree(bob_public_key_original)
    SK1 = bob.agree(alice_public_key_original)
    assert SK == SK1

    # .... assuming in change in time

    original_plaintext = b"Hello world" * 32

    alice_state = States()

    Ratchets.alice_init(
        alice_state, SK, bob_public_key_original, "db_keys/alice_keys.db"
    )
    header, alice_ciphertext = Ratchets.encrypt(
        state=alice_state, data=original_plaintext, AD=bob_public_key_original
    )

    s_header = header.serialize()
    a_header1 = HEADERS.deserialize(s_header)
    assert header == a_header1

    bob_state = States()
    bob1 = x25519("db_keys/bobs_keys.db")
    bob1.load_keystore(bob.pnt_keystore, bob.secret_key)
    Ratchets.bob_init(bob_state, SK1, bob1)

    """
    Ratchets.bob_init(bob_state, SK1, bob)
    alice_ciphertext = input("ciphertext:")
    alice_ciphertext = base64.b64decode(alice_ciphertext)
    header = HEADERS.deserialize(alice_ciphertext[4:4+struct.unpack("<i", alice_ciphertext[:4])[0]])
    alice_ciphertext = alice_ciphertext[4+struct.unpack("<i", alice_ciphertext[:4])[0]:]
    print("header: ", base64.b64encode(header.serialize()))
    print("alice ciphertext: ", base64.b64encode(alice_ciphertext))
    """

    bob_plaintext = Ratchets.decrypt(
        state=bob_state,
        header=header,
        ciphertext=alice_ciphertext,
        AD=bob_public_key_original,
    )

    print(bob_plaintext)

    exit()

    assert original_plaintext == bob_plaintext

    import sys

    for i in range(int(sys.argv[1])):
        print(i)
        header1, alice_ciphertext = Ratchets.encrypt(
            state=alice_state, data=original_plaintext, AD=bob_public_key_original
        )

    bob_plaintext = Ratchets.decrypt(
        state=bob_state,
        header=header1,
        ciphertext=alice_ciphertext,
        AD=bob_public_key_original,
    )
