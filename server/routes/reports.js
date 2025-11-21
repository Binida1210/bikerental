const express = require("express");
const router = express.Router();
const { Report, Station, User } = require("../models");
const jwt = require("jsonwebtoken");

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

// Edit report (user can update description)
router.put(":id", auth, async (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const report = await Report.findByPk(id);
  if (!report) return res.status(404).json({ error: "Not found" });
  if (report.UserId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });
  if (description) report.description = description;
  await report.save();
  res.json(report);
});

// Delete report (user can delete their own)
router.delete(":id", auth, async (req, res) => {
  const { id } = req.params;
  const report = await Report.findByPk(id);
  if (!report) return res.status(404).json({ error: "Not found" });
  if (report.UserId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });
  await report.destroy();
  res.json({ success: true });
});

router.get("/", async (req, res) => {
  const reports = await Report.findAll({ include: [Station, User] });
  res.json(reports);
});

router.get("/me", auth, async (req, res) => {
  const reports = await Report.findAll({
    where: { UserId: req.user.id },
    include: [Station],
  });
  res.json(reports);
});

router.post("/", auth, async (req, res) => {
  const { stationId, description } = req.body;
  const r = await Report.create({
    StationId: stationId,
    UserId: req.user.id,
    description,
  });
  res.json(r);
});

module.exports = router;
