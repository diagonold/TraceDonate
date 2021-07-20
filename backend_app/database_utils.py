import sqlite3
import json

DB_FILE = "database.db"


def user_exist(username):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    SELECT 1
                    FROM "user"
                    WHERE username = (?)
                    """,
                    (username,))
        res = cur.fetchall()
        return len(res) == 1


def create_user(username, password, wallet):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    INSERT INTO "user" (username, password, wallet)
                    VALUES(?,?,?)""",
                    (username, password, wallet))
        res = cur.fetchall()


def get_user(username):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    SELECT username, password
                    FROM "user"
                    WHERE username = (?)
                    """,
                    (username,))
        res = cur.fetchall()
        if len(res) == 1:
            return {"username": res[0][0], "password": res[0][1]}

        return None



if __name__ == '__main__':
    # print(user_exist('a'))
    # init_tables()
    # create_user('a', 'b', 'c')
    # print(db.user_exist('a'))
    # create_user(2,2,3)
    print(get_user('aaaaa'))
