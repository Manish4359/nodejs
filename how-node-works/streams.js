const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  /* fs.readFile("./test-file.txt", "utf-8", (err, data) => {
    if (err) console.error(err);
    res.end(data);
});*/
  /*
  const readable = fs.createReadStream("./test-file.txt");
  readable.on("data", (chunk) => {
    res.write(chunk);
    readable.on("end", () => res.end(chunk));
  });

  readable.on("error", (err) => {
    console.log(err);
    res.statusCode = 500;

    res.end("file not found");
  });*/

  const readable = fs.createReadStream("./test-file.txt");
  readable.pipe(res);
});

server.listen(5000, () => console.log("listening to port 5000"));
