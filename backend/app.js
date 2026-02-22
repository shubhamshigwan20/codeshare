const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const {
  routeNotFound,
  errorHandler,
} = require("./middleware/commonMiddlewares");
const router = require("./routes/routes");

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cors({}));

app.use(router);

app.use(routeNotFound);

app.use(errorHandler);

module.exports = app;
