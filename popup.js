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
		console.log(key + " = " + value);
	}
}

function onLoaded(){
	groups.set("1", []);

	chrome.storage.sync.get('ChromeUrlSaver' , function (items){
		var jsonString = items['ChromeUrlSaver'];
		var urls =  JSON.parse(jsonString);
	});

}

function save() {
	chrome.tabs.query({ currentWindow: true }, function(tabs) {
	var urlArr = [];
	for (var i = 0; i < tabs.length; i++) {
      urlArr.push(tabs[i].url);
    }
	groups.set("1", urlArr);
  });
  update();
}

function load() {
	// chrome.storage.sync.get('ChromeUrlSaver' , function (items){
	// 	var jsonString = items['ChromeUrlSaver'];
	// 	var urls =  JSON.parse(jsonString);
	// 	for (var i = 0; i < urls.length; i++) {
	// 		chrome.tabs.create({ url: urls[i] });
	// 	}
	// });
	var urlArr = groups.get("1")
	for (var i = 0; i < urlArr.length; i++){
		chrome.tabs.create({ url : urlArr[i] });
	}
}


window.onload = onLoaded;
document.addEventListener('DOMContentLoaded', function() {
	var buttonSave = document.getElementById('save_button');
	buttonSave.addEventListener('click', save);
	
	var buttonLoad = document.getElementById('load_button');
	buttonLoad.addEventListener('click', load);
});
//buttons -> unqiue id -> returns a 
