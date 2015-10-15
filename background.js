google.load('search', '1');
var imageSearch;



chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		// sendResponse({
		// 	"back": "backvalue"
		// });
		console.log("get", request);

		function searchComplete() {
			if (imageSearch.results && imageSearch.results.length > 0) {
				console.log(imageSearch.results);
				var data = [];
				for (var variable in imageSearch.results) {
					if (imageSearch.results.hasOwnProperty(variable)) {
						data.push(imageSearch.results[variable].url);
					}
				}
				console.log("sendresponse", data, sendResponse);
				sendResponse({
					"result": data
				});
			}
		}

		function OnLoad() {

			// Create an Image Search instance.
			console.log("Onload");
			imageSearch = new google.search.ImageSearch();
			// Set searchComplete as the callback function when a search is
			// complete.  The imageSearch object will have results in it.
			imageSearch.setSearchCompleteCallback(this, searchComplete, null);
			imageSearch.setResultSetSize(8);

			// Find me a beautiful car.
			imageSearch.execute(request.selectedWord);

			// Include the required Google branding
			// google.search.Search.getBranding('branding');
		}

		if (request.type == "images") {
			console.log("images", google.setOnLoadCallback);
			console.log("load done");
			google.setOnLoadCallback(OnLoad());
			console.log("set done");
			return true;
		} else {
			var getUrl = (request.type == "merriam" ?
				"http://www.merriam-webster.com/dictionary/" :
				"http://dict.youdao.com/search?q=") + request.selectedWord;
			jQuery.ajax({
				url: getUrl,
				success: function(data) {
					sendResponse({
						"result": data
					});
				},
				error: function(xhr, status, errorThrown) {
					sendResponse({
						"result": "error"
					});
				},
				async: false
			});
		}


	});
