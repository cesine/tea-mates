describe('AudioToText', function (){
  audioPipeline = require('../lib/audioToText').AudioToText;

  it('should spy on a method of Split on Silence', function(){
     var someResponseData = '/home/gina/Downloads/tea-mates/spec/test_audio.mp3';

     spyOn(audioPipeline, 'testSplitOnSilence').andCallThrough();
     var callback = jasmine.createSpy();

     audioPipeline.testSplitOnSilence(someResponseData, callback);    
     expect(callback).not.toHaveBeenCalled();
  });


  it('should spy on a method of Convert audio to mp3', function(){
    var someResponseData = '/home/gina/Downloads/tea-mates/spec/test_audio.wav';
    
    spyOn(audioPipeline, 'testAudioToMp3').andCallThrough();
    var callback = jasmine.createSpy();
    
    audioPipeline.testAudioToMp3(someResponseData, callback);
    expect(callback).not.toHaveBeenCalled();
    
    //audioPipeline.testAudioTomp3.mostRecentCall.args[0](someResponseData, callback);
    //expect(callback).toHaveBeenCalledWith('/home/gina/Downloads/tea-mates/audio/4.mp3');

  });

  
  /*it('can convert wav,amr,mp3 to mp3 using ffmpeg', function(){
    var result = audioPipeline.testAudioTomp3("/home/gina/Downloads/tea-mates/audio/4.wav");
    expect(result).toBeTruthy();  
  });
*/

  it("won't run private functions", function(){
    expect(function() { audioPipeline.audioToMp3();} ).toThrow(new Error("Object #<Object> has no method 'audioToMp3'"));
  });

  

});

