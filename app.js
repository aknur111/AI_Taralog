const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const readingRoutes = require("./routes/reading.routes");
const adminRoutes = require("./routes/admin.routes");
const promptRoutes = require("./routes/prompt.routes");
const errorMiddleware = require("./middleware/error.middleware");
// const emailRoutes = require("./routes/email.routes");
const emailRoutes = require("./routes/email.routes");



const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prompts", promptRoutes);
app.use("/api/email", emailRoutes);


app.get("/api/health", (req, res) => res.json({ status: "ok" }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/dist")));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "client/dist/index.html"));
  });
}

app.use(errorMiddleware);

module.exports = app;
