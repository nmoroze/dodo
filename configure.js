$(document).ready(function() {
	console.log("jquery works");
	Preferences.init(displayPreferences);

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
        		Preferences.del(ui.item[0].id);
        		ui.item.remove();
        		Preferences.save();
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

			prefs.set(newPrefs);
		}
	});

	$("#add").click(function() {
		var folder = prompt("Folder?");
		if(!folder)
			return;
		Preferences.add(folder, {
			extension: [],
			url: [],
		});
		Preferences.save();
		displayPreferences();
	});

	$("#defaults").click(function() {
		Preferences.set(defaultPreferences["standard"]);
		displayPreferences();
	});

	function displayPreferences() {
		var template = $("#template").html();
		// for(var i=0; i<displayPrefs.length; i++) {
		// 	displayPrefs[i].filter.extension = 
		// 		displayPrefs[i].filter.extension.join(", ");
		// 	displayPrefs[i].filter.url = 
		// 		displayPrefs[i].filter.url.join(", ");
		// }
		$("#prefs").html(Mustache.render(template, {
				"folders": Preferences.get(),
			}
		));
		resetClickHandlers();
	}
 
	function resetClickHandlers() {
		$(".add-extension").click(function(e) {
			var folder = $(this).attr("folder");
			var extension = prompt("Extension?");
			if(!extension)
				return;
			Preferences.add(folder, {
				extension: [extension],
			});
		});


		$(".delete-ext").click(function(e) {
			var folder = $(this).attr("folder");
			var extension = $(this).attr("extension");

			Preferences.del(folder, {
				extension: [extension],
			});
		});

		$(".delete-url").click(function(e) {
			var folder = $(this).attr("folder");
			var url = $(this).attr("url");

			Preferences.del(folder, {
				url: [url],
			});
		});
		
		$(".add-url").click(function(e) {
			var folder = $(this).attr("folder");
			var url = prompt("URL?");
			if(!url)
				return;
			Preferences.add(folder, {
				url: [url],
			});
		});
	}

});