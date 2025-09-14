import express from "express";
import bodyParser from "body-parser";
import qr from "qr-image";

const app = express();

// EJS setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Store last URL in memory (since we’re not saving to disk)
let lastURL = "";

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/generate", (req, res) => {
  lastURL = req.body.url;
  res.render("result", { url: lastURL });
});

// Serve QR as an image (streaming)
app.get("/qr.png", (req, res) => {
  if (!lastURL) {
    return res.status(400).send("No URL provided yet.");
  }
  const qr_svg = qr.image(lastURL, { type: "png" });
  res.type("png");
  qr_svg.pipe(res);
});

// Export for Vercel
export default app;

// For local dev (run with: npm run dev)
if (process.env.NODE_ENV !== "production") {
  const port = 3000;
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}
