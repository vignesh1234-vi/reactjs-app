const http = require("http");
const fs = require("fs");
const path = require("path");

const buildPath = path.join(__dirname, "build");

const mimeTypes = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const requestedPath = decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.join(buildPath, requestedPath);

  if (!filePath.startsWith(buildPath)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  const target = fs.existsSync(filePath) && fs.statSync(filePath).isFile()
    ? filePath
    : path.join(buildPath, "index.html");

  fs.readFile(target, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not Found");
    }

    const contentType = mimeTypes[path.extname(target)] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`React application running on port ${PORT}`);
});
