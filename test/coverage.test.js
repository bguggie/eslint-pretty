'use strict';

const test = require('tape');
const spawn = require('child_process').spawn;
const fs = require('fs');

test('eslint-pretty basics', (t) => {
    t.plan(2);
    callBin('alone', (out) => {
        t.equal(out, 'alone;', 'basic semicolon');
    });
    callBin('( ͡° ͜ʖ ͡°)', (out) => {
        t.equal(out, '( ͡° ͜ʖ ͡°)', 'does not choke on bs');
    });
});

test('eslint-pretty fixes bad code', (t) => {
    t.plan(1);
    let badcode = fs.readFileSync(__dirname + '/assets/badcode.js');
    callBin(badcode.toString(), (out) => {
        t.ok(out, 'does not choke');
    });
});


// -----------------------------------------------------------------------------

function callBin(input, callback) {
    let bin = spawn(__dirname + '/../bin/eslint-pretty.js');
    let chunks = [];

    bin.stdout.on('data', (chunk) => {
        chunks.push(chunk);
    });

    bin.stdout.on('end', () => {
        let buf = Buffer.concat(chunks);
        callback(buf.toString());
    });

    bin.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    bin.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });

    bin.on('error', (err) => {
        console.error(err, err.stack);
    });

    bin.stdin.write(input);
    bin.stdin.end();
}

