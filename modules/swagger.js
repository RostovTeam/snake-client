var client = require("swagger-client")

var swagger = new client.SwaggerApi({
  url: 'http://api.wordnik.com:80/v4/words.json/search/apple?caseSensitive=true&minCorpusCount=5&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=1&maxLength=-1&skip=0&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5
',
  success: function() {
    if(swagger.ready === true) {
      swagger.apis.pet.getPetById({petId:1});
    }
  }
});


