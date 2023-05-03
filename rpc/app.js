const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

//-----------------------------add routers paths-----------------------------//
const blockRouter = require("./routes/block");
const miningRouter = require("./routes/mining");
const transactionRouter = require("./routes/transaction");
const walletRouter = require("./routes/wallet");

//-----------------------------middleware-----------------------------//

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors());

//-----------------------------Routers---------------------------//
app.use("/block", blockRouter);
app.use("/mining", miningRouter);
app.use("/wallet", walletRouter);
app.use("/transaction", transactionRouter);

//-----------------------------Handling errors---------------------//
app.use((req, res, next) => {
  const error = new Error(`error 404 page not found`);
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
