var fs = require('fs'),
    util = require('util'),
    sys = require('sys'),
    path = require('path'),
    exec = require('child_process').exec,
    _ = require('../node_modules/underscore');

var AudioToText  =  exports.AudioToText = (function(){


  var audioToMp3 = function(filePath, callback){
    var split = filePath.split('.');  
    var ext = split[split.length - 1];
    var convertedMP3FileName = path.basename(filePath, '.'+ext) + '.mp3';
    var convertedMP3FilePath = path.dirname(filePath) + '/' + convertedMP3FileName;
  
    var cmd = 'ffmpeg -y -i ' + filePath + ' ' + convertedMP3FilePath ;
    sys.puts(__dirname + ":" + cmd);
    var child = exec(cmd,
      function(err, stdout, stderr){
        if (err) {
          return callback(err, null);
        } else {
          return callback(null, convertedMP3FilePath);
        }
    });
    
    return false;
  };

  var splitOnSilence = function(){
  
  };


  return{
    run: function(){
      return true;
    },
    testAudioToMp3: function(file){
      return audioToMp3(file);                
    }
  };


})();
