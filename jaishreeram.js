const https = require('https');
const fs = require('fs');
const crypto = require('crypto');

// Step 1: Perform a GET request to the provided URL
https.get('https://coderbyte.com/api/challenges/json/age-counting', (resp) => {
  let data = '';

  // A chunk of data has been received.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  // The whole response has been received.
  resp.on('end', () => {
    const jsonData = JSON.parse(data);
    const dataString = jsonData.data;
    const entries = dataString.split(',');

    let count = 0;
    let keys = [];

    // Step 2: Parse the data to count items with age 32 and extract keys
    for (let i = 0; i < entries.length; i += 2) {
      const keyPart = entries[i];
      console.log(keyPart)
      
      const agePart = entries[i + 1];
      console.log(agePart)

      const key = keyPart.split('=')[1];
      const age = parseInt(agePart.split('=')[1]);

      if (age === 32) {
        count++; 
      }
    }

    // Step 3: Write the keys to output.txt
    const writeStream = fs.createWriteStream('output.txt');
    keys.forEach(key => writeStream.write(key + '\n'));
    writeStream.end('\n'); // Ensure the file ends with a newline character

    writeStream.on('finish', () => {
      // Step 4: Calculate the SHA1 hash of the file
      const fileBuffer = fs.readFileSync('output.txt');
      const hash = crypto.createHash('sha1');
      hash.update(fileBuffer);
      const sha1Hash = hash.digest('hex');

      // Output the SHA1 hash
      console.log(sha1Hash);
    });
  });

}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
