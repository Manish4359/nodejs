const EventEmitter = require("events");
const http = require("http");

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}
const myEmitter = new Sales();

myEmitter.on("newSale", () => {
  console.log("new sale");
});
myEmitter.on("newSale", (stock) => {
  console.log(`${stock} items left to sale`);
});
myEmitter.on("newSale", () => {
  console.log("new sale:ended");
});

myEmitter.emit("newSale", 5);

/////////////////////server///////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("request received");
  res.end("request received");
});

server.on("close", (req, res) => {
  console.log("server closed");
});

server.listen(8000, () => {
  console.log("listening to port 8000....");
});
