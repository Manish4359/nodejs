const http = require("http");
const url = require("url");
const fs = require("fs");

///////////READ/WRITE FILE
const data = fs.readFileSync(`../1-node-farm/dev-data/data.json`, "utf-8");
const dataJson = JSON.parse(data);

/////////////SERVER
const server = http.createServer((req, res) => {
  if (req.url === "/overview") {

    res.writeHead(200, {
      "Content-type": "application/json",
    });
    console.log(dataJson);
    res.end(data);  
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>page not found!!</h1>");
  }
});

server.listen(3000, () => {
  console.log(`listening to port 3000`);
});
