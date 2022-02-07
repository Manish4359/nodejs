//core modules
const {createServer} = require("http");
const url = require("url");
const fs = require("fs");

//third-party module
const slugify = require("slugify");

//own modules
const replaceTemplate = require("./modules/replaceTemplates");

///////////READ/WRITE FILE

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const dataJson = JSON.parse(data);
const slugs = dataJson.map((item) =>
  slugify(item.productName, { lower: true })
);
console.log(slugs);

/////////////SERVER

const server = createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  console.log(query, pathname);
  //overview
  if (pathname === "/overview" || pathname === "/") {
    let cardHtml = dataJson
      .map((elem) => replaceTemplate(tempCard, elem))
      .join("");

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);

    res.writeHead(200, { "Content-type": "text/html" });
    res.end(output);

    //product
  } else if (pathname === "/product") {
    const product = dataJson.find((item) => {
      if (item.id === +query.id) return item;
    });

    const output = replaceTemplate(tempProduct, product);

    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(output);
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
