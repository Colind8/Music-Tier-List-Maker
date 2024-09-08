const express = require('express');
const app = express();
const sqlite = require('sqlite3').verbose();
const db = new sqlite.Database('./mtlm.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
app.use('/static', express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(express.json());       // to support JSON-encoded bodies

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/static/index.html');

});

app.get('/editor', (req, res) => {
	res.send(make_editor_html());
});

app.get('/browse', (req, res) => {
	send_browse(res);
});

app.get('/editor/:id', (req, res) => {
	db.get(`SELECT * FROM TIERLISTS WHERE ID = ?`,[req.params.id], (error, results) => {
		if (results) {
			res.send(make_editor_html(results.DATA));
		} else {
			res.sendFile(__dirname + '/static/404.html');
		}
	});
});

app.get('/tutorial', (req, res) => {
	res.sendFile(__dirname + '/static/tutorial.html');
});

app.get('/list/:id', (req, res) => {
	db.get(`SELECT * FROM TIERLISTS WHERE ID = ?`,[req.params.id], (error, results) => {
		if (results) {
			res.send(makelisthtml(results.DATA));
		} else {
			res.sendFile(__dirname + '/static/404.html');
		}
	});
})

app.post('/editor/post', (req, res) => {
	/* db.list().then(keys => {
		db.set(`${keys.length}`, req.body.tierlist_data).then(() => {
			db.get(req.params.id).then(value => {
				res.redirect(`/list/${keys.length}`);
			})
		})
	}) */
	try {
		db.run(`INSERT INTO TIERLISTS (DATA) VALUES (?)`, [req.body.tierlist_data], (error) => {
			db.get(`SELECT ID FROM TIERLISTS ORDER BY ID DESC LIMIT 1`,[], (error, results) => {
				res.redirect(`/list/${results.ID}`)
			});
		});
	} catch (error) {
		throw error;
	}
})

app.listen(3000, () => {
	console.log('listening on *:3000');
	get_ids();
});

function get_ids() {
	db.all(`SELECT ID FROM TIERLISTS`,(error, results) => {
		console.log(`Serving ${results.length} tier lists!`);
	});
	
}


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
	listhtml += "<h1>Loading tier list Editor...</h1>";
	if (!data) {
		listhtml += `<p style='display: none' id='data'>ewoJImRhdGEiOiB7CgkJInRpdGxlIjogIlRpZXIgTGlzdCBUaXRsZSIsCgkJImF1dGhvciI6ICJOYW1lIiwKCQkiZGVzY3JpcHRpb24iOiAiRGVzY3JpcHRpb24iLAoJICAgICJ2ZXJzaW9uIjogMSwKCSAgICAic2hvd3JhbmtpbmdzIjogImZhbHNlIiwKCQkiaW52ZXJ0Y29sb3JzIjogImZhbHNlIgoJfSwKCSJ0aWVycyI6IFt7CgkJCSJ0aWVybmFtZSI6ICJTIiwKCQkJInRpZXJjb2xvciI6ICIjMzczNzBhIiwKCQkJInRpZXJkYXRhIjogW3sKCQkJCQkibmFtZSI6ICJTYW1wbGUiLAoJCQkJCSJsaW5rIjogImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9UjVZT1k4SnRnbmMiLAoJCQkJCSJkZXNjIjogIlJlbW92ZSB0aGlzIGlmIHlvdSB3YW50IiwKCQkJCQkiaW1hZ2UiOiAiaHR0cHM6Ly9paDAucmVkYnViYmxlLm5ldC9pbWFnZS4zNzcyMzkzNTAuOTUyOC9mbGF0LDgwMHg4MDAsMDc1LGYudTEuanBnIgoJCQkJfQoJCQldCgkJfSwgewoJCQkidGllcm5hbWUiOiAiQSIsCgkJCSJ0aWVyY29sb3IiOiAiIzE4MzgwYSIsCgkJCSJ0aWVyZGF0YSI6IFsKCQkJXQoJCX0sIHsKCQkJInRpZXJuYW1lIjogIkIiLAoJCQkidGllcmNvbG9yIjogIiMwYTM4MmEiLAoJCQkidGllcmRhdGEiOiBbCgkJCV0KCQl9LCB7CgkJCSJ0aWVybmFtZSI6ICJDIiwKCQkJInRpZXJjb2xvciI6ICIjMGExYTM4IiwKCQkJInRpZXJkYXRhIjogWwoJCQldCgkJfSwgewoJCQkidGllcm5hbWUiOiAiRCIsCgkJCSJ0aWVyY29sb3IiOiAiIzJjMGEzOCIsCgkJCSJ0aWVyZGF0YSI6IFsKCQkJXQoJCX0sIHsKCQkJInRpZXJuYW1lIjogIkYiLAoJCQkidGllcmNvbG9yIjogIiMzODBhMGEiLAoJCQkidGllcmRhdGEiOiBbCgkJCV0KCQl9CgldCn0K</p></div>`
	} else {
		listhtml += `<p style='display: none' id='data'>${data}</p></div>`
	}

	listhtml += `<div id="footer"></div><div id="tooltip"></div>`
	listhtml += `<script src="https://raw.githack.com/SortableJS/Sortable/master/Sortable.js"></script><script src='/static/editor.js'></script></body></html>`
	return listhtml;
}

