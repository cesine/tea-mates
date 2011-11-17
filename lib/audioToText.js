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
    var convertedMP3FileName = path.basename(filePath, '.'+ext) + '.ogg';
    var convertedMP3FilePath = path.dirname(filePath) + '/' + convertedMP3FileName;
    sys.print(convertedMP3FilePath);  
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
    
  };

  var splitOnSilence = function(filePath, callback){
    var cmd = 'mp3splt -N -s -p th=-30,rm ' + filePath;
    sys.puts(__dirname + ":" + cmd);
    var fileSegmentPath = function(segmentNumber) {
      return __dirname + '/' + path.basename(filePath) + '_silence_' + segmentNumber + '.mp3';
    };

    var child = exec(cmd,
      function(err, stdout, stderr) {
        if (err) {
          return callback(err, null);
        } else {
          sys.puts(stdout);
          var audioFiles = [];
          var silencePointRegexp = /^Total\ssilence\spoints\found:\s(\d+)\./;
          var silencePointsResult = stdout.match(silencePointRegexp);
          if (silencePointsResult) {
            var silencePoints = silencePointsResult[1];
            if (silencePoints > 0) {
              audioFiles = _.map(_.range(silencePoint),
                function(segmentNumber) {
                  return fileSegmentPath(segmentNumber + 1);
                });
            }
            return callback(null, audioFiles);
          } else {
            return callback(null, [filePath]);
          }
        }
      });

  };


  return{
    run: function(){
      return true;
    },
    testAudioToMp3: function(file){
      audioToMp3(file,
        //this callback passes the message back to the caller(?)
        function(err, file){
          if (err){
            return err;
          } else {
            return '';
          }  
      });                
    },
    testSplitOnSilence: function(file){
      splitOnSilence(file,
          function(err, file){
            if (err){
              return err;
            } else {
              return '';
            }
       });
    }



  };


})();
