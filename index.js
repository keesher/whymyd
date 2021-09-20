require("dotenv").config();
const express = require("express");
const compression = require("compression");
const path = require("path");
const eta = require("eta");
const fs = require("fs");
const mongoose = require("mongoose");
const util = require("./helper/util");
const _ = require("lodash");

const Request = require("./models/request");
const { ppid } = require("process");

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "./client", "static")));

app.engine("eta", eta.renderFile);
app.set("view engine", "eta");
app.set("views", "./client/views");

const PORT = process.env.PORT || 5000;

const languages = {};
const availableLanguages = [];
const d = new Date();

const MONGODB_USER = process.env.MONGODB_USER;
const MONGODB_PW = process.env.MONGODB_PW;
const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB = process.env.MONGODB_DB;

const MONGODB_URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PW}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

console.log(MONGODB_URI);

// mongoose setup
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(MONGODB_URI, options);

fs.readdir("./languages", (err, filenames) => {
  for (let file of filenames) {
    fs.readFile("./languages/" + file, "utf-8", (err, content) => {
      let iso = file.split(".")[0];
      content = JSON.parse(content);
      content.settings["iso"] = iso;
      languages[iso] = content;
      availableLanguages.push({ iso: iso, value: content.settings.value, display_name: content.settings.display_name });
    });
  }
});

app.use((req, res, next) => {
  saveMetrics(req);
  next();
});

app.get("/", (req, res) => {
  const cookies = util.parseCookies(req.headers.cookie);
  const selectedLanguage = Object.keys(cookies).includes("selectedLanguage") ? cookies.selectedLanguage : "my";
  res.render("index", { ...languages[selectedLanguage], availableLanguages });
});

app.get("/learncrypto", (req, res) => {
  const cookies = util.parseCookies(req.headers.cookie);
  const selectedLanguage = Object.keys(cookies).includes("selectedLanguage") ? cookies.selectedLanguage : "my";
  res.render("learncrypto", { ...languages[selectedLanguage], availableLanguages });
});

app.get("/getmyd", (req, res) => {
  const cookies = util.parseCookies(req.headers.cookie);
  const selectedLanguage = Object.keys(cookies).includes("selectedLanguage") ? cookies.selectedLanguage : "my";
  res.render("getmyd", { ...languages[selectedLanguage], availableLanguages });
});

app.get("/whitepaper", (req, res) => {
  const cookies = util.parseCookies(req.headers.cookie);
  const selectedLanguage = Object.keys(cookies).includes("selectedLanguage") ? cookies.selectedLanguage : "my";
  res.render("whitepaper", { ...languages[selectedLanguage], availableLanguages });
});

app.get("/downloads", (req, res) => {
  const cookies = util.parseCookies(req.headers.cookie);
  const selectedLanguage = Object.keys(cookies).includes("selectedLanguage") ? cookies.selectedLanguage : "my";

  let raw = fs.readFileSync("./client/db/downloads.json");
  let contents = JSON.parse(raw);
  contents = contents.list;

  res.render("downloads", { ...languages[selectedLanguage], availableLanguages, contents });
});

app.get("/trade", (req, res) => {
  const cookies = util.parseCookies(req.headers.cookie);
  const selectedLanguage = Object.keys(cookies).includes("selectedLanguage") ? cookies.selectedLanguage : "my";
  res.render("trade", { ...languages[selectedLanguage], availableLanguages });
});

app.get("/mydshops", (req, res) => {
  const cookies = util.parseCookies(req.headers.cookie);
  const selectedLanguage = Object.keys(cookies).includes("selectedLanguage") ? cookies.selectedLanguage : "my";

  let raw = fs.readFileSync("./client/db/shops.json");
  let contents = JSON.parse(raw);
  contents = _.chunk(contents.list, 2);

  res.render("mydshops", { ...languages[selectedLanguage], availableLanguages, contents });
});

app.get("/sources", (req, res) => {
  const cookies = util.parseCookies(req.headers.cookie);
  const selectedLanguage = Object.keys(cookies).includes("selectedLanguage") ? cookies.selectedLanguage : "my";
  res.render("sources", { ...languages[selectedLanguage], availableLanguages });
});

// robots.txt
app.get("/robots.txt", function (req, res) {
  res.type("text/plain");
  res.send("User-agent: *\nDisallow:");
});

app.get("/sitemap.xml", (req, res) => {
  d.setDate(d.getDate() - 1);
  console.log(availableLanguages);
  res.header("Content-Type", "application/xml");
  res.render("sitemap", { date: d, languages: availableLanguages });
});

app.get("/:lang", (req, res) => {
  let selectedLanguage = req.params.lang;
  let available = availableLanguages.map((language) => language.iso);
  if (available.includes(selectedLanguage)) {
    res.render("index", { ...languages[selectedLanguage], availableLanguages });
  } else {
    res.render("404");
  }
});

app.get("*", (req, res) => {
  res.render("404");
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`listening on http://localhost:${PORT}`);
});

async function saveMetrics(req) {
  const cookies = util.parseCookies(req.headers.cookie);
  const existing = Object.keys(cookies).includes("selectedLanguage") ? "existing user" : "new user";
  const selectedLanguage = Object.keys(cookies).includes("selectedLanguage") ? cookies.selectedLanguage : "en";
  console.log(`${req.method} ${req.originalUrl} ${new Date()} ${existing} ${req.get("host")}`);
  Request.create({ base: req.get("host"), path: req.originalUrl, time: new Date(), newUser: !Object.keys(cookies).includes("selectedLanguage"), language: selectedLanguage });
}
