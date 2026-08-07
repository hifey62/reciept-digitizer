import Database from "better-sqlite3";

const db = new Database();

db.exec(

    `
    CREATE TABLE user(
    id INTEGER PRIMARY KEY NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL

    )
    
    `
)

db.exec(
    `
    CREATE TABLE receipts (
    id INTEGER AUTOINCREMENT PRIMARY KEY NOT NULL ,
    vendor TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
    
    )
    
    `
)

db.exec(
    `
    CREATE TABLE items(
    id INTEGER AUTOINCREMENT PRIMARY KEY NOT NULL,
    receipt_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    FOREIGN KEY (receipt_id) REFERENCES receipts(id)
    )
    
    `
)