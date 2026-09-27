const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Serve HTML, CSS and JavaScript files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`TexHive running at http://localhost:${PORT}`);
});