const fs = require("fs");
const crypto = require('crypto');

setTimeout(() => console.log("Timer 1 finished"), 5000);
setImmediate(() => console.log("Immediate 1 finished"));


fs.readFile("text-file.txt", () => {
    console.log("i/o finished");

    setTimeout(() => console.log("Timer 2 finished"), 4000);
    setTimeout(() => console.log("Timer 3 finished"), 3000);
    setImmediate(() => console.log("Immediate 2 finished"));

    process.nextTick(() => console.log("process.nextTick "));

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log("password encrypted");
    })
});

console.log("hello from the top level code");