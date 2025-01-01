var express = require('express');
var router = express.Router();
const userHelpers = require('../helpers/user-helpers');
const { spawn } = require('child_process');

router.get('/', function(req, res, next) {
  res.render("user/testpage")
  return
});

router.post('/get_image', function(req, res, next) {
  try {
    const base64Image = req.body.image;
    const base64Data = base64Image.replace(/^data:image\/jpeg;base64,/, '');
    
    const python = spawn('python', ['classifier/classifier_file.py'], {
        stdio: ['pipe', 'pipe', 'pipe'],
    });

    python.stdin.write(base64Data);
    python.stdin.end();

    let result = '';

    python.stdout.on('data', function (data) {
        result += data.toString(); // Append data from the Python script
        console.log(`Python script output (stream): ${data.toString()}`); // Debugging log
    });

    python.stderr.on('data', function (data) {
        console.error(`stderr: ${data}`);
    });

    python.on('exit', function (code) {
        if (code === 0) {
            console.log(`Final Python script output: ${result.trim()}`);
            
            // Extract the final number (assuming it’s the last line of output)
            const lines = result.trim().split('\n');
            const prediction = lines[lines.length - 1]; // Last line is the prediction
            
            console.log(`Extracted prediction: ${prediction}`);
            
            res.send({ prediction }); // Send the prediction in response
        } else {
            console.error('Error in Python script execution');
            res.status(500).send('Error processing the image');
        }
    });

    return;
  } catch (err) {
    console.error("Error in processing image", err);
    res.status(500).send('Something went wrong');
  }
});


module.exports = router;