/* async function make_browse_htmlbad() {
	console.log("BUILDING BROWSE")
	browsehtml = "<!DOCTYPE html><html><head>";
	browsehtml += `<title>Browse | MTLM</title>`;
	browsehtml += `<meta name="description" content="Browse user created Tier Lists">`;
	browsehtml += `<meta content="Browse | MTLM" property="og:title" />`;
	browsehtml += `<meta content="Browse user created Tier Lists" property="og:description" />`;
	browsehtml += `<link href="/static/style.css" rel="stylesheet" type="text/css" />`;
	browsehtml += `<link rel="icon" type="image/x-icon" href="/static/favicon.png" />`;
	browsehtml += "</head><body>";
	browsehtml += `<h1>Music Tier List Maker: Browse</h1>`;
	browsehtml += `<p>Sorted by most recent. Currently a work in progress.</p>`;
	db.list().then(keys => {
		console.log(keys);
		browse_data(keys).then(value => {
			//browsehtml += value;
			browsehtml += `</body></html>`;
			console.log("\n\n");
			console.log(browsehtml);
			return browsehtml;
		});


	});
}


async function browse_databad(ind) {
	bruh = "";
	for (i = ind.length - 1; i >= 0; i--) {
		console.log(`${i}: \n`);
		let myPromise = new Promise(function(resolve) {
			db.get(ind[i]).then(value => {
				//console.log(value);
				console.log("--------------");
				let TLstring = Buffer.from(value, 'base64').toString('utf-8');
				let TLobj = JSON.parse(TLstring);
				//console.log(TLobj);
				//bruh += `<p><a href="/list/${i}">${TLobj.title}</a> by ${TLobj.author}</p>`
				resolve(`<p><a href="/list/${ind[i]}">${TLobj.data.title}</a> by ${TLobj.data.author}</p>`);
			});
		});

		bruh += await myPromise;
		console.log(bruh);
	}
	console.log("\n\n");
	console.log(bruh);
	resolve(bruh);
}*/

async function send_browse(res) {
	browsehtml = "<!DOCTYPE html><html><head>";
	browsehtml += `<title>Browse | MTLM</title>`;
	browsehtml += `<meta name="description" content="Browse user created Tier Lists">`;
	browsehtml += `<meta content="Browse | MTLM" property="og:title" />`;
	browsehtml += `<meta content="Browse user created Tier Lists" property="og:description" />`;
	browsehtml += `<link href="/static/style.css" rel="stylesheet" type="text/css" />`;
	browsehtml += `<link rel="icon" type="image/x-icon" href="/static/favicon.png" />`;
	browsehtml += "</head><body>";
	browsehtml += `<div id="home_main">`;
	browsehtml += `<h1>Music Tier List Maker: Browse</h1>`;
	browsehtml += `<p>Sorted by most recent. Currently a work in progress.</p>`;
	db.all(`SELECT * FROM TIERLISTS ORDER BY ID DESC`,(error, results) => {
		for (let i = 0; i < results.length; i++) {
			let TLstring = Buffer.from(results[i].DATA, 'base64').toString('utf-8');
			let TLobj = JSON.parse(TLstring);
			browsehtml += `<p><a href="/list/${results[i].ID}">${TLobj.data.title}</a> by ${TLobj.data.author}</p>`;
		}
		browsehtml += `</div id="home_main"><div id='footer'>`;
		browsehtml += `<hr></hr><p>Music Tier List Maker by Colind8</p><a href="/">Create your own</a>`
		browsehtml += `</div></body></html>`;
		res.send(browsehtml);
	});
	
}