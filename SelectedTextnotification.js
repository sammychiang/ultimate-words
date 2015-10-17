var inSearching = false;
var selectedWord, curDictOpt, mousePosX, mousePosY; // todo: selectedWord life period? ;
var isShanbay = window.location.hostname == "www.shanbay.com";

function init() {
	if (document) {
		document.onkeydown = handelKeyPress;
		console.log("**");
		document.body.addEventListener('mouseup', selectedWordNotification,
			false);
		document.body.addEventListener('click', function() {
			removeDictBubble();
		}, false);

		setInterval(function() {
			if ($("grammarly-card").length) {
				$("grammarly-card").remove();
			}
		}, 500);

		if (isShanbay) {
			setInterval(function() {
				if ($('.popover').length) {
					$('.popover').remove();
				}
			}, 300);
		}
	}
}

function selectedWordNotification(event) {
	console.log("2", new Date());
	if (window.getSelection().toString().trim() === "") {
		console.log("3");
		return;
	}
	console.log("10");
	var length = window.getSelection().toString().trim().split(' ').length;
	console.log("4");
	if (length > 0 && length < 6) {
		selectedWord = window.getSelection().toString().trim();
		console.log("5");
	} else {
		console.log("6");
		return false;
	}
	if ($('#dict').length === 0) {
		console.log("7");
		mousePosX = event.pageX;
		mousePosY = event.pageY;
		renderBubble(mousePosX, mousePosY,
			selectedWord);
		if (length > 2) {
			console.log("8");
			renderYoudao(mousePosX, mousePosY,
				selectedWord);
		}
	}
}


function handelKeyPress(event) {
	if (event.keyCode == 27) { //ESC
		removeDictBubble();
	}
	if (window.getSelection().toString().trim() === "")
		return;
	var length = window.getSelection().toString().trim().split(' ').length;
	if (length > 0 && length < 6) {
		selectedWord = window.getSelection().toString().trim();
	} else {
		return false;
	}
	if (event.keyCode == 67) { // C
		renderYoudao(mousePosX, mousePosY,
			selectedWord);
	} else if (event.keyCode == 73) { //I
		renderImages(mousePosX, mousePosY,
			selectedWord);
	} else {
		removeDictBubble();
	}
}


function generateDiv(id, divClass) {
	var wordDiv = document.createElement('div');
	wordDiv.id = id;
	wordDiv.className = "ultimate" + divClass + " wordDiv";
	wordDiv.style.maxHeight = "350px";
	wordDiv.style.width = "600px";
	wordDiv.style.overflow = "auto";
	wordDiv.style.position = "absolute";
	wordDiv.style.top = mouseY + 10 + ($("#merriam").height() ? $("#merriam")
		.height() : 0) + ($("#youdao").height() ? $("#youdao")
		.height() : 0) + "px";
	if (screen.availWidth - mouseX - 600 > 0) {
		wordDiv.style.left = mouseX + "px";
	} else {
		wordDiv.style.left = (screen.availWidth - 620) + "px";
	}
	wordDiv.style.border = "1px solid blue";
	wordDiv.style.zIndex = "9999";
	wordDiv.style.backgroundColor = "#FFFFFF";
	// add dictionary website link
	var link = document.createElement('a');
	link.href = "http://youdao.com/search?q=" + word;
	link.target = "_blank";
	link.style.textDecoration = "underline";
	link.style.fontSize = "large";
	link.innerHTML = selectedWord;
	wordDiv.appendChild(link);
	return wordDiv;
}

function renderImages(mouseX, mouseY, word) {
	inSearching = true;
	chrome.runtime.sendMessage({
		selectedWord: word,
		type: "images"
	}, function(response) {
		var wordDiv = document.createElement('div');
		wordDiv.id = "images";
		wordDiv.className = "ultimateWords images";
		wordDiv.style.maxHeight = "350px";
		wordDiv.style.width = "600px";
		wordDiv.style.overflow = "auto";
		wordDiv.style.position = "absolute";
		wordDiv.style.top = mouseY + 10 + ($("#merriam").height() ? $("#merriam")
			.height() : 0) + ($("#youdao").height() ? $("#youdao")
			.height() : 0) + "px";
		if (screen.availWidth - mouseX - 600 > 0) {
			wordDiv.style.left = mouseX + "px";
		} else {
			wordDiv.style.left = (screen.availWidth - 620) + "px";
		}
		wordDiv.style.border = "1px solid blue";
		wordDiv.style.zIndex = "9999";
		wordDiv.style.backgroundColor = "#FFFFFF";
		for (var variable in response.result) {
			if (response.result.hasOwnProperty(variable)) {
				var newImg = document.createElement('img');
				newImg.src = response.result[variable];
				// newImg.onload = function() {
				newImg.style.width = "148px";
				newImg.style.height = "auto";
				// newImg.style.display = "block";
				wordDiv.appendChild(newImg);
				// }
			}
		}

		$('html').append(
			wordDiv);
		inSearching = false;
	});
}

