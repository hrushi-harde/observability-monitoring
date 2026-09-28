const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname);
const contentTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8"
};
const publicFiles = new Set(["/index.html", "/style.css", "/script.js"]);

http.createServer((request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
        response.writeHead(405, { Allow: "GET, HEAD" });
        response.end("Method Not Allowed");
        return;
    }

    let pathname;
    try {
        pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    } catch {
        response.writeHead(400);
        response.end("Bad Request");
        return;
    }

    const publicPath = pathname === "/" ? "/index.html" : pathname;
    if (!publicFiles.has(publicPath)) {
        response.writeHead(404);
        response.end("Not Found");
        return;
    }

    const filePath = path.join(root, publicPath);
    fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            response.writeHead(404);
            response.end("Not Found");
            return;
        }

        response.writeHead(200, {
            "Content-Length": stats.size,
            "Content-Type": contentTypes[path.extname(filePath)] || "application/octet-stream"
        });

        if (request.method === "HEAD") {
            response.end();
            return;
        }

        fs.createReadStream(filePath).pipe(response);
    });
}).listen(Number(process.env.PORT) || 8080, "0.0.0.0");