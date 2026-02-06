const router = require("express").Router();
const path = require("path");
const viewsDir = path.join(__dirname, "..", "views");

router.get("/", (req, res) => res.sendFile(path.join(viewsDir, "index.html")));
router.get("/login", (req, res) => res.sendFile(path.join(viewsDir, "login.html")));
router.get("/register", (req, res) => res.sendFile(path.join(viewsDir, "register.html")));
router.get("/profile", (req, res) => res.sendFile(path.join(viewsDir, "profile.html")));
router.get("/readings", (req, res) => res.sendFile(path.join(viewsDir, "readings.html")));
router.get("/readings/new", (req, res) => res.sendFile(path.join(viewsDir, "reading-new.html")));

module.exports = router;