function removeDictBubble(className) {
	console.log("1", new Date(), className);
	if (className === undefined) {
		if ($(".ultimateWords").length) {
			console.log("1");
			$(".ultimateWords").remove();
		}
		return;
	}
	var divClassName = "." + className;
	if ($(divClassName).length) {
		console.log("2");
		$(divClassName).remove();
	}
}

function renderYoudao(mouseX, mouseY, word) {
	console.log("10");
	inSearching = true;
	chrome.runtime.sendMessage({
		selectedWord: word,
		type: "youdao"
	}, function(response) {
		var wordDiv = document.createElement('div');
		wordDiv.id = "youdao";
		wordDiv.className = "ultimateWords collins";
		wordDiv.style.maxHeight = "250px";
		wordDiv.style.overflow = "auto";
		wordDiv.style.position = "absolute";
		wordDiv.style.top = mouseY + 10 + ($("#merriam").height() ? $("#merriam")
			.height() : 0) + ($("#images").height() ? $("#images")
			.height() : 0) + "px";
		if (screen.availWidth - mouseX - 525 > 0) {
			wordDiv.style.left = mouseX + "px";
		} else {
			wordDiv.style.left = (screen.availWidth - 600) + "px";
		}
		wordDiv.style.border = "1px solid green";
		wordDiv.style.zIndex = "9999";
		wordDiv.style.backgroundColor = "#FFFFFF";
		wordDiv.style.fontSize = "15px";


		var notWorking = function(html) {
			var el = document.createElement('div');
			el.className = "merriam";
			el.innerHTML = html;
			return $(el);
		};

		var allDocument = notWorking(response.result);
		//add youdao website link
		var link = document.createElement('a');
		var realWord = allDocument.find("#collinsResult span.title")[0].textContent;
		link.href = "http://youdao.com/search?q=" + word;
		link.target = "_blank";
		link.style.textDecoration = "underline";
		link.style.fontSize = "large";
		link.innerHTML = realWord;
		wordDiv.appendChild(link);

		var collins = allDocument.find('#collinsResult')[0];
		wordDiv.appendChild(collins);
		$('html').append(
			wordDiv);
		inSearching = false;
	});
}

function renderBubble(mouseX, mouseY, word) {
	console.log("9");
	removeDictBubble("merriam");
	//className in merriam-webster:词性, "main-fl"; 词义："ld_on_collegiate"
	inSearching = true;
	chrome.runtime.sendMessage({
		selectedWord: word,
		type: "merriam"
	}, function(response) {
		var wordDiv = document.createElement('div');
		wordDiv.id = "merriam";
		wordDiv.className = "ultimateWords merriam";
		wordDiv.style.maxHeight = "250px";
		wordDiv.style.overflow = "auto";
		wordDiv.style.position = "absolute";
		wordDiv.style.top = mouseY + 10 + "px";
		wordDiv.style.left = mouseX + "px";
		wordDiv.style.border = "1px solid blue";
		wordDiv.style.zIndex = "9999";
		wordDiv.style.backgroundColor = "#FFFFFF";
		wordDiv.style.fontSize = "15px";
		if (response.result == "error") {
			wordDiv.innerHTML = "No this word in Merriam-Webster";
			setTimeout(function() {
				removeDictBubble('merriam');
			}, 2000);
		} else {
			var notWorking = function(html) {
				var el = document.createElement('div');
				el.className = "merriam";
				el.innerHTML = html;
				return $(el);
			};
			var allDocument = notWorking(response.result);
			var realWord = allDocument.find('.headword>h1')[0].lastChild.textContent;
			var wordState = allDocument.find('.main-fl');
			upload_word(realWord);
			//get word state list to judge weather there is noun
			var wordStateListEm = allDocument.find(".main-fl em"); //list of em elements
			var wordStateList = [];
			wordStateListEm.each(function(index, el) {
				wordStateList.push(el.textContent);
			});
			if ((wordStateList.indexOf("noun") + 1) || (wordStateList.indexOf(
					"adjective") + 1)) {
				renderImages(mouseX, mouseY, word);
			}
			var wordMeaning = allDocument.find('.ld_on_collegiate');
			var link = document.createElement('a');
			link.href = "http://www.merriam-webster.com/dictionary/" + word;
			link.target = "_blank";
			link.style.textDecoration = "underline";
			link.style.fontSize = "large";
			link.textContent = realWord;
			wordDiv.appendChild(link);
			var br = document.createElement("br");
			wordDiv.appendChild(br);
			if (wordMeaning.length === 0) {
				var wordDefinition = allDocument.find('.scnt');
				for (var j = 0; j < wordDefinition.length; j++) {
					wordDiv.appendChild(wordDefinition[j]);
				}
			} else {
				for (var i = 0; i < wordMeaning.length; i++) {
					wordState[i].style.color = 'red';
					wordDiv.appendChild(wordState[i]);
					wordDiv.appendChild(wordMeaning[i]);
				}
			}
		}

		$('html').append(
			wordDiv);
		inSearching = false;
	});
}

init();
