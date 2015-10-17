var ddp = new MeteorDdp("ws://47.88.17.62:3000/websocket");

var publicParties = 0;

ddp.connect().then(function() {
  ddp.subscribe("words");

  ddp.watch("words", function(changedDoc, message) {});
});

function upload_word(word) {
  var array = [];
  array.push(word);
  ddp.call("upload_word", array, function(error, result) {
    console.log(error, esult);
  })
}
