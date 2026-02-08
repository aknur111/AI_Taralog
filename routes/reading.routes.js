const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createReadingSchema, updateReadingSchema } = require("../validators/reading.schema");
const ctrl = require("../controllers/reading.controller");

const { createTaroReading } = require("../controllers/readings/taroReading.controller");
const { createGeneralReading } = require("../controllers/readings/generalReading.controller");
const { createLoveReading } = require("../controllers/readings/loveReading.controller");
const { createMoneyReading } = require("../controllers/readings/moneyReading.controller");
const { createWorkReading } = require("../controllers/readings/workReading.controller");

const { 
  taroReadingSchema, 
  generalReadingSchema,
  loveReadingSchema, 
  moneyReadingSchema, 
  workReadingSchema 
} = require("../validators/readings.schema");

router.post("/taro", auth, validate(taroReadingSchema), createTaroReading);
router.post("/general", auth, validate(generalReadingSchema), createGeneralReading);
router.post("/love", auth, validate(loveReadingSchema), createLoveReading);
router.post("/money", auth, validate(moneyReadingSchema), createMoneyReading);
router.post("/work", auth, validate(workReadingSchema), createWorkReading);

router.post("/", auth, validate(createReadingSchema), ctrl.createReading);
router.get("/", auth, ctrl.getMyReadings);
router.get("/:id", auth, ctrl.getReadingById);
router.put("/:id", auth, validate(updateReadingSchema), ctrl.updateReading);
router.delete("/:id", auth, ctrl.deleteReading);

module.exports = router;