var Preferences = function() {
	var prefs = [];
	var refreshDisplay;

	var init = function(callback) {
		refreshDisplay = callback;
		load();
	}

	var add = function(folder, filter) {
		for(var i=0; i<prefs.length; i++) {
			if(prefs[i].folder == folder) {
				console.log(prefs[i]);
				for(var key in filter) {
					prefs[i]["filter"][key] = prefs[i]["filter"][key].concat(filter[key]);
				}
				save();
				refreshDisplay();
				return; //we're done here
			}
		}

		//folder doesn't exist, create a new one
		prefs.push({
			folder: folder,
			filter: filter,
		});
		save();
		displayPreferences();
	}

	var del = function(folder, filter) {
		if(!filter) {
			for(var i=0; i<prefs.length; i++) {
				if(folder == prefs[i].folder) {
					prefs.splice(i, 1);
					console.log(prefs);
					refreshDisplay();
					save();
					return;
				}
			}
		}
		else {
			for(var i=0; i<prefs.length; i++) {
				if(folder == prefs[i].folder) {
					for(var key in filter) {
						prefs[i]["filter"][key] = arr_diff(prefs[i]["filter"][key], filter[key]);
					}
					refreshDisplay();
					save();
					return;
				}
			}
		}
	}

	var save = function() {
		$("#save-notifier").html("Saving...");
		localStorage["folders"] = JSON.stringify(prefs);
		$("#save-notifier").html("Saved "+new Date().toLocaleString());
	}

	function load() {
		if(localStorage["folders"])
			prefs = JSON.parse(localStorage["folders"]);
	}

	var set = function(newPrefs) {
		prefs = newPrefs;
		save();
	}

	var get = function() {
		return prefs;
	}

	//http://stackoverflow.com/questions/1187518/javascript-array-difference
	var arr_diff = function(a1, a2) {
		var a=[], diff=[];
		for(var i=0;i<a1.length;i++)
		a[a1[i]]=true;
		for(var i=0;i<a2.length;i++)
		if(a[a2[i]]) delete a[a2[i]];
		else a[a2[i]]=true;
		for(var k in a)
		diff.push(k);
		return diff;
	}

	return {
		init: init,
		add: add,
		del: del,
		save: save,
		get: get,
		set: set,
	}
}();