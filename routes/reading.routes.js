const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createReadingSchema, updateReadingSchema } = require("../validators/reading.schema");
const ctrl = require("../controllers/reading.controller");

router.post("/", auth, validate(createReadingSchema), ctrl.createReading);
router.get("/", auth, ctrl.getMyReadings);
router.get("/:id", auth, ctrl.getReadingById);
router.put("/:id", auth, validate(updateReadingSchema), ctrl.updateReading);
router.delete("/:id", auth, ctrl.deleteReading);

module.exports = router;
