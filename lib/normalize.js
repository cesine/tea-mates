var fs = require('fs'),
util = require('util'),
sys = require('sys'),
path = require('path'),
exec = require('child_process').exec,
_ = require('../node_modules/underscore');

var Normalizer = exports.Normalizer = (
function() {

    /*
     * private functions and variables
     */

	/*
	This is the first function called. If you want to support many different audio file types using
	ffmpeg, it is best to call ffmpeg first. 
	
	This function takes in an audio file (mp3), and uses
	mp3splt to split the file on scilence
	filePath: the full path(?) to the audio file 
	returns: an array of split files
	*/
    function splitFile(filePath, callback) {
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
				/*Sample output
				$ mp3splt -N -s -p th=-30,rm /home/gina/Downloads/tea-mates/audio/9.mp3 
				mp3splt 2.4.1 (14/11/11) - using libmp3splt 0.7.1
					Matteo Trotta <mtrotta AT users.sourceforge.net>
					Alexandru Munteanu <io_fx AT yahoo.fr>
				THIS SOFTWARE COMES WITH ABSOLUTELY NO WARRANTY! USE AT YOUR OWN RISK!
				 Processing file '/home/gina/Downloads/tea-mates/audio/9.mp3' ...
				 info: file matches the plugin 'mp3 (libmad)'
				 info: MPEG 2 Layer 3 - 16000 Hz - Mono - FRAME MODE - Total time: 0m.50s
				 info: starting silence mode split
				 Silence split type: Auto mode (Th: -30.0 dB, Off: 0.80, Min: 0.00, Remove: YES, Min track: 0.00)
				 [ 100.00 %] S: 02, Level: -48.75 dB; scanning for silence... 
				 Total silence points found: 2. (Selected 3 tracks)
				   File "/home/gina/Downloads/tea-mates/audio/9_silence_1.mp3" created
				   File "/home/gina/Downloads/tea-mates/audio/9_silence_2.mp3" created
				   File "/home/gina/Downloads/tea-mates/audio/9_silence_3.mp3" created
				 silence split ok
				 Average silence level: -21.19 dB
				*/
                sys.puts(stdout);
                var audioFiles = [];
                var silencePointRegexp = /^Total\ssilence\spoints\found:\s(\d+)\./;
                var silencePointsResult = stdout.match(silencePointRegexp);
                //if more than one file was created
				if (silencePointsResult) {
                    var silencePoints = silencePointsResult[1];
                    if (silencePoints > 0) {
						//generate an array of the files by guessing the file names due to mp3splt convention,
						//(appending _silence_) and incrementing from 0 to the number of files
                        audioFiles = _.map(_.range(silencePoint),
                        function(segmentNumber) {
							//append _silence_ on the files
                            return fileSegmentPath(segmentNumber + 1);
                        });
                    }
                    return callback(null, audioFiles);
                } else {
					//if mp3splt didnt split the files, return an array with only the original file.
                    return callback(null, [filePath]);
                }
            }
        });
    }

	/*
	This function takes in any audio file, and converts it into an mp3
	*/
    function mp3Conversion(filePath, callback) {
        var split = filePath.split('.');
		var ext = split[split.length - 1];
		
		var convertedFlacFileName = path.basename(filePath, '.'+ext) + '.flac';
        var convertedFlacFilePath = path.dirname(filePath) + '/' + convertedFlacFileName;
        var cmd = 'ffmpeg -y -i ' + filePath + ' ' + convertedFlacFilePath ;
        sys.puts(__dirname + ":" + cmd);
        var child = exec(cmd,
        function(err, stdout, stderr) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, convertedFlacFilePath);
            }
        });
    }

    function flacConversion(filePath, callback) {
        var convertedFlacFileName = path.basename(filePath, '.mp3') + '.flac';
        var convertedFlacFilePath = path.dirname(filePath) + '/' + convertedFlacFileName;
        var cmd = 'sox ' + filePath + ' ' + convertedFlacFilePath + ' gain -n -5 silence 1 5 2%';
        sys.puts(__dirname + ":" + cmd);
        var child = exec(cmd,
        function(err, stdout, stderr) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, convertedFlacFilePath);
            }
        });
    }

    function apiCall(flacFileName, callback) {
        var cmd = "curl --data-binary @" + flacFileName + " --header 'Content-type: audio/x-flac; rate=16000' 'https://www.google.com/speech-api/v1/recognize?xjerr=1&client=chromium&pfilter=2&lang=en-US&maxresults=6'";
        sys.puts(cmd);
        var child = exec(cmd,
        function(err, stdout, stderr) {
            if (err) {
                return callback(err);
            } else {
                sys.puts(stdout);
                var apiResult = JSON.parse(stdout);
                return callback(null, apiResult.hypotheses[0].utterance);
            }
        });
    }

	/*
	This is the main function called by this class. 
	 audioFiles: an array of files in the mp3 format (most probably from the splitFile function)
	 speechText: a string from a previous recognition cycle
	*/
    function convertToText(audioFiles, speechText, callback) {
        var firstAudioFile = _.head(audioFiles);
        var restOfAudioFiles = _.tail(audioFiles);

        if (firstAudioFile) {
            flacConversion(firstAudioFile,
            function(err, flacFileName) {
                if (err) {
                    callback(err, speechText);
                } else {
                    apiCall(flacFileName,
                    function(err, text) {
                        if (err) {
                            callback(err, speechText);
                        } else {
                            speechText = speechText + text;
                            convertToText(restOfAudioFiles, speechText, callback);
                        }
                    });
                }
            });
        } else {
            callback(null, speechText);
        }
    }

    /*
     * public functions and variables
     */
    return {
        normalizeFile: function(filePath, callback) {
            var self = this;
            splitFile(filePath,
            function(err, splittedFiles) {
                if (err) {
                    return callback(err, null);
                } else {
                    return convertToText(splittedFiles, "", callback);
                }
            });
        }
    };

})();


