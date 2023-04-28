const express = require('express');
const app = express();
const Database = require("@replit/database")
const db = new Database()
app.use('/static', express.static(__dirname + '/static'));



app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');

});

app.get('/list/:id', (req, res) => {
	db.get(req.params.id).then(value => {
		res.send(makelisthtml(value));
	})
})

app.listen(3000, () => {
	console.log('listening on *:3000');
});

function makelisthtml(val) {
	listhtml = "<!DOCTYPE html><html><head>";
	listhtml += "<title>" + val.title + " | MTLM</title>";
	listhtml += `<meta name="description" content="${val.description}">`;
	listhtml += `<meta content="${val.title} | MTLM" property="og:title" />`;
	listhtml += `<meta content="${val.description}" property="og:description" />`;
	listhtml += "</head><body>";
	listhtml += `<div id="content">`
 	listhtml += "<h1>Loading tier list...</h1>";
	listhtml += `<p style='display: none' id='data'>${JSON.stringify(val)}</p></div>`
	listhtml += `<div id="footer"></div>`
	listhtml += "<script src='/static/client.js'></script></body></html>"
	return listhtml;
}

//const sample = require("./sample.json")
//db.set("0", sample).then(() => {});