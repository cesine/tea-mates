describe('AudioToText', function (){
  audioPipeline = require('../lib/audioToText').AudioToText;
  
  it('should spy on a method of AudioToText', function(){
    var callback = jasmine.createSpy();
    new  AudioToText().testAudioToMp3(callback);
    expect(callback).toHaveBeenCalledWith('foo');
  });

  
  it('can convert wav,amr,mp3 to mp3 using ffmpeg', function(){
    var result = audioPipeline.testAudioToMp3("/home/gina/Downloads/tea-mates/audio/4.wav");
    expect(result).toBeTruthy();  
  });

  it("won't run private functions", function(){
    expect(function() { audioPipeline.audioToMp3();} ).toThrow(new Error("Object #<Object> has no method 'audioToMp3'"));
  });

  

});

