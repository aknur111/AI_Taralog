const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const { getProfile, updateProfile } = require("../controllers/user.controller");

router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

module.exports = router;
