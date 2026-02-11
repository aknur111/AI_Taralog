const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware");
const ctrl = require("../controllers/admin.controller");

router.get("/users", auth, requireRole("admin"), ctrl.getAllUsers);
router.get("/stats", auth, requireRole("admin"), ctrl.getStats);
router.get("/readings", auth, requireRole("admin"), ctrl.getAllReadings);
router.delete("/readings/:id", auth, requireRole("admin"), ctrl.deleteAnyReading);

module.exports = router;
