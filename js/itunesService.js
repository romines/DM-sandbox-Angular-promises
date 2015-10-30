var app = angular.module('itunes');

app.service('itunesService', ['$http', '$q', function($http, $q) {
  //This service is what will do the 'heavy lifting' and get our data from the iTunes API.
  //Also note that we're using a 'service' and not a 'factory' so all your methods you want to call in your controller need to be on 'this'.

  //Write a method that accepts an artist's name as the parameter, then makes a 'JSONP' http request to a url that looks like this
  //https://itunes.apple.com/search?term=' + artist + '&callback=JSON_CALLBACK'
  //Note that in the above line, artist is the parameter being passed in.
  //You can return the http request or you can make your own promise in order to manipulate the data before you resolve it.

  //Code here
  var baseUrl = 'https://itunes.apple.com/search?term='

  this.getMusicByArtist = function(query, searchType) {

    var suffix = qsBuild(searchType);

    return $http({
      method: 'JSONP',
      url: baseUrl + query + suffix
    }).then(function(response) {
      return parse(response);
    });
  };

  function qsBuild(selected) {
    var qs = '';
    switch (selected) {
      case 'artist':
        qs = '&entity=musicArtist&attribute=allArtistTerm&callback=JSON_CALLBACK';
        break;
      case 'album':
        qs = '&entity=album&attribute=albumTerm&callback=JSON_CALLBACK';
        break;
      case 'song':
        qs = '&entity=song&attribute=songTerm&callback=JSON_CALLBACK';
        break;
      default:
        qs = '&callback=JSON_CALLBACK';
    }
    return qs;
  }

  function parse(response) {
    var parsedTracks = [];
    var arrTracks = response.data.results;
    var props = ['artworkUrl100', 'artistName', 'collectionName', 'collectionPrice', 'previewUrl', 'kind'];
    var newProps = ['AlbumArt', 'Artist', 'Collection', 'CollectionPrice', 'Play', 'Type'];
    arrTracks.forEach(function(track) {
      var trackObj = {};
      for (var i = 0; i < props.length; i++) {
        trackObj[newProps[i]] = track[props[i]];
      }
      parsedTracks.push(trackObj);
    });
    return parsedTracks;
  }

}]);
