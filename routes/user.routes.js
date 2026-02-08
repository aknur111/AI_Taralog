const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { updateProfileSchema } = require("../validators/user.schema");
const ctrl = require("../controllers/user.controller");

router.get("/me", auth, ctrl.getProfile);
router.put("/me", auth, validate(updateProfileSchema), ctrl.updateProfile);

module.exports = router;
