import sqlite3
import json

DB_FILE = "database.db"


def user_exist(username):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    SELECT 1
                    FROM account
                    WHERE username = (?)
                    """,
                    (username,))
        res = cur.fetchall()
        return len(res) == 1


def create_user(username, password, wallet, private_key):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    INSERT INTO account (username, wallet)
                    VALUES(?,?)""",
                    (username, wallet))
        account_id = cur.lastrowid
        cur.execute("""
                    INSERT INTO credentials (account_id, password, private_key)
                    VALUES(?,?,?)""",
                    (account_id, password, private_key))


def get_user(username):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    SELECT a.username, a.wallet , c.password, c.private_key 
                    FROM account a
                    LEFT JOIN credentials c
                    ON a.id = c.account_id 
                    WHERE a.username = (?)
                    """,
                    (username,))
        res = cur.fetchall()

        if len(res) == 1:
            return {"username": res[0][0], "wallet": res[0][1], "password": res[0][2], "private_key": res[0][3]}

        return None


def create_project(username, project_addy):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    INSERT INTO projects (owner_id , project_addy)
                    VALUES (
                        (SELECT a.id 
                        FROM account a
                        WHERE a.username = (?)),
                        (?)
                    ) 
                    """,
                    (username, project_addy))


def get_all_project_addy():
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    SELECT project_addy
                    FROM projects
                    """)
        res = cur.fetchall()
        project_addy_ls = [i[0] for i in res]
        return project_addy_ls


def donate(username, project_addy, amount):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    INSERT INTO transactions (account_id , to_addy, amount)
                    VALUES (
                        (SELECT a.id 
                        FROM account a
                        WHERE a.username = (?)),
                        (?),(?)
                    )
                    """,
                    (username, project_addy, amount))


def get_all_transaction_from_user(username):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    SELECT t.to_addy, t.amount, t.ts 
                    FROM transactions t
                    LEFT JOIN account a
                    ON a.id = t.account_id 
                    WHERE a.username = (?)
                    ORDER BY t.ts DESC 
                    """,
                    (username,))
        res = cur.fetchall()
        return res


if __name__ == '__main__':
    ...
    # print(user_exist('a'))
    # init_tables()
    # create_user('v', 'a', 'a', 'd')
    # print(db.user_exist('a'))
    # create_user(2,2,3)
    # create_project('string','string_fake_addy')
    # a = get_all_project_addy()
    # print(a)
    # donate('test','string_fake_addy',10)
    get_all_transaction_from_user('string')