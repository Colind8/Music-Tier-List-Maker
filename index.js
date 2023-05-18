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
	listhtml += `<title>Test | MTLM</title>`;
	listhtml += `<meta name="description" content="test">`;
	listhtml += `<meta content="test | MTLM" property="og:title" />`;
	listhtml += `<meta content="test" property="og:description" />`;
	listhtml += `<link href="/static/style.css" rel="stylesheet" type="text/css" />`
	listhtml += "</head><body>";
	listhtml += `<div id="content">`
	listhtml += "<h1>Loading tier list...</h1>";
	listhtml += `<p style='display: none' id='data'>${val}</p></div>`
	listhtml += `<div id="footer"></div><div id="tooltip"></div>`
	listhtml += `<script src="https://raw.githack.com/SortableJS/Sortable/master/Sortable.js"></script><script src='/static/client.js'></script></body></html>`
	return listhtml;
}

//const sample = ``;
//db.set("0", sample).then(() => { });