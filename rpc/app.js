const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

//-----------------------------add routers paths-----------------------------//
const blockRouter = require("./routes/block");
const miningRouter = require("./routes/mining");
const transactionRouter = require("./routes/transaction");
const walletRouter = require("./routes/wallet");
const monitorRouter = require("./routes/monitor");

//-----------------------------middleware-----------------------------//

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//-----------------------------Routers---------------------------//
app.use("/block", blockRouter);
app.use("/mining", miningRouter);
app.use("/wallet", walletRouter);
app.use("/transaction", transactionRouter);
app.use("/monitor", monitorRouter);

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
