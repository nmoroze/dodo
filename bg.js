var downloadStarted = function(download, suggest) {
	filename = download.filename;
	extension = filename.split(".").pop();
	if(extension == filename)
		extension = "";

	url = download.referrer;
	var parser = document.createElement('a');
	parser.href = url;
	urlComponents = parser.hostname.split(".");

	if(urlComponents[0] == "www")
		urlComponents.shift();

	url = urlComponents.join(".");
	console.log(url);

	folder = getFolder({
		"extension": extension.toLowerCase();,
		"url": url,
	});

	suggest({filename: folder + "/" + filename, overwrite: false});
}

var getFolder = function(info) {
	if(!localStorage["folders"])
		return ""

	var folders = JSON.parse(localStorage["folders"]);
	for(var i=0; i<folders.length; i++) {
		var filter = folders[i].filter;

		if(match(info, filter))
			return folders[i].folder;
	}
	return "";
}

var match = function(info, filter) {
	for(var key in info) {
		if(filter[key] && filter[key].length > 0) {
			if(filter[key].indexOf(info[key]) == -1)
				return false;
		}
	}
	return true;
}

// Open options page first time extension is installed
// http://stackoverflow.com/questions/5745822/open-a-help-page-after-chrome-extension-is-installed-first-time
function install_notice() {
    if (localStorage.getItem('install_time'))
        return;

    var now = new Date().getTime();
    localStorage.setItem('install_time', now);
    chrome.tabs.create({url: "configure.html"});
}
install_notice();

chrome.downloads.onDeterminingFilename.addListener(downloadStarted);