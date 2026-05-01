const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${port}`);
  const requested = url.pathname === "/" ? "/demo.html" : url.pathname;
  const filePath = path.join(root, requested);

  if (!filePath.startsWith(root) || !fs.existsSync(filePath)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, { "content-type": types[path.extname(filePath)] || "text/plain; charset=utf-8" });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Tech Atelier demo: http://localhost:${port}/demo.html`);
});
