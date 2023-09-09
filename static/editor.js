const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
const default_data = `ewoJImRhdGEiOiB7CgkJInRpdGxlIjogIlRpZXIgTGlzdCBUaXRsZSIsCgkJImF1dGhvciI6ICJOYW1lIiwKCQkiZGVzY3JpcHRpb24iOiAiRGVzY3JpcHRpb24iLAoJICAgICJ2ZXJzaW9uIjogMSwKCSAgICAic2hvd3JhbmtpbmdzIjogImZhbHNlIiwKCQkiaW52ZXJ0Y29sb3JzIjogImZhbHNlIgoJfSwKCSJ0aWVycyI6IFt7CgkJCSJ0aWVybmFtZSI6ICJTIiwKCQkJInRpZXJjb2xvciI6ICIjMzczNzBhIiwKCQkJInRpZXJkYXRhIjogW3sKCQkJCQkibmFtZSI6ICJTYW1wbGUiLAoJCQkJCSJsaW5rIjogImh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9UjVZT1k4SnRnbmMiLAoJCQkJCSJkZXNjIjogIlJlbW92ZSB0aGlzIGlmIHlvdSB3YW50IiwKCQkJCQkiaW1hZ2UiOiAiaHR0cHM6Ly9paDAucmVkYnViYmxlLm5ldC9pbWFnZS4zNzcyMzkzNTAuOTUyOC9mbGF0LDgwMHg4MDAsMDc1LGYudTEuanBnIgoJCQkJfQoJCQldCgkJfSwgewoJCQkidGllcm5hbWUiOiAiQSIsCgkJCSJ0aWVyY29sb3IiOiAiIzE4MzgwYSIsCgkJCSJ0aWVyZGF0YSI6IFsKCQkJXQoJCX0sIHsKCQkJInRpZXJuYW1lIjogIkIiLAoJCQkidGllcmNvbG9yIjogIiMwYTM4MmEiLAoJCQkidGllcmRhdGEiOiBbCgkJCV0KCQl9LCB7CgkJCSJ0aWVybmFtZSI6ICJDIiwKCQkJInRpZXJjb2xvciI6ICIjMGExYTM4IiwKCQkJInRpZXJkYXRhIjogWwoJCQldCgkJfSwgewoJCQkidGllcm5hbWUiOiAiRCIsCgkJCSJ0aWVyY29sb3IiOiAiIzJjMGEzOCIsCgkJCSJ0aWVyZGF0YSI6IFsKCQkJXQoJCX0sIHsKCQkJInRpZXJuYW1lIjogIkYiLAoJCQkidGllcmNvbG9yIjogIiMzODBhMGEiLAoJCQkidGllcmRhdGEiOiBbCgkJCV0KCQl9CgldCn0K`
template_created = false;
const TLjson = window.atob(document.getElementById('data').innerHTML);
var TLobj = JSON.parse(TLjson);
var sortable = [];
var bin = "";
template_creator();

function template_creator() {
	if (document.getElementById('data').innerHTML == default_data) {
		template_created = true;
	}
	

	if (template_created == false) {
		TLobj.data.description = `Created using ${TLobj.data.author}'s tier list`;
		TLobj.data.author = "Name";
	}

	generate_content();
}

