const { json } = require("express/lib/response");
const res = require("express/lib/response");
const fs = require("fs"); // for reading and writing files
const http = require("http"); // module for making a server
const url = require("url"); // to handles url
const replaceTemplate = require("./modules/replaceTemplate"); // importing module
const slugify = require("slugify"); // last part of url

// const hello = "Hello World!";
// console.log(hello);

/* FILE SYSTEM

/* Synchronous Way

// this function takes two arguments.
//1-> first is path of the file
//2-> second is the type of the file in whichwe want to read it i.e utf-8 which is a human redable method
console.log(`---------------Synchronous Way------------------`);

const textIn = fs.readFileSync("./txt/input.txt", "utf-8"); // reading data from file input.txt
console.log(textIn);

const textOut = `This is what we know about the avacado:${textIn} \n Created on ${Date.now()}`;
// this function takes two arguments.
// 1-> first is path of file
// 2-> second is what we want to write in the file
fs.writeFileSync("./txt/output.txt", textOut); // method of writting in the file
console.log(`File has been Written!`);

*/

/* Asynchronous Way

console.log(`---------------Asynchronous Way-----------------`);

fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log(`Error Occured Wrong Filename😥`); // if in case wrong file name is entered
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);

      // writing a file
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log(`Yoyr file has been written!😎`);
      }); // as in writing the file we are not reading any data therefore only one argument i.e error is passed
    });
  });
});
console.log(`This Will be Printed First Beacuse of Asynchrounus`);

*/

// SERVER
// reading the files
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const product_data = JSON.parse(data);

// console.log(slugify("Fresh Avacado", { lower: true }));

const slugs = product_data.map((el) =>
  slugify(el.productName, { lower: true })
);
console.log(slugs);

// creating a server
const server = http.createServer((req, res) => {
  console.log(req.url);
  console.log(url.parse(req.url));
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    // routing
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = product_data.map((el) => replaceTemplate(tempCard, el));

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);

    res.end(output);
  }
  //PRODUCT PAGE
  else if (pathname === "/product") {
    console.log(query);
    const product = product_data[query.id];
    console.log(product);
    res.writeHead(200, { "Content-type": "text/html" });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" }); //to tell the browser that sending the data in json fromat otherwise it will give an error
    res.end(data);
  }

  // NOT FOUND
  else {
    res.writeHead(404, {
      // this is always written before sending th response to server
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page Not Found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log(`Listening To Request on Port 8000`); // after running the command node index in cmd open url 127.0.0.1:8000 in your browser
});
