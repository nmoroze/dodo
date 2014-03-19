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
    	over: function(e, ui) { $("#trash").css("visibility", "hidden"); 
    	    $(ui.item).css("opacity", 1); 
			sortableIn = 1; },
    	out: function(e, ui) { 
    		$("#trash").css("visibility", "visible"); 
    		$(ui.item).css("opacity", 0.5); 
    		sortableIn = 0; },
    	stop: function(e, ui) { $(ui.item).css("opacity", 1); 

    		$("#trash").css("visibility", "hidden");},
    	beforeStop: function(e, ui) {
    		$(ui.item).css("opacity", 1); 
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
			$(ui.item).css("opacity", 1);

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

	function deletePreference(folder, filter) {
		if(!filter) {
			console.log("lol kill");
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
		else {
			console.log("plz not whoel thing");
			for(var i=0; i<prefs.length; i++) {
				if(folder == prefs[i].folder) {
					for(var key in filter) {
						prefs[i]["filter"][key] = arr_diff(prefs[i]["filter"][key], filter[key]);
					}
					savePreferences();
					displayPreferences();
					return;
				}
			}
		}
	}

	//http://stackoverflow.com/questions/1187518/javascript-array-difference
	function arr_diff(a1, a2) {
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
	function savePreferences() {
		$("#save-notifier").html("Saving...");
		localStorage["folders"] = JSON.stringify(prefs);
		$("#save-notifier").html("Saved "+new Date().toLocaleString());
	}

	function displayPreferences() {
		var template = $("#template").html();
		var displayPrefs = JSON.parse(JSON.stringify(prefs));
		// for(var i=0; i<displayPrefs.length; i++) {
		// 	displayPrefs[i].filter.extension = 
		// 		displayPrefs[i].filter.extension.join(", ");
		// 	displayPrefs[i].filter.url = 
		// 		displayPrefs[i].filter.url.join(", ");
		// }
		$("#prefs").html(Mustache.render(template, {
				"folders": displayPrefs,
			}
		));
		resetClickHandlers(prefs);
	}
 
	function resetClickHandlers() {
		$(".add-extension").click(function(e) {
			var folder = $(this).attr("folder");
			var extension = prompt("Extension?");
			if(!extension)
				return;
			addPreference(folder, {
				extension: [extension],
			});
		});


		$(".delete-ext").click(function(e) {
			var folder = $(this).attr("folder");
			var extension = $(this).attr("extension");

			deletePreference(folder, {
				extension: [extension],
			});
		});

		$(".delete-url").click(function(e) {
			var folder = $(this).attr("folder");
			var url = $(this).attr("url");

			deletePreference(folder, {
				url: [url],
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