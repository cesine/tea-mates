describe('AudioToText', function (){
  audioPipeline = require('../lib/audioToText').AudioToText;

  it('can convert wav,amr,mp3 to mp3 using ffmpeg', function(){
    var result = audioPipeline.run();
    expect(result).toBeTruthy();  
  });

  
});

