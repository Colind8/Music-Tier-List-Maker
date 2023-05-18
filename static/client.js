val = document.getElementById('data').innerHTML;
val = val.replace(/"/g, ``);
const TLjson = window.atob(val);
const TLobj = JSON.parse(TLjson);


function generate_content() {
	contenthtml = "<h1 id='title'></h1>";
	contenthtml += "<h2 id='author'></h2>";
	contenthtml += "<p id='desc'></p>";
	contenthtml += "<div id='tierlist'></div>";
	document.getElementById('content').innerHTML = contenthtml;
	document.getElementById('title').innerHTML = TLobj.data.title;
	document.getElementById('author').innerHTML = TLobj.data.author;
	document.getElementById('desc').innerHTML = TLobj.data.description;
	document.getElementById('footer').innerHTML = `<hr></hr><p>Music Tier List Maker by Colind8</p><a href="/editor.html">Create your own</a>`;
	generate_tierlist();
}

function generate_tierlist() {
	tierhtml = ``;

	tierindex = 0;

	for (i = 0; i < TLobj.tiers.length; i++) {
		tiernameclass = "tiername ";

		if (TLobj.tiers[i].tiername.length > 1) {
			tiernameclass += "multi_letter "
		} else {
			tiernameclass += "single_letter "
		}

		if (TLobj.data.invertcolors == "true") {
			tiernameclass += "text_color_inverted "
		} else {
			tiernameclass += "text_color "
		}

		tierhtml += `<div class="${tiernameclass}" style="background-color: ${TLobj.tiers[i].tiercolor}"><span>${TLobj.tiers[i].tiername}</span></div>`;


		tierhtml += `<div class="tiercontent" style="background-color: ${TLobj.tiers[i].tiercolor}"><div class="tieritems">`;
		for (i2 = 0; i2 < TLobj.tiers[i].tierdata.length; i2++) {
			let tooltipdata = {
				name: TLobj.tiers[i].tierdata[i2].name,
				desc: TLobj.tiers[i].tierdata[i2].desc,
				rank: tierindex
			};
			tierhtml += `<div data-id="${tierindex}" class="item" onmouseover='generate_tooltip(${i}, ${i2}, ${tierindex})' onmousemove="tooltip_move(event)" onmouseout="clear_tooltip()">`
			if (TLobj.tiers[i].tierdata[i2].link != "") {
				tierhtml += `<a target="_blank" href="${TLobj.tiers[i].tierdata[i2].link}">`
			}
			tierhtml += `<img src="${TLobj.tiers[i].tierdata[i2].image}" alt="${TLobj.tiers[i].tierdata[i2].name}" draggable="false" title="" style="">`
			tierhtml += `</a></div>`
			tierindex++;
		}
		tierhtml += `</div></div>`
	}

	document.getElementById('tierlist').innerHTML = tierhtml;
}

function generate_tooltip(a, b, c) {

	if (TLobj.data.showrankings == "true") {
		document.getElementById('tooltip').innerHTML = `<h3>${TLobj.tiers[a].tierdata[b].name}</h3><p>#${c + 1}</p><p>${TLobj.tiers[a].tierdata[b].desc}</p>`;
	} else {
		document.getElementById('tooltip').innerHTML = `<h3>${TLobj.tiers[a].tierdata[b].name}</h3><p>${TLobj.tiers[a].tierdata[b].desc}</p>`;
	}
	document.getElementById('tooltip').style.opacity = 1;
	document.getElementById('tooltip').style.display = 'block';
	tooltip_move(event);
	//console.log(document.getElementById('tooltip').offsetWidth);
}

function tooltip_move(e) {
	//MOVE X
	if (e.clientX < (document.querySelector("body").clientWidth / 2)) { //left side
		document.getElementById('tooltip').style.width = ((document.querySelector("body").clientWidth - (e.clientX - e.offsetX)) - 100) + "px";
		document.getElementById('tooltip').style.left = e.clientX + "px";
	} else { //right side
		document.getElementById('tooltip').style.width = (e.clientX - e.offsetX - 20) + "px";
		document.getElementById('tooltip').style.left = (e.clientX - document.getElementById('tooltip').offsetWidth - 40) + "px";
	}

	// MOVE Y
	if ((e.clientY + document.getElementById('tooltip').offsetHeight + 80) < window.innerHeight) {
		document.getElementById('tooltip').style.top = e.clientY + "px";
	} else {
		document.getElementById('tooltip').style.top = (e.clientY - document.getElementById('tooltip').offsetHeight - 40) + "px";
	}
}

function clear_tooltip() {
	document.getElementById('tooltip').style.opacity = 0.25;
	document.getElementById('tooltip').style.display = 'none';
	document.getElementById('tooltip').innerHTML = "";
	document.getElementById('tooltip').style.width = '0px';
	document.getElementById('tooltip').style.left = "0px";
	document.getElementById('tooltip').style.top = "0px";
}

/*
var sortable = Sortable.create(tierlist, {
	animation: 150,
	ghostClass: 'blue-background-class',
	dataIdAttr: 'data-id'
});*/

generate_content();