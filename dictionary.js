var request = require("request");


function Words(native_lang, learning_lang) {


    this.native_lang = native_lang;
    this.learning_lang = learning_lang;


    //this.wordnik = {
    //	'hasDictionaryDef':false,
    //	'minCorpusCount':0,
    //	'maxCorpusCount':-1,
    //	'minDictionaryCount':1,
    //	'maxDictionaryCount':-1,
    //	'maxLength':15,
    //	'minLength':7,
    //	'api_key':'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
    //};
    this.googleTranslate = {
        'client': 't',
        'hl': learning_lang, //откуда 'en'
        'tl': native_lang, //куда 'fr'
        'ie': 'UTF-8',
        'oe': 'UTF-8'
    };
}

Words.langs = {
    'fr': {url: 'https://www.kimonolabs.com/api/6ki1g4zu?apikey=5OpMG7SDZOEPDvJNwAeLlQtfBskqkNXe', count: 2500},
    'de': {url: 'https://www.kimonolabs.com/api/aos21df2?apikey=5OpMG7SDZOEPDvJNwAeLlQtfBskqkNXe', count: 1847},
    'en': {url:'https://www.kimonolabs.com/api/2xoyllve?apikey=5OpMG7SDZOEPDvJNwAeLlQtfBskqkNXe',count:857}
};

Words.prototype.getWordAndTr = function (callback) {
    var h = this.getTranslateWord.bind(this, callback);
    this.getWord(h);
}

Words.prototype.getWord = function (callback) {
    //var url = "http://api.wordnik.com:80/v4/words.json/randomWord?";
    //var param_string = "";
    //for (var key in this.wordnik) {
    //    param_string += key + '=' + this.wordnik[key] + '&';
    //}
    //var p = param_string.substring(0, param_string.length - 1);
    var url = getUrl(this.learning_lang);
    if(!url)
        callback('noapi');

    request(url, function (error, response, body) {
        console.log(error+' '+response+' '+body);
        var data = JSON.parse(body);
        var word = data.results.collection1[0].word;
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


function getUrl(lang) {
    var l = Words.langs[lang];
    if (!l)
        return null;
    var base = l.url;

    var offset = Math.ceil(Math.random() * (l.count - 0));
    var limit = 1;

    return base + '&kimlimit=' + limit + '&kimoffset=' + offset;
}

module.exports = Words;
