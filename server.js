import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// EJS setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/generate", (req, res) => {
  const url = req.body.url;

  // Generate QR
  const qr_svg = qr.image(url, { type: "png" });
  const qrPath = path.join("public", "qr_image.png");
  qr_svg.pipe(fs.createWriteStream(qrPath));

  // Save message
  fs.writeFile("message.txt", url, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });

  // Render result page
  res.render("result", { url: url, qrImage: "/qr_image.png" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
