const fs = require('fs');

//creating simple web server--
const http = require('http');

//creating url--
const url = require('url');

//change the url name
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

/////////////////////////file////////////////


/*blocking,synchronous*/
//to read file ----

/*const textIn = fs.readFileSync('./1-node-farm/txt/input.txt', 'utf-8');
console.log(textIn);


const textBox = `About avacado : ${textIn}.\ncreated on ${Date.now()}`;

//write a file----
fs.writeFileSync('./1-node-farm/txt/output.txt', textBox);
console.log("file written!!");*/

/*non-blocking,asynchronous*/

/*
fs.readFile('./1-node-farm/txt/start.txt', 'utf-8', (err, data1) => {
    if (err) return console.log("error");
    fs.readFile(`./1-node-farm/txt/${data1}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);
        fs.readFile('./1-node-farm/txt/append.txt', 'utf-8', (err, data3) => {
            console.log(data3);

            fs.writeFile('./1-node-farm/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
                console.log('your file has been written')
            })
        });
    });
});
console.log('will read file');*/



/////////////////SERVER////////////////

/*
const server = http.createServer((req, res) => {
    const pathName = req.url;



    if (pathName === '/overview')
        res.end('we don\'t have any overview');

    else if (pathName === '/product')
        res.end('We don\'t have any product');

    else if (pathName === '/api') {

        fs.readFile('./1-node-farm/dev-data/data.json', 'utf-8', (err, data) => {

            const productData = JSON.parse(data);
            console.log(productData);

            res.writeHead(200, {
                'content-type': 'application/json',
            });

            res.end(data);
        });
        res.end('API');
    } else {
        res.write(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world',
        });
        res.end('<h1>Page not found</h1>');
    }

});

server.listen(8000, '127.0.0.1', () => {
    console.log("listening to requests from port 8000");
});*/

/*
const server = http.createServer((request, response) => {

    response.writeHead(200, {
        'Content-Type': 'application/json'
    });

    if (request.url === '/product') {
        fs.readFile('./1-node-farm/dev-data/data.json', 'utf-8', (err, data) => {
            let fruitData = JSON.parse(data);
            response.end(data);
        });
    } else {
        response.end('<h1 style="text-transform:uppercase;color:red">hello</h1> how are you');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("listening to requests from port 8000");
});

//`${__dirname}/1-node-farm/dev-data/data.json`
*/


//server



const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');

const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');

const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8');

const dataObj = JSON.parse(data);


const slug = dataObj.map(el => slugify(el.productName, {
    lower: true
}));

const server = http.createServer((request, response) => {

    const {
        query,
        pathname
    } = url.parse(request.url, true);

    if (pathname === '/' || pathname === '/overview') {
        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

        const cardsHtml = dataObj.map(elem => replaceTemplate(tempCard, elem)).join('');

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        response.end(output);
        response.end(slug);


    } else if (pathname === '/product') {
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        response.end(output);
    } else {
        response.end('<h1 style="text-transform:uppercase;color:red">hello</h1> how are you');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log("listening to requests from port 8000");
});