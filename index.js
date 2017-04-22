const net = require('net');
const PORT = 10001;
const HOST = '127.0.0.1';


// setup google
const speech = require('@google-cloud/speech');
var speechClient = speech({
    projectId: 'thermal-hour-165417',
    keyFilename: './cloud-key.json'
});


const request = {
    config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 44100,
        languageCode: 'en-US'
    }
};

const recognizeStream = speechClient.createRecognizeStream(request)
      .on('error', console.error)
      .on('data', (data) => {
          console.log(`Google: ${data.results}`);
      });


net.createServer((s) => {
    // s.on('data', (data) => {
    //     console.log(data);
    // });

    s.pipe(recognizeStream);

}).listen(PORT, HOST, () => {
    console.log("listening on ", PORT);
});
