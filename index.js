const net = require('net');
const PORT = 10001;
const HOST = '127.0.0.1';
var record = require('node-record-lpcm16');
const fs = require('fs');


// setup google
const speech = require('@google-cloud/speech');
var speechClient = speech({
    projectId: 'thermal-hour-165417',
    keyFilename: './cloud-key.json'
});

const requestFile = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US'
};

const request = {
    config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US'
    }
};

const recognizeStream = speechClient.createRecognizeStream(request)
      .on('error', console.error)
      .on('data', (data) => {
          process.stdout.write(`Google: ${data.results}\n`);
      });


var n = net.createServer((s) => {
    s.pipe(recognizeStream);
    s.on('close', () => {
        console.log("Passing to Google");
        // soundFile.pipe(recognizeStream);
        // speechClient.recognize('./file.wav', request)
        //     .then((results) => {
        //         console.log(results[0]);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     });
    });
}).listen(PORT, HOST, () => {
    console.log("listening on ", PORT);
});
