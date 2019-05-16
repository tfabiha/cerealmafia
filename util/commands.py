import os, sqlite3
from passlib.hash import sha256_crypt

from util import db

if os.environ['PWD'] == '/var/www/ccereal/ccereal':
    DB_FILE = DIR + "/var/www/ccereal/ccereal/data/database.db"
else: DB_FILE = "/data/database.db"

def add_user(username, password, wins=0, losses=0):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    data = c.execute("SELECT * FROM users;")
    for row in data:
        if username == row[1]:
            return False
    command = "INSERT INTO users(username,password,wins,losses)VALUES(?,?,?,?);"
    c.execute(command,(username,sha256_crypt.hash(password),wins,losses))
    db.commit()
    db.close()
    return True

def auth_user(username, password):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    data = c.execute("SELECT * FROM users")
    for row in data:
        if row[0] == username and sha256_crypt.verify(password, row[1]):
            db.close()
            return True
    db.close()
    return False


def get_id(username):
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    command = "SELECT id FROM users WHERE username = ?;"
    c.execute(command,(username))
    id = c.fetchall()
    db.close()
    return id[0][0]

def all_users():
    db = sqlite3.connect(DB_FILE)
    c = db.cursor()
    command = "SELECT username, password FROM users;"
    c.execute(command)
    all = c.fetchall()
    db.close()
    dict = {}
    for item in all:
        dict[item[0]] = item[1]
    return dict
    
db.create_table()
