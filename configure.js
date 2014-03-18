$(document).ready(function() {
	console.log("jquery works");
	
	var prefs = []
	if(localStorage["folders"])
		prefs = JSON.parse(localStorage["folders"]);
	
	displayPreferences();

	$("#prefs").sortable({
		receive: function(event, ui) {
        	sortableIn = 1;
    	},
    	over: function(e, ui) { $("#trash").css("visibility", "hidden"); sortableIn = 1; },
    	out: function(e, ui) { $("#trash").css("visibility", "visible");sortableIn = 0; },
    	stop: function(e, ui) {$("#trash").css("visibility", "hidden");},
    	beforeStop: function(e, ui) {
    		$("#trash").css("visibility", "hidden");
        	if (sortableIn == 0) { 
        		console.log(ui.item[0].id);
        		deletePreference(ui.item[0].id);
        		ui.item.remove();
        		savePreferences();
        		displayPreferences();
        	} 
    	},
		update: function(event, ui) {
			$("#trash").css("visibility", "hidden");

			var sortedIDs = $( "#prefs" ).sortable( "toArray" );
			var newPrefs = [];
			for(var i=0; i<sortedIDs.length; i++) {
				for(var j=0; j<prefs.length; j++) {
					if(sortedIDs[i] == prefs[j].folder) {
						newPrefs.push(prefs[j]);
						break;
					}
				}
			}
			prefs = newPrefs;
			savePreferences();
		}
	});

	$("#add").click(function() {
		var folder = prompt("Folder?");
		if(!folder)
			return;
		addPreference(folder, {
			extension: [],
			url: [],
		});
		savePreferences();
		displayPreferences();
	});

	$("#defaults").click(function() {
		prefs = defaultPreferences["standard"];
		savePreferences();
		displayPreferences();
	});

	function addPreference(folder, filter) {
		for(var i=0; i<prefs.length; i++) {
			if(prefs[i].folder == folder) {
				console.log(prefs[i]);
				for(var key in filter) {
					prefs[i]["filter"][key] = prefs[i]["filter"][key].concat(filter[key]);
				}
				savePreferences();
				displayPreferences();
				return; //we're done here
			}
		}

		//folder doesn't exist, create a new one
		prefs.push({
			folder: folder,
			filter: filter,
		});
		savePreferences();
		displayPreferences();
	}

	function deletePreference(folder) {
		for(var i=0; i<prefs.length; i++) {
			if(folder == prefs[i].folder) {
				prefs.splice(i, 1);
				console.log(prefs);
				savePreferences();
				displayPreferences();
				return;
			}
		}
	}

	function savePreferences() {
		localStorage["folders"] = JSON.stringify(prefs);
	}

	function displayPreferences() {
		var template = $("#template").html();
		$("#prefs").html(Mustache.render(template, {
				"folders": prefs,
			}
		));
		resetClickHandlers(prefs);
	}
 
	function resetClickHandlers() {
		$(".delete").click(function(e) {
			var folder = $(this).attr("folder");
			for(var i=0; i<prefs.length; i++) {
				if(folder == prefs[i].folder) {
					prefs.splice(i, 1);
					console.log(prefs);
					savePreferences();
					displayPreferences();
					return;
				}
			}
		});

		$(".add-extension").click(function(e) {
			var folder = $(this).attr("folder");
			var extension = prompt("Extension?");
			if(!extension)
				return;
			addPreference(folder, {
				extension: [extension],
			});
		});
		
		$(".add-url").click(function(e) {
			var folder = $(this).attr("folder");
			var url = prompt("URL?");
			if(!url)
				return;
			addPreference(folder, {
				url: [url],
			});
		});
	}

});