function generate_content() {
	contenthtml = `<h1 class="editable" contenteditable id='title'></h1>`;
	contenthtml += `<h2 class="editable" contenteditable id='author'></h2>`;
	contenthtml += `<p class="editable" contenteditable id='desc'></p>`;
	contenthtml += `<div id='tierlist'></div>`;
	contenthtml += "<div id='forms'></div>"
	document.getElementById('content').innerHTML = contenthtml;
	document.getElementById('title').innerHTML = TLobj.data.title;
	document.getElementById('author').innerHTML = TLobj.data.author;
	document.getElementById('desc').innerHTML = TLobj.data.description;
	document.getElementById('footer').innerHTML = `<hr></hr><p>Music Tier List Maker by Colind8</p><a href="/">Create your own</a>`;
	
	if (template_created == false) {
		generate_template_tierlist();
	} else {
		generate_tierlist();
	}
	
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

		tierhtml += `<div id="tiername${i}" onclick="clear_tooltip()" class="${tiernameclass}" style="background-color: ${TLobj.tiers[i].tiercolor}"><span>${TLobj.tiers[i].tiername}</span></div>`;

		tierhtml += `<div class="tiercontent" id="tiercontent${i}" style="background-color: ${TLobj.tiers[i].tiercolor}">`;
		tierhtml += `<div class="tieritems" id="tieritem${i}">`
		for (i2 = 0; i2 < TLobj.tiers[i].tierdata.length; i2++) {
			let itemdata = {
				name: TLobj.tiers[i].tierdata[i2].name,
				desc: TLobj.tiers[i].tierdata[i2].desc,
				img: TLobj.tiers[i].tierdata[i2].image,
				url: TLobj.tiers[i].tierdata[i2].link,
				rank: tierindex
			};
			tierhtml += `<div data-id="${tierindex}" id="item_${tierindex}" data-itemurl="${itemdata.url}" data-itemname="${itemdata.name}" data-itemdesc="${itemdata.desc}" data-itemimg="${itemdata.img}" class="item list-group-item" onclick='generate_tooltip(this)' onmousedown="clear_tooltip()">`
			//tierhtml += `<a target="_blank" href="${TLobj.tiers[i].tierdata[i2].link}">`
			tierhtml += `<img src="${TLobj.tiers[i].tierdata[i2].image}" alt="${TLobj.tiers[i].tierdata[i2].name}" draggable="false" title="" style="">`
			tierhtml += `</div>`
			tierindex++;
		}
		tierhtml += `</div></div>`
	}

	document.getElementById('tierlist').innerHTML = tierhtml;

	generate_sortables();
}

