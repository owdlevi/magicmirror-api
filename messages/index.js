const express = require("express");
const helmet = require("helmet");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const MessageSchema = new mongoose.Schema({
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Messages = mongoose.model("Messages", MessageSchema);

// this is our MongoDB database
const { MONGO_ADDRESS } = process.env;

// connects our back end code with the database
mongoose.connect(MONGO_ADDRESS, { useNewUrlParser: true });
const db = mongoose.connection;

app.use(helmet());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("*", async (req, res) => {
  try {
    const numberOfDaysToLookBack = 365;
    let messages = await Messages.find({
      createdAt: {
        $gte: new Date(
          new Date().getTime() - numberOfDaysToLookBack * 24 * 60 * 60 * 1000
        )
      }
    })
      .sort({ createdAt: "desc" })
      .lean()
      .exec();
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).send({ data: messages });
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.post("*", (req, res) => {
  Messages.create({ message: req.body.message }, (err, post) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(`Message added`);
  });
});

app.delete("*", (req, res) => {
  console.log(req.query.id);
  Messages.findOneAndDelete({ _id: req.query.id }, (err, message) => {
    if (err) return res.status(500).send(err);

    return res.status(200).send(message);
  });
});

module.exports = app;
