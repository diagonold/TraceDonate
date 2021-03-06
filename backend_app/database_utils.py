import sqlite3
import time
import json

DB_FILE = "database.db"


def unix_time_now():
    return int(time.time())


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
                    INSERT INTO projects (owner_id , project_addy, ts)
                    VALUES (
                        (SELECT a.id 
                        FROM account a
                        WHERE a.username = (?)),
                        (?),(?)
                    ) 
                    """,
                    (username, project_addy, unix_time_now()))


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


def get_project_owner(project_addy):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    SELECT a.username 
                    FROM account a 
                    LEFT JOIN projects p 
                    ON a.id = p.owner_id 
                    WHERE p.project_addy = (?)
                    """,
                    (project_addy,))
        res = cur.fetchall()

        return res[0][0]


def donate(username, project_addy, amount):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    INSERT INTO transactions (account_id , to_addy, amount, ts)
                    VALUES (
                        (SELECT a.id 
                        FROM account a
                        WHERE a.username = (?)),
                        (?),(?),(?)
                    )
                    """,
                    (username, project_addy, amount, unix_time_now()))


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


def vote_request(username, project_addy, request_index):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    INSERT INTO votes (account_id, project_id, request_index, ts)
                    VALUES (
                        (SELECT a.id 
                        FROM account a
                        WHERE a.username = (?)),
                        (SELECT p.id 
                        FROM projects p
                        WHERE p.project_addy = (?)),
                        (?),(?)
                    )
                    """,
                    (username, project_addy, request_index, unix_time_now()))


def is_request_voted(username, project_addy, request_index):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    SELECT v.*
                    FROM votes v 
                    LEFT JOIN account a, projects p
                    ON a.id = v.account_id and p.id = v.project_id 
                    WHERE a.username = (?) 
                    AND p.project_addy = (?)
                    AND v.request_index = (?)
                    """,
                    (username, project_addy, request_index))
        res = cur.fetchall()
        return len(res) > 0


def is_participated_in_project(username, project_addy):
    with sqlite3.connect(DB_FILE) as con:
        cur = con.cursor()
        cur.execute("""
                    SELECT *
                    FROM account a
                    LEFT JOIN transactions t
                    ON a.id = t.account_id 
                    WHERE  a.username = (?)
                    AND t.to_addy =(?)
                    """,
                    (username, project_addy))
        res = cur.fetchall()
        return len(res) > 0


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
    # vote_request('string',
    #              '0xebF2E1C8814d94B301a248ee0d2a448E385F3744',
    #              0)
    a = is_request_voted('donor','0x2a804D98c43884d727502c2cfEFc761c7687B798', 1)
    print(a)
