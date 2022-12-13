const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const secretFile = require("./secret.json");
const { writeFileSync } = require("fs");
const open = require("open");

let secret =
  secretFile.otpauth_url && secretFile.ascii
    ? secretFile
    : speakeasy.generateSecret({ name: "ゲス GESU [SHORTLINK]" });

writeFileSync("secret.json", JSON.stringify(secret), "utf-8");

qrcode.toFile("qr.png", secret.otpauth_url);

open("qr.png");
