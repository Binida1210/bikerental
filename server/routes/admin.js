const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { User, Station, Post, Report } = require("../models");

// Admin: delete any post
router.delete("/posts/:id", adminOnly, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByPk(id);
  if (!post) return res.status(404).json({ error: "Not found" });
  await post.destroy();
  res.json({ success: true });
});
// Admin: view all reports
router.get("/reports", adminOnly, async (req, res) => {
  const reports = await Report.findAll({ include: [Station, User] });
  res.json(reports);
});

// Admin: update report status
router.put("/reports/:id", adminOnly, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const report = await Report.findByPk(id);
  if (!report) return res.status(404).json({ error: "Not found" });
  if (status) report.status = status;
  await report.save();
  res.json(report);
});

const JWT_SECRET = process.env.JWT_SECRET || "secret-change-me";

function adminOnly(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: "No token" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin")
      return res.status(403).json({ error: "Admins only" });
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Manage users
router.get("/users", adminOnly, async (req, res) => {
  const users = await User.findAll({ attributes: ["id", "username", "role"] });
  res.json(users);
});

router.put("/users/:id/role", adminOnly, async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await User.findByPk(id);
  if (!user) return res.status(404).json({ error: "Not found" });
  user.role = role;
  await user.save();
  res.json({ id: user.id, username: user.username, role: user.role });
});

// Manage stations
router.get("/stations", adminOnly, async (req, res) => {
  const stations = await Station.findAll();
  res.json(stations);
});

router.post("/stations", adminOnly, async (req, res) => {
  try {
    const { name, lat, lng, capacity, available, open } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum))
      return res.status(400).json({ error: "lat and lng must be numbers" });
    const capNum = capacity !== undefined ? Number(capacity) : 10;
    const availNum = available !== undefined ? Number(available) : 0;
    const s = await Station.create({
      name,
      lat: latNum,
      lng: lngNum,
      capacity: capNum,
      available: availNum,
      open: open === undefined ? true : !!open,
    });
    res.json(s);
  } catch (err) {
    console.error("Error creating station", err);
    res.status(400).json({ error: err.message });
  }
});

router.put("/stations/:id", adminOnly, async (req, res) => {
  const s = await Station.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  Object.assign(s, req.body);
  await s.save();
  res.json(s);
});

// Delete station
router.delete("/stations/:id", adminOnly, async (req, res) => {
  const s = await Station.findByPk(req.params.id);
  if (!s) return res.status(404).json({ error: "Not found" });
  await s.destroy();
  res.json({ success: true });
});

// Adjust station inventory (add/remove bikes)
router.post("/stations/:id/inventory", adminOnly, async (req, res) => {
  const { id } = req.params;
  const { delta } = req.body; // integer: positive to add, negative to remove
  const s = await Station.findByPk(id);
  if (!s) return res.status(404).json({ error: "Not found" });
  const newAvailable = s.available + Number(delta || 0);
  // clamp
  s.available = Math.max(0, Math.min(newAvailable, s.capacity));
  await s.save();
  res.json(s);
});

// Set capacity explicitly
router.post("/stations/:id/capacity", adminOnly, async (req, res) => {
  const { id } = req.params;
  const { capacity } = req.body;
  const s = await Station.findByPk(id);
  if (!s) return res.status(404).json({ error: "Not found" });
  s.capacity = Number(capacity || s.capacity);
  // ensure available <= capacity
  if (s.available > s.capacity) s.available = s.capacity;
  await s.save();
  res.json(s);
});

// Manage posts
router.get("/posts", adminOnly, async (req, res) => {
  const posts = await Post.findAll({
    include: [{ model: User, attributes: ["id", "username"] }],
  });
  res.json(posts);
});

module.exports = router;
