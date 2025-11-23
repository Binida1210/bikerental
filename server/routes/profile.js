const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { query } = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "secret-change-me";

function auth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const token = auth.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

router.get("/", auth, async (req, res) => {
  const rows = await query(
    "SELECT id, username, role, email, phone, age FROM Users WHERE id = ?",
    [req.user.id]
  );
  res.json(rows[0]);
});

router.put("/", auth, async (req, res) => {
  // allow updating password, email, phone, age. Username is intentionally immutable via the profile endpoint
  const { password, email, phone, age } = req.body;
  const rows = await query("SELECT * FROM Users WHERE id = ?", [req.user.id]);
  const user = rows[0];
  if (!user) return res.status(404).json({ error: "Not found" });
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    await query("UPDATE Users SET passwordHash = ? WHERE id = ?", [
      hash,
      req.user.id,
    ]);
  }
  // update other profile fields (allow null to clear values)
  if (typeof email !== "undefined") {
    await query("UPDATE Users SET email = ? WHERE id = ?", [
      email || null,
      req.user.id,
    ]);
  }
  if (typeof phone !== "undefined") {
    await query("UPDATE Users SET phone = ? WHERE id = ?", [
      phone || null,
      req.user.id,
    ]);
  }
  if (typeof age !== "undefined") {
    await query("UPDATE Users SET age = ? WHERE id = ?", [
      age === null || age === "" ? null : Number(age),
      req.user.id,
    ]);
  }
  const updated = await query(
    "SELECT id, username, role, email, phone, age FROM Users WHERE id = ?",
    [req.user.id]
  );
  res.json(updated[0]);
});

module.exports = router;
