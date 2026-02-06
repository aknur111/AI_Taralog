const router = require("express").Router();
const validate = require("../middleware/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.schema");
const ctrl = require("../controllers/auth.controller");

router.post("/register", validate(registerSchema), ctrl.register);
router.post("/login", validate(loginSchema), ctrl.login);

module.exports = router;
