const fs = require('fs');

const server = require('http').createServer();

server.on('request', (req, res) => {

    /*
    fs.readFile('test-file.txt', (err, data) => {
        if (err)
            console.log(err);

        res.end(data);
    });
*/
    //stream events
      const readable = fs.createReadStream('test-file.txt');
      readable.on("data", chunk => {
          res.write(chunk);
      });
      readable.on("end", () => {
          res.end();
      });
      readable.on("error", err => {
          console.log(err);
          res.statusCode = 500;
          res.end("file not found");
      });

    //pipe()-handles the speed of stream
    /*
    const readable = fs.createReadStream('test-file.txt');
   
    readable.pipe(res);*/

});

server.listen('8080', () => {
    console.log("listening");
});