const express = require("express");
const bodyParser = require("body-parser");
const randomWords = require("random-words");

var app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.post("/orders", (req, res, next) => {
  const order = (req.body.orderNo || 1).toString();
  res.json(createOrder(order));
});

app.get("/orders", (req, res, next) => {
  const order = getRandomInt(10, 20).toString();
  res.json(createOrder(order));
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function createOrder(orderNo) {
  return {
    OrderNo: orderNo,
    createdBy: "Internal Inc.",
    buyer: "The Buyer Co.",
    currency: { code: "EUR" },
    Items: [
      {
        product_ID: getRandomInt(1000, 1000000).toString(),
        quantity: getRandomInt(1, 10),
        title: randomWords(),
        price: getRandomInt(10, 20),
      },
    ],
  };
}
