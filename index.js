const express = require('express');
const app = express();
const Database = require("@replit/database")
const db = new Database()
app.use('/static', express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/static/index.html');

});

app.get('/editor', (req, res) => {
	res.send(make_editor_html());
});

app.get('/editor/:id', (req, res) => {
	db.get(req.params.id).then(value => {
		if (value) {
			res.send(make_editor_html(value));
		} else {
			res.sendFile(__dirname + '/static/404.html');
		}
		
	})
});


app.get('/list/:id', (req, res) => {
	db.get(req.params.id).then(value => {
		if (value) {
			res.send(makelisthtml(value));
		} else {
			res.sendFile(__dirname + '/static/404.html');
		}
		
	})
})

app.post('/editor/post', (req, res) => {
	db.list().then(keys => {
		db.set(`${keys.length}`, req.body.tierlist_data).then(() => {
			db.get(req.params.id).then(value => {
				res.redirect(`/list/${keys.length}`);
			})
		})
	})
})

app.listen(3000, () => {
	console.log('listening on *:3000');
});

app.all('*', (req, res) => {
  res.status(404).sendFile(__dirname + '/static/404.html');
});

function makelisthtml(val) {
	let TLjson = Buffer.from(val, "base64");
	let decodedString = TLjson.toString("utf8");
	let TLobj = JSON.parse(decodedString);
	listhtml = "<!DOCTYPE html><html><head>";
	listhtml += `<title>${TLobj.data.title} | MTLM</title>`;
	listhtml += `<meta name="description" content="${TLobj.data.description}">`;
	listhtml += `<meta content="${TLobj.data.title} | MTLM" property="og:title" />`;
	listhtml += `<meta content="${TLobj.data.description}" property="og:description" />`;
	listhtml += `<link href="/static/style.css" rel="stylesheet" type="text/css" />`
	listhtml += `<link rel="icon" type="image/x-icon" href="/static/favicon.png" />`
	listhtml += "</head><body>";
	listhtml += `<div id="content">`
	listhtml += "<h1>Loading tier list...</h1>";
	listhtml += `<p style='display: none' id='data'>${val}</p></div>`
	listhtml += `<div id="footer"></div><div id="tooltip"></div>`
	listhtml += `<script src="https://raw.githack.com/SortableJS/Sortable/master/Sortable.js"></script><script src='/static/client.js'></script></body></html>`
	return listhtml;
}

function make_editor_html(data) {
	listhtml = "<!DOCTYPE html><html><head>";
	listhtml += `<title>Editor | MTLM</title>`;
	listhtml += `<meta name="description" content="Create your own Tier List">`;
	listhtml += `<meta content="Editor | MTLM" property="og:title" />`;
	listhtml += `<meta content="Create your own Tier List" property="og:description" />`;
	listhtml += `<link href="/static/style.css" rel="stylesheet" type="text/css" />`
	listhtml += `<link rel="icon" type="image/x-icon" href="/static/favicon.png" />`
	listhtml += "</head><body>";
	listhtml += `<div id="content">`
	listhtml += "<h1>Loading tier list...</h1>";
	if (!data) {
		listhtml += `<p style='display: none' id='data'>ewoJImRhdGEiOiB7CgkJInRpdGxlIjogIlRpZXIgTGlzdCBUaXRsZSIsCgkJImF1dGhvciI6ICJOYW1lIiwKCQkiZGVzY3JpcHRpb24iOiAiRGVzY3JpcHRpb24iLAoJICAgICJ2ZXJzaW9uIjogMSwKCSAgICAic2hvd3JhbmtpbmdzIjogImZhbHNlIiwKCQkiaW52ZXJ0Y29sb3JzIjogImZhbHNlIgoJfSwKCSJ0aWVycyI6IFt7CgkJCSJ0aWVybmFtZSI6ICJTIiwKCQkJInRpZXJjb2xvciI6ICIjMzczNzBhIiwKCQkJInRpZXJkYXRhIjogW3sKCQkJCQkibmFtZSI6ICJTYW1wbGUiLAoJCQkJCSJsaW5rIjogImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9UjVZT1k4SnRnbmMiLAoJCQkJCSJkZXNjIjogIlJlbW92ZSB0aGlzIGlmIHlvdSB3YW50IiwKCQkJCQkiaW1hZ2UiOiAiaHR0cHM6Ly9paDAucmVkYnViYmxlLm5ldC9pbWFnZS4zNzcyMzkzNTAuOTUyOC9mbGF0LDgwMHg4MDAsMDc1LGYudTEuanBnIgoJCQkJfQoJCQldCgkJfSwgewoJCQkidGllcm5hbWUiOiAiQSIsCgkJCSJ0aWVyY29sb3IiOiAiIzE4MzgwYSIsCgkJCSJ0aWVyZGF0YSI6IFsKCQkJXQoJCX0sIHsKCQkJInRpZXJuYW1lIjogIkIiLAoJCQkidGllcmNvbG9yIjogIiMwYTM4MmEiLAoJCQkidGllcmRhdGEiOiBbCgkJCV0KCQl9LCB7CgkJCSJ0aWVybmFtZSI6ICJDIiwKCQkJInRpZXJjb2xvciI6ICIjMGExYTM4IiwKCQkJInRpZXJkYXRhIjogWwoJCQldCgkJfSwgewoJCQkidGllcm5hbWUiOiAiRCIsCgkJCSJ0aWVyY29sb3IiOiAiIzJjMGEzOCIsCgkJCSJ0aWVyZGF0YSI6IFsKCQkJXQoJCX0sIHsKCQkJInRpZXJuYW1lIjogIkYiLAoJCQkidGllcmNvbG9yIjogIiMzODBhMGEiLAoJCQkidGllcmRhdGEiOiBbCgkJCV0KCQl9CgldCn0K</p></div>`
	} else {
		listhtml += `<p style='display: none' id='data'>${data}</p></div>`
	}
	
	listhtml += `<div id="footer"></div><div id="tooltip"></div>`
	listhtml += `<script src="https://raw.githack.com/SortableJS/Sortable/master/Sortable.js"></script><script src='/static/editor.js'></script></body></html>`
	return listhtml;
}

//const sample = ``;
//db.set("0", sample).then(() => { });
