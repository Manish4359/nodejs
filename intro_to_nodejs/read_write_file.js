
const fs = require('fs')


//synchronous
const textInp = fs.readFileSync('./test-file.txt','utf-8')

console.log(textInp)

fs.writeFileSync('../test-file.txt',`[updated]${textInp}`)

//asynchronous
fs.readFile('../test-file.txt',(err,data)=>setTimeout(()=>{
    if(err) throw new Error(err) 
    console.log(`File reading completed : ${data}`)},2000))
console.log('Reading file...')