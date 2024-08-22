"""A module for managing a secure keystore."""

import os
import sqlite3 as sqlite

if not os.environ.get("NOSECURE"):
    import sqlcipher3 as sqlite


class Keystore:
    """
    A class to manage a secure keystore using SQLite.
    """

    table_name = "_crypto"

    def __init__(self, db_name, mk):
        """
        Initializes the Keystore.

        Args:
            db_name (str): The name of the SQLite database.
            mk (str): The master key used for encryption.
        """
        self.mk = mk
        self.db_name = db_name

        with self._get_connection() as conn:
            self.create(conn)

    def _get_connection(self):
        """
        Establishes a SQLite database connection with encryption.

        Returns:
            sqlite3.Connection: SQLite database connection.
        """
        conn = sqlite.connect(self.db_name)
        conn.execute(f"PRAGMA key = '{self.mk}'")
        conn.execute("PRAGMA cipher_compatibility = 3")
        return conn

    def create(self, conn):
        """
        Creates the '_crypto' table if it doesn't exist.

        Args:
            conn (sqlite3.Connection): SQLite database connection.
        """
        with conn:
            conn.execute(
                f"""
                CREATE TABLE IF NOT EXISTS {self.table_name} (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pnt TEXT NOT NULL UNIQUE,
                    pk BLOB NOT NULL,
                    _pk BLOB NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
                """
            )

    def store(self, keypair: tuple, pnt):
        """
        Stores a keypair in the keystore.

        Args:
            keypair (tuple): A tuple containing (public_key, private_key).
                - public_key (bytes): Public key bytes to be stored.
                - private_key (bytes): Private key bytes to be stored.
            pnt (str): Pointer or identifier associated with the keypair.

        Returns:
            int: The row ID of the inserted record.
        """
        pk, _pk = keypair
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                f"INSERT INTO {self.table_name} (pnt, pk, _pk) VALUES (?, ?, ?)",
                (pnt, pk, _pk),
            )
            conn.commit()
            return cursor.lastrowid

    def fetch(self, pnt):
        """
        Retrieves a keypair from the keystore based on the pointer (pnt).

        Args:
            pnt (str): Pointer associated with the keypair.

        Returns:
            tuple: A tuple containing the retrieved keypair.
                - If found:
                    - public_key (bytes): Retrieved public key bytes.
                    - private_key (bytes): Retrieved private key bytes.
                - If not found: None.
        """
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(f"SELECT * FROM {self.table_name} WHERE pnt = ?", (pnt,))
            row = cursor.fetchone()

            if not row:
                return None

            pk, _pk = row[2], row[3]
            return (pk, _pk)


if __name__ == "__main__":
    SK = ("123abc" * 6)[:32]
    DN = (
        "db_keys/temp_plain.db" if os.environ.get("NOSECURE") else "db_keys/temp_sec.db"
    )
    PNT = 1
    keystore = Keystore(DN, SK)

    data = (b"hello", b"world")
    keystore.store(data, PNT)
    rows = keystore.fetch(PNT)
    assert data == rows
