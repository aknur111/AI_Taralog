require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const { loadEnv } = require("./config/env");

const PORT = process.env.PORT || 5000;

(async () => {
  loadEnv();
  await connectDB(process.env.MONGO_URI);



  app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
})();
