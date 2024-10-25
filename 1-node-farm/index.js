const fs = require('fs');
const http = require('http');
const url = require('url');

/////////////////////////////
// FILES

// BLOCKING - SYNCRONOUS WAY
const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('File has been written');

// NON BLOCKING ASYNC WAY
fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {
	// if(err) return console.log('Error! 🤯')

	fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
		// console.log(data2);
		fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data3) => {
			// console.log(data3);

			fs.writeFile('./starter/txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
				// console.log('Your file has been written 🤗🍋');
			})
		});
	});
});
// console.log('Will read file');


/////////////////////////////
// SERVER AND ROUTING
const replaceTemplate = (temp, product)=> {
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTITY%}/g, product.quantity);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);
	
	if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
	
	return output;
} 


const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);


const server = http.createServer((req, res) => {
	const pathName = req.url;
	console.log(req.url);

	// OVERVIEW PAGE
	if(pathName === "/" || pathName === "/overview") {
		res.writeHead(200, {"content-type": "text/html"});
		const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
		res.end(output)
	// PRODUCT PAGE
	} else if(pathName === "/product") {
		res.end("This is product");		

	// API
	} else if(pathName === "/API") {
	res.writeHead(200, {
		"content-type":"application/json"
	});
	res.end(data)
	
	// NOT FOUND
	} else {
		res.writeHead(404, {
			"content-type": "text/html",
			"my-own-header": "Hello World",
		});
		res.end("<h1>Page not found</h1>")
	};
});

server.listen(8000, '127.0.0.1', () => {
	console.log('Listening to request on port 8000');
});


/////////////////////////////
