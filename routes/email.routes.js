const router = require("express").Router();
const { sendWelcomeEmail } = require("../services/email.service");

router.post("/test", async (req, res) => {
  const { to, firstName } = req.body;
  try {
    await sendWelcomeEmail({ to, firstName });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

module.exports = router;
