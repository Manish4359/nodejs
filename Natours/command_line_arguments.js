const {
    response
} = require('express');
const fs = require('fs');

const http = require('http');
const {
    argv
} = require('process');

http.createServer((req, res) => {

    response.writeHead('200', {
        'content-type': 'text/plain'
    });

    response.write(argv[2]);

    response.end();
}).listen('8080', () => {
    console.log("listening...")
});