import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "./server/db.json";
const JWT_SECRET = process.env.JWT_SECRET;

// ===== DB HELPERS =====
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// ===== ADMIN AUTO-CREATE =====
(function initAdmin() {
  const db = readDB();
  if (!db.users.find(u => u.isAdmin)) {
    db.users.push({
      id: Date.now(),
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
      telegram: "v1le shop",
      xp: 0,
      level: 99,
      private: false,
      isAdmin: true
    });
    writeDB(db);
    console.log("✅ Admin account created");
  }
})();

// ===== AUTH MIDDLEWARE =====
function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

function adminOnly(req, res, next) {
  if (!req.user.isAdmin) return res.sendStatus(403);
  next();
}

// ===== AUTH =====
app.post("/api/signup", (req, res) => {
  const { username, email, password, telegram } = req.body;
  const db = readDB();

  if (db.users.find(u => u.username === username || u.email === email))
    return res.status(400).json({ error: "User exists" });

  db.users.push({
    id: Date.now(),
    username,
    email,
    telegram,
    password: bcrypt.hashSync(password, 10),
    xp: 0,
    level: 1,
    private: false,
    isAdmin: false
  });

  writeDB(db);
  res.json({ success: true });
});

app.post("/api/login", (req, res) => {
  const { identifier, password } = req.body;
  const db = readDB();

  const user = db.users.find(
    u => u.username === identifier || u.email === identifier
  );
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.sendStatus(401);

  const token = jwt.sign(user, JWT_SECRET);
  res.json({ token });
});

// ===== ADMIN KEY LOGIN =====
app.post("/api/admin-key", (req, res) => {
  if (req.body.key !== process.env.ADMIN_KEY) return res.sendStatus(403);
  const db = readDB();
  const admin = db.users.find(u => u.i
