describe('AudioToText', function (){
  audioPipeline = require('../lib/audioToText.js').AudioToText;

  it('can convert wav,amr,mp3 to mp3 using ffmpeg', function(){
    var result = audioPipeline.run();
    expect(result).toBeTruthy();  
  });

  it("won't run private functions", function(){
    expect(function() { audioPipeline.audioToMp3();} ).toThrow(new Error("Object #<Object> has no method 'audioToMp3'"));
  });
  
});

