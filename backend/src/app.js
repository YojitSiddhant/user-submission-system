const express = require("express");
const cors = require("cors");
const path = require("path");
const env = require("./config/env");
const submissionRoutes = require("./routes/submissionRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const corsOptions = {
  origin: env.frontendUrl,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy.",
  });
});

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/submissions", submissionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
