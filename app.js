const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const viewRoutes = require("./routes/view.routes");
const authRoutes = require("./routes/auth.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);


app.use(express.static(path.join(__dirname, "public")));

app.use("/", viewRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use(errorMiddleware);
module.exports = app;
