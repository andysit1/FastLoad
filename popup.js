var groups = new Map();

function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

function update(){
	const groupList = document.getElementById('groupList');
	//Clear the groupings

	var child = groupList.lastChild;
	while(child){
		groupList.removeChild(child)
		child = groupList.lastChild;
	}

	for (let [key, value] of groups){
		//collector of parts
		const newGroup = document.createElement("div");
		newGroup.setAttribute("class", "form-centerWrapper")
		//group name
		const groupName = document.createElement("div");
		groupName.innerHTML = key;

		//control buttons
		const groupControls = document.createElement("div");

		const buttonSave = document.createElement("button");
        buttonSave.innerHTML = "Save (" + value.length + ")";
        buttonSave.setAttribute("id", key);
        buttonSave.setAttribute("class", "button");
        buttonSave.addEventListener("click", (event) => save(event.target.id));

		const buttonLoad = document.createElement("button");
        buttonLoad.innerHTML = "Load";
        buttonLoad.setAttribute("id", key);
        buttonLoad.setAttribute("class", "button");
        buttonLoad.addEventListener("click", (event) => load(event.target.id));
		
		
		groupControls.appendChild(buttonSave);
		groupControls.appendChild(buttonLoad);
		// groupControls.appendChild(buttonLoad);

		newGroup.appendChild(groupName);
		newGroup.append(groupControls);

		//inputs all into group list
		groupList.append(newGroup);
	}
}

function addGroup(){
	var groupName = document.getElementById('groupName');
	console.log("adding group to url management: " + groupName.value);
	groups.set(groupName.value, []);

	update();
}


function onLoaded(){
	chrome.storage.sync.get("ManageTabUrl", function(items) {
		for (let key in items) {
			console.log(key, items[key])
		}
	});
	update();
}

function save(id) {
	console.log(id)
	//get all tabs in current window
	chrome.tabs.query({ currentWindow: true }, function(tabs) {
	var urlArr = [];
	for (var i = 0; i < tabs.length; i++) {
      urlArr.push(tabs[i].url);
    }
	//sets an id to urls in current window
	groups.set(id, urlArr);
  	});

	//saves to google sync with the entries from Groups
	chrome.storage.sync.set(
		{ "ManageTabUrl": Object.fromEntries(groups) }
	);
  update();
}

function load(id) {
	var urlArr = groups.get(id)
	for (var i = 0; i < urlArr.length; i++){
		chrome.tabs.create({ url : urlArr[i] });
	}
}


window.onload = onLoaded;
document.addEventListener('DOMContentLoaded', function() {
	var buttonSubmit = document.getElementById("submit-btn");
	buttonSubmit.addEventListener('click', addGroup)
});

