import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("../public"));

const db = new Low(new JSONFile("db.json"), {
  users: [],
  orders: [],
  products: [
    { id: 1, name: "God Complex", price: 10, inStock: true },
    { id: 2, name: "Killer Green Budz", price: 10, inStock: true }
  ]
});

await db.read();
await db.write();

/* --- ADMIN BOOTSTRAP --- */
if (!db.data.users.find(u => u.username === process.env.ADMIN_USERNAME)) {
  db.data.users.push({
    id: nanoid(),
    username: process.env.ADMIN_USERNAME,
    email: process.env.ADMIN_EMAIL,
    password: await bcrypt.hash(process.env.ADMIN_PASSWORD, 10),
    telegram: "v1le shop",
    level: 99,
    xp: 0,
    isAdmin: true,
    private: false
  });
  await db.write();
}

/* --- AUTH --- */
app.post("/api/login", async (req, res) => {
  const { identifier, password } = req.body;
  const user = db.data.users.find(
    u => u.username === identifier || u.email === identifier
  );
  if (!user) return res.status(401).json({ error: "Invalid login" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid login" });

  const token = jwt.sign(
    { id: user.id, admin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({ token, user: { username: user.username, level: user.level, xp: user.xp, isAdmin: user.isAdmin } });
});

app.post("/api/admin-key", (req, res) => {
  if (req.body.key !== process.env.ADMIN_KEY)
    return res.status(401).json({ error: "Invalid key" });

  const admin = db.data.users.find(u => u.isAdmin);
  const token = jwt.sign(
    { id: admin.id, admin: true },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );

  res.json({ token, user: { username: admin.username, level: admin.level, xp: admin.xp, isAdmin: true } });
});

/* --- PRODUCTS --- */
app.get("/api/products", async (_, res) => {
  res.json(db.data.products.filter(p => p.inStock));
});

/* --- ORDERS --- */
app.post("/api/order", async (req, res) => {
  const { userId, product, grams } = req.body;
  const price = grams * 10;

  const pending = db.data.orders.filter(o => o.userId === userId && o.status === "pending");
  if (pending.length >= 2)
    return res.status(400).json({ error: "Max 2 pending orders" });

  db.data.orders.push({
    id: nanoid(),
    userId,
    product,
    grams,
    price,
    status: "pending"
  });

  const user = db.data.users.find(u => u.id === userId);
  user.xp += grams * 10;
  user.level = Math.floor(user.xp / 100) + 1;

  await db.write();
  res.json({ success: true });
});

app.get("/api/orders/:userId", (req, res) => {
  res.json(
    db.data.orders.filter(o => o.userId === req.params.userId).slice(-5)
  );
});

app.listen(3000, () => {
  console.log("✅ v1leshop backend running on http://localhost:3000");
});
