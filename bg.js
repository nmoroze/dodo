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
		"extension": extension,
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

chrome.downloads.onDeterminingFilename.addListener(downloadStarted);