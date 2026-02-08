const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const requireRole = require("../middleware/role.middleware"); 
const validate = require("../middleware/validate.middleware");
const { createPromptSchema, updatePromptSchema } = require("../validators/prompt.schema");
const ctrl = require("../controllers/prompt.controller");

router.use(auth, requireRole("admin"));

router.post("/", validate(createPromptSchema), ctrl.createPrompt);
router.get("/", ctrl.getPrompts);
router.get("/:id", ctrl.getPromptById);
router.put("/:id", validate(updatePromptSchema), ctrl.updatePrompt);
router.delete("/:id", ctrl.deletePrompt);

module.exports = router;