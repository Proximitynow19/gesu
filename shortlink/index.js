const express = require("express");
const app = express();
const { nanoid } = require("nanoid");
const { writeFileSync } = require("fs");
const speakeasy = require("speakeasy");
const secretFile = require("./secret.json");
const { join } = require("path");

let { shorts } = require("./db.json");

if (!secretFile.ascii) return console.log("Missing OTP secret.");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/create", (req, res) => {
  if (!req.body || !req.body.href || !req.body.otp)
    return res.status(400).json({
      status: 404,
      data: "Missing body, 'href' or 'otp' property.",
      success: false,
    });

  if (
    !speakeasy.totp.verify({
      secret: secretFile.ascii,
      encoding: "ascii",
      token: req.body.otp,
    })
  )
    return res
      .status(403)
      .json({ status: 403, data: "Incorrect OTP.", success: false });

  let id = req.body.id || nanoid(6);

  if (shorts.find((k) => k.id == id))
    return res
      .status(409)
      .json({ status: 409, data: `ID ${id} already exists.`, success: false });

  shorts.push({ id, href: req.body.href });

  res.status(201).json({ status: 201, data: id, success: true });

  writeFileSync("db.json", JSON.stringify({ shorts }), "utf-8");
});

app.get("/", (_, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.delete("/:id", (req, res) => {
  if (!req.body || !req.body.otp)
    return res.status(400).json({
      status: 404,
      data: "Missing body or 'otp' property.",
      success: false,
    });

  if (
    !speakeasy.totp.verify({
      secret: secretFile.ascii,
      encoding: "ascii",
      token: req.body.otp,
    })
  )
    return res
      .status(403)
      .json({ status: 403, data: "Incorrect OTP.", success: false });

  const short = shorts.find((k) => k.id == req.params.id);

  if (!short)
    return res.status(404).json({
      status: 404,
      data: `Short '${req.params.id}' not found.`,
      success: false,
    });

  shorts = shorts.filter((k) => k.id != req.params.id);

  res.status(204).json({
    status: 204,
    data: `Deleted short ${req.params.id}.`,
    success: true,
  });

  writeFileSync("db.json", JSON.stringify({ shorts }), "utf-8");
});

app.get("/:id", (req, res) => {
  const short = shorts.find((k) => k.id == req.params.id);

  if (!short)
    return res.status(404).json({
      status: 404,
      data: `Short '${req.params.id}' not found.`,
      success: false,
    });

  res.redirect(short.href);
});

app.listen(process.env.SERVER_PORT || 8000, () => {
  console.log("Server Online.");
});
