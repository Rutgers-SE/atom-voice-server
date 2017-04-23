const net = require('net');
const PORT = 10001;
const HOST = '127.0.0.1';
var record = require('node-record-lpcm16');


// setup google
const speech = require('@google-cloud/speech');
var speechClient = speech({
    projectId: 'thermal-hour-165417',
    keyFilename: './cloud-key.json'
});

const request = {
    config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US'
    }
};

var n = net.createServer((s) => {
    console.log('hi');
    const recognizeStream = speechClient.createRecognizeStream(request)
        .on('error', console.error)
        .on('data', (data) => {
            process.stdout.write(`${JSON.stringify(data.results)}\n`);
            result = data.results;
            try {
              s.write(result);
            } catch(e) {
              console.log('Slow down');
            }
        });
    s.pipe(recognizeStream);
    s.on('close', () => {
        console.log('bye');
    });
}).listen(PORT, HOST, () => {
    console.log("listening on ", PORT);
});