function generate_tooltip(el) {
	let editor_tooltip_html = ``;
	editor_tooltip_html += `<h3 id="tt_h" class="editable" contenteditable>${el.getAttribute('data-itemname')}</h3>`;
	editor_tooltip_html += `<p id="tt_p" class="editable" contenteditable>${el.getAttribute('data-itemdesc')}</p>`;
	editor_tooltip_html += `<p>Link URL:</p>`
	editor_tooltip_html += `<p id="tt_u" class="editable imglink" contenteditable>${el.getAttribute('data-itemurl')}</p>`;
	editor_tooltip_html += `<p>Image URL:</p>`
	editor_tooltip_html += `<p id="tt_i" class="editable imglink" contenteditable>${el.getAttribute('data-itemimg')}</p>`;
	editor_tooltip_html += `<button onclick="itemdata_change('${el.getAttribute('id')}')">Apply</button>`
	document.getElementById('tooltip').innerHTML = editor_tooltip_html;
	document.getElementById('tooltip').style.opacity = 1;
	document.getElementById('tooltip').style.display = 'block';
	tooltip_move(event);
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

function generate_sortables() {
	for (i = 0; i < TLobj.tiers.length; i++) {
		let a = document.getElementById(`tieritem${i}`)
		Sortable.create(a, {
			animation: 150,
			ghostClass: 'blue-background-class',
			dataIdAttr: 'data-id',
			group: "tier"
		});
	}
	generate_forms();

}

function itemdata_change(item) {
	let a = document.getElementById('tt_h').innerHTML;
	document.getElementById(`${item}`).setAttribute('data-itemname', a);

	let b = document.getElementById('tt_p').innerHTML;
	document.getElementById(`${item}`).setAttribute('data-itemdesc', b);

	let d = document.getElementById('tt_u').innerHTML;
	document.getElementById(`${item}`).setAttribute('data-itemurl', d);

	let c = document.getElementById('tt_i').innerHTML;
	document.getElementById(`${item}`).setAttribute('data-itemimg', c);
	document.getElementById(`${item}`).innerHTML = `<img src="${c}" alt="${a}" draggable="false" title="" style="">`

	clear_tooltip();
}

function generate_forms() {
	formshtml = `<div id="forms_buttons"><button onclick="add_item()">Create New Item</button>`
	formshtml += `<button onclick="save_object()">Refresh</button>`;
	formshtml += `<button onclick="clear_bin()">Remove items in bin</button></div>`
	formshtml += `<div id="bin"></div>`
	formshtml += `<div id="tier_manager_root"></div>`
	formshtml += `<div id="tierlist_settings"></div>`
	document.getElementById('forms').innerHTML = formshtml;
	document.getElementById('bin').innerHTML = bin;


	generate_tier_manager();
	generate_tierlist_settings();
	let aformz = document.getElementById('bin')
	Sortable.create(aformz, {
		animation: 150,
		ghostClass: 'blue-background-class',
		dataIdAttr: 'data-id',
		group: "tier"
	});
}

function add_item() {
	clear_tooltip();
	let bin = document.getElementById('bin').innerHTML;
	tierindex++;
	let itemdata = {
		name: "New Item",
		desc: "Description",
		img: "https://ih0.redbubble.net/image.377239350.9528/flat,800x800,075,f.u1.jpg",
		url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		rank: tierindex
	};
	bin += `<div data-id="${tierindex}" id="item_${tierindex}" data-itemurl="${itemdata.url}" data-itemname="${itemdata.name}" data-itemdesc="${itemdata.desc}" data-itemimg="${itemdata.img}" class="item list-group-item" onclick='generate_tooltip(this)' onmousedown="clear_tooltip()">`
	//tierhtml += `<a target="_blank" href="${TLobj.tiers[i].tierdata[i2].link}">`
	bin += `<img src="https://ih0.redbubble.net/image.377239350.9528/flat,800x800,075,f.u1.jpg" alt="${itemdata.name}" draggable="false" title="" style="">`
	bin += `</div>`
	document.getElementById('bin').innerHTML = bin;
}

function clear_bin() {
	clear_tooltip();
	document.getElementById('bin').innerHTML = "";
}

async function save_object() {
	clear_tooltip();
	let tier_count = (document.getElementById('tierlist').childElementCount) / 2;
	var newobj = {
		data: {
			title: document.getElementById('title').innerHTML,
			author: document.getElementById('author').innerHTML,
			description: document.getElementById('desc').innerHTML,
			version: 1,
			showrankings: TLobj.data.showrankings,
			invertcolors: TLobj.data.invertcolors
		},
		tiers: []
	}

	tier_skip = 0;
	for (i = 0; i < tier_count; i++) { // Each tier
		ctj_tier = document.getElementById(`tieritem${i}`);
		while (typeof (ctj_tier) == 'undefined' || ctj_tier == null) {
			tier_skip++;
			ctj_tier = document.getElementById(`tieritem${i + tier_skip}`);
		}

		ctj_tiername = document.getElementById(`tiername${i + tier_skip}`);
		newobj.tiers.push({
			tiername: ctj_tiername.children[0].innerText,
			tiercolor: rgb2hex(ctj_tiername.style.backgroundColor),
			tierdata: []
		});

		for (i2 = 0; i2 < ctj_tier.childElementCount; i2++) { // Each item per tier
			newobj.tiers[i].tierdata.push({
				name: ctj_tier.children[i2].getAttribute('data-itemname'),
				link: ctj_tier.children[i2].getAttribute('data-itemurl'),
				desc: ctj_tier.children[i2].getAttribute('data-itemdesc'),
				image: ctj_tier.children[i2].getAttribute('data-itemimg')
			});
		}
	}
	TLobj = newobj;
	bin = document.getElementById('bin').innerHTML;
	generate_content();
}

function generate_tier_manager() {
	tier_managerhtml = `<button onclick="tier_add()">Add New Tier</button>`;
	tier_managerhtml += `<div id="tier_manager">`
	tier_managerhtml += `<div id="tier_manager_tiers">`;
	for (i = 0; i < TLobj.tiers.length; i++) {
		if (TLobj.data.invertcolors == "true") {
			tier_managerhtml += `<div id="tierm_id${i}" data-id="${i}" style="background-color: ${TLobj.tiers[i].tiercolor}" class="tierm_item list-group-item text_color_inverted" onclick="generate_tier_manager_selected(${i})">${TLobj.tiers[i].tiername} tier</div>`;
		} else {
			tier_managerhtml += `<div id="tierm_id${i}" data-id="${i}" style="background-color: ${TLobj.tiers[i].tiercolor}" class="tierm_item list-group-item text_color" onclick="generate_tier_manager_selected(${i})">${TLobj.tiers[i].tiername} tier</div>`;
		}

	}
	tier_managerhtml += `</div>`

	tier_managerhtml += `<div id="tier_manager_editor"></div></div>`
	document.getElementById('tier_manager_root').innerHTML = tier_managerhtml;

	generate_tier_manager_selected(0);

	let tierm = document.getElementById('tier_manager_tiers');
	Sortable.create(tierm, {
		animation: 150,
		dataIdAttr: 'data-id',

		onUpdate: function(evt) {
			update_tiers(evt);
		},
	});
}

function generate_tier_manager_selected(selected_tier) {
	tier_selectedhtml = ``;
	tier_selectedhtml += `<h3><span contenteditable class="editable" id="tier_title_span">${TLobj.tiers[selected_tier].tiername}</span> tier</h3>`
	tier_selectedhtml += `<input id="tier_edit_color" type="color" value="${TLobj.tiers[selected_tier].tiercolor}">`
	tier_selectedhtml += `<button onclick="tier_edit_save(${selected_tier})">Apply Changes</button>`
	if (document.getElementById('tier_manager_tiers').children.length > 1) {
		tier_selectedhtml += `<button onclick="tier_edit_delete(${selected_tier})">Delete Tier</button>`
	}
	document.getElementById('tier_manager_editor').innerHTML = tier_selectedhtml;

	document.getElementById('tier_title_span').addEventListener('keydown', (evt) => {
		if (evt.keyCode === 13) {
			evt.preventDefault();
		}
	});

}

function update_tiers(evt) {
	switch_this = evt.oldIndex;  // element's old index within old parent
	with_this = evt.newIndex;  // element's new index within new parent
	clear_tooltip();
	let tier_count = (document.getElementById('tierlist').childElementCount) / 2;
	var newobj = {
		data: {
			title: document.getElementById('title').innerHTML,
			author: document.getElementById('author').innerHTML,
			description: document.getElementById('desc').innerHTML,
			version: 1,
			showrankings: TLobj.data.showrankings,
			invertcolors: TLobj.data.invertcolors
		},
		tiers: []
	}

	tier_skip = 0;
	for (i = 0; i < tier_count; i++) { // Each tier
		ctj_tier = document.getElementById(`tieritem${i}`);
		while (typeof (ctj_tier) == 'undefined' || ctj_tier == null) {
			tier_skip++;
			ctj_tier = document.getElementById(`tieritem${i + tier_skip}`);
		}

		ctj_tiername = document.getElementById(`tiername${i + tier_skip}`);
		newobj.tiers.push({
			tiername: ctj_tiername.innerText,
			tiercolor: rgb2hex(ctj_tiername.style.backgroundColor),
			tierdata: []
		});

		for (i2 = 0; i2 < ctj_tier.childElementCount; i2++) { // Each item per tier
			newobj.tiers[i].tierdata.push({
				name: ctj_tier.children[i2].getAttribute('data-itemname'),
				link: ctj_tier.children[i2].getAttribute('data-itemurl'),
				desc: ctj_tier.children[i2].getAttribute('data-itemdesc'),
				image: ctj_tier.children[i2].getAttribute('data-itemimg')
			});
		}
	}
	TLobj = newobj;

	var element = TLobj.tiers[switch_this];
	TLobj.tiers.splice(switch_this, 1);
	TLobj.tiers.splice(with_this, 0, element);
	/*
	let temp_arr = TLobj.tiers[switch_this];
	TLobj.tiers[switch_this] = TLobj.tiers[with_this];
	TLobj.tiers[with_this] = temp_arr;*/
	bin = document.getElementById('bin').innerHTML;
	generate_content();
}

function tier_edit_save(tier_id) {
	ctj_tier = document.getElementById(`tiercontent${tier_id}`);
	ctj_tiername = document.getElementById(`tiername${tier_id}`);

	ctj_tiername.style.backgroundColor = document.getElementById('tier_edit_color').value;
	ctj_tiername.children[0].innerText = document.getElementById('tier_title_span').innerText;
	ctj_tier.style.backgroundColor = document.getElementById('tier_edit_color').value;

	if (ctj_tiername.children[0].innerText.length > 1) {
		ctj_tiername.className = "tiername multi_letter";
	} else {
		ctj_tiername.className = "tiername single_letter";
	}

	save_object();
}

function tier_edit_delete(tier_id) {
	ctj_tier = document.getElementById(`tiercontent${tier_id}`);
	ctj_tiername = document.getElementById(`tiername${tier_id}`);

	ctj_tier.remove();
	ctj_tiername.remove();
	document.getElementById(`tierm_id${tier_id}`).remove();
	save_object();
}

function tier_add() {
	let ni = TLobj.tiers.length;
	document.getElementById('tier_manager_tiers').innerHTML += `<div id="tierm_id${ni}" data-id="${ni}" style="background-color: #381A0A" class="tierm_item list-group-item" onclick="generate_tier_manager_selected(${ni})">"?" tier</div>`;
	document.getElementById('tierlist').innerHTML += `<div id="tiername${ni}" onclick="clear_tooltip()" class="tiername single_letter" style="background-color: #381A0A"><span>?</span></div>`;

	document.getElementById('tierlist').innerHTML += `<div class="tiercontent" id="tiercontent${ni}" style="background-color: #381A0A"><div class="tieritems" id="tieritem${ni}"></div></div>`;
	save_object();
}

function generate_tierlist_settings() {
	document.getElementById('tierlist_settings').innerHTML = `<h3>Settings:</h3><div id="tierlist_settings_1"></div><h3>Saving:</h3><div id="tierlist_settings_2"></div>`;
	if (TLobj.data.showrankings == "false") {
		document.getElementById('tierlist_settings_1').innerHTML = `<button id="toggle_ranks" onclick="toggle('ranks')" class="toggle toggle_off">Enable Rankings</button>`;
	} else {
		document.getElementById('tierlist_settings_1').innerHTML = `<button id="toggle_ranks" onclick="toggle('ranks')" class="toggle toggle_on">Disable Rankings</button>`;
	}

	if (TLobj.data.invertcolors == "false") {
		document.getElementById('tierlist_settings_1').innerHTML += `<button id="toggle_invert" onclick="toggle('invert')" class="toggle toggle_off">Invert Text Colors</button>`
	} else {
		document.getElementById('tierlist_settings_1').innerHTML += `<button id="toggle_invert" onclick="toggle('invert')" class="toggle toggle_on">UnInvert Text Colors</button>`
	}

	document.getElementById('tierlist_settings_2').innerHTML = `<button onclick="save_localsave()">Save to LocalStorage</button><button onclick="load_localsave()">Load from LocalStorage</button><br/>`;
	document.getElementById('tierlist_settings_2').innerHTML += `<form id="submit_form" action="/editor/post" method="post"></form>`
	document.getElementById('submit_form').innerHTML += `<button type="submit" value="Publish">Publish</button><textarea readonly id="tierlist_code" name="tierlist_data"></textarea>`
	document.getElementById('tierlist_code').innerText = window.btoa(JSON.stringify(TLobj))
}

function toggle(option) {
	switch (option) {
		case "ranks":
			if (TLobj.data.showrankings == "false") {
				TLobj.data.showrankings = "true";
			} else {
				TLobj.data.showrankings = "false";
			}
			break;
		case "invert":
			if (TLobj.data.invertcolors == "false") {
				TLobj.data.invertcolors = "true";
			} else {
				TLobj.data.invertcolors = "false";
			}
			break;
	}
	save_object();
}

function load_localsave() {
	LSdata = localStorage.getItem("savedata");
	if (LSdata) {
		TLobj = JSON.parse(window.atob(LSdata));
		generate_content();
	}
}

function save_localsave() {
	save_object().then(() => {
		LSdata = JSON.stringify(TLobj);
		LSdata = window.btoa(LSdata);
		localStorage.setItem("savedata", LSdata);
		load_localsave();
	});


}


function generate_template_tierlist() {
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

		tierhtml += `<div id="tiername${i}" onclick="clear_tooltip()" class="${tiernameclass}" style="background-color: ${TLobj.tiers[i].tiercolor}"><span>${TLobj.tiers[i].tiername}</span></div>`;

		tierhtml += `<div class="tiercontent" id="tiercontent${i}" style="background-color: ${TLobj.tiers[i].tiercolor}">`;
		tierhtml += `<div class="tieritems" id="tieritem${i}">`
		for (i2 = 0; i2 < TLobj.tiers[i].tierdata.length; i2++) {
			let itemdata = {
				name: TLobj.tiers[i].tierdata[i2].name,
				desc: "Description",
				img: TLobj.tiers[i].tierdata[i2].image,
				url: TLobj.tiers[i].tierdata[i2].link,
				rank: tierindex
			};
			bin += `<div data-id="${tierindex}" id="item_${tierindex}" data-itemurl="${itemdata.url}" data-itemname="${itemdata.name}" data-itemdesc="${itemdata.desc}" data-itemimg="${itemdata.img}" class="item list-group-item" onclick='generate_tooltip(this)' onmousedown="clear_tooltip()">`
			//tierhtml += `<a target="_blank" href="${TLobj.tiers[i].tierdata[i2].link}">`
			bin += `<img src="${TLobj.tiers[i].tierdata[i2].image}" alt="${TLobj.tiers[i].tierdata[i2].name}" draggable="false" title="" style="">`
			bin += `</div>`
			tierindex++;
		}
		tierhtml += `</div></div>`
	}

	document.getElementById('tierlist').innerHTML = tierhtml;

	template_created = true;

	generate_sortables();
}
