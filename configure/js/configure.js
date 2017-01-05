$(document).ready(function() {
	Preferences.init(displayPreferences);

	displayPreferences();

	$("#prefs").sortable({
		receive: function(event, ui) {
        	sortableIn = 1;
    	},
    	over: function(e, ui) { $("#trash").css("color", "black"); 
    	    $(ui.item).css("opacity", 1);        	
			sortableIn = 1; },
    	out: function(e, ui) { 
    		$("#trash").css("color", "red"); 
    		sortableIn = 0; },
    	stop: function(e, ui) { $(ui.item).css("opacity", 1); 
    		$("#trash").css("color", "black");},
    	beforeStop: function(e, ui) {
    		$(ui.item).css("opacity", 1); 
    		$("#trash").css("color", "black");
        	if (sortableIn == 0) { 
        		Preferences.del(ui.item[0].id);
        		ui.item.remove();
        		Preferences.save();
        		displayPreferences();
        	} 
    	},
		update: function(event, ui) {
			$("#trash").css("color", "black");
			$(ui.item).css("opacity", 1);

			var sortedIDs = $( "#prefs" ).sortable( "toArray" );
			var newPrefs = [];
			var prefs = Preferences.get();
			for(var i=0; i<sortedIDs.length; i++) {
				for(var j=0; j<prefs.length; j++) {
					if(sortedIDs[i] == prefs[j].folder) {
						newPrefs.push(prefs[j]);
						break;
					}
				}
			}
			Preferences.set(newPrefs);
		}
	});
	
	$('#scroll').bind('mousewheel', function (e) {
		$(this).scrollTop($(this).scrollTop() - e.originalEvent.wheelDeltaY);
		//prevent page fom scrolling
		return false;
	});

	$(".help").on("click", function(e) {
		bootbox.alert("Welcome to Dodo! This interface provides an easy way to manage your Dodo filters.\
			A filter in Dodo consists of two different things: <br> <br>\
			A <b>folder</b>, where items that match your criteria are stored when you download them, and the \
			<b>criteria</b>, which specify what files go into the folder, based on their file extensions and the website they came from. \
			Filters can be rearranged in priority by dragging and dropping them. To get started, you can use the buttons above to either load default settings, \
			or create your own filter from scratch.");
	});

	$(".about").click(function(e) {
		bootbox.alert("<b>Dodo v0.1</b> <br> by Noah Moroze <br> \
			Thanks for trying out Dodo! If you would like to file a bug report, please submit it <a href='http://gitreports.com/issue/nmoroze/dodo'>here</a>.<br> \
			Dodo is an open source project. Feel free to check it out and contribute on <a href='https://github.com/nmoroze/dodo'>Github</a>.");
	});
	
	$(".add-filter").click(function() {
		bootbox.prompt("Folder", function(folder) {
			if(!folder)
				return;
			Preferences.add(folder, {
				extension: [],
				url: [],
			});
			Preferences.save();
			displayPreferences();
		});
	});

	$(".defaults").click(function() {
		Preferences.set(defaultPreferences["standard"]);
		displayPreferences();
	});

	function displayPreferences() {
		var template = $("#template").html();

		$("#prefs").html(Mustache.render(template, {
				"folders": Preferences.get(),
			}
		));
		resetClickHandlers();
	}
 
	function resetClickHandlers() {
		$(".add-extension").click(function(e) {
			var folder = $(this).attr("folder");
			bootbox.prompt("Extension", function(extension) {
				extension = extension.toLowerCase();
				if(!extension)
					return;

				if (extension.substring(0, 1) == '.') { 
	  				extension = extension.substring(1);
				}
				Preferences.add(folder, {
					extension: [extension],
				});
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
			var url = bootbox.prompt("URL", function(url) {
				if(!url)
					return;
				Preferences.add(folder, {
					url: [url],
				});
			});
		});
	}

});
