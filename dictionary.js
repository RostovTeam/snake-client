var request = require("request");


function Words(hl,tr) {
	this.wordnik = {
		'hasDictionaryDef':false,
		'minCorpusCount':0,
		'maxCorpusCount':-1,
		'minDictionaryCount':1,
		'maxDictionaryCount':-1,
		'maxLength':15,
		'minLength':7,
		'api_key':'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
	};
	this.googleTranslate = {
		'client':'t',
		'hl':hl, //откуда 'en'
		'tl':tr, //куда 'fr'
		'ie':'UTF-8',
		'oe':'UTF-8'
	};
}

Words.prototype.getWordAndTr = function(callback){
	var h = this.getTranslateWord.bind(this,callback);
	this.getWord(h);
}

Words.prototype.getWord = function (callback) {
    var url = "http://api.wordnik.com:80/v4/words.json/randomWord?";
    var param_string = "";
    for (var key in this.wordnik) {
        param_string += key + '=' + this.wordnik[key] + '&';
    }
    var p = param_string.substring(0, param_string.length - 1);
    request(url + p, function (error, response, body) {
        var data = JSON.parse(body);
        var word = data.word;
        callback(word);
    });
}

Words.prototype.getTranslateWord = function (callback, word) {
    var url = "http://translate.google.com/translate_a/t?";
    var param_string = "";
    for (var key in this.googleTranslate) {
        param_string += key + '=' + this.googleTranslate[key] + '&';
    }
    param_string += 'text=' + word;
    request(url + param_string, function (error, response, body) {
        var t = body.split(',')[0].split("\"")[1];
        // console.log(body);
        callback({word: word, tr: t});
    });
}

Words.prototype.langList = function() {
	return JSON.stringify({'ru':'Russian','fr':'Franch','de':'German'});
}

//var word = new Words('en','fr');
//word.getWordAndTr(function(v){
//	console.log(JSON.stringify(v));
//});
//console.log(word.langList());
module.exports = Words;
