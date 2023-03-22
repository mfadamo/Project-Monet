const os = require('os');
const process = require('process');
const nodejsVersion = process.version;
const freeMemory = os.freemem() / 1024 / 1024;
const cpuUsage = process.cpuUsage();

var settings = require('./settings.json');
var server = settings.server;
var serverPort = server.forcePort ? server.port : process.env.PORT || server.port;
console.clear()
console.log("\x1b[33m[ROOT] Running Workers Without Cloudflare", `\n[ROOT] NodeJS: ${nodejsVersion}, ${cpuUsage.system / 1000}%\n[ROOT] ${os.type()}, ${freeMemory}M`)

var spawn = require('child_process').spawn;
//kick off process of listing files
var child = spawn(`${server.runCmd}`, [server.args, '--ip', server.ip, '--port', serverPort, '--local --no-verify'], { shell: true });
child.stdout.on('data', function (data) {
    var sdata = data.toString()
    var a = sdata.includes('[mf:inf]') || sdata.includes('wrangler') || sdata.includes('GET /') || sdata.includes('POST /') || sdata.includes('PUT /') || sdata.includes("[mf:wrn]")
    if (!a && sdata.startsWith('[')) {
        var color = "\x1b[0m"
        if (sdata.startsWith('[ROUTE]')) color = colours.fg.cyan
        if (sdata.startsWith('[ENTITIES]')) color = colours.fg.green
        if (sdata.startsWith('[CAE]')) color = colours.fg.magenta
        if (sdata.startsWith('[ROOT]')) color = colours.fg.yellow
        if (sdata.startsWith('[PING]')) color = colours.fg.gray
        if (sdata.startsWith('[SUBS]')) color = colours.fg.blue
        process.stdout.write(color + sdata + colours.reset);
    }
})
console.log(`\x1b[33m[ROOT] Running On ${server.ip}:${serverPort}\x1b[8m`)
child.stderr.on('data', function (data) { process.stdout.write(data.toString()); });
child.on('close', function (code) {
    console.log("App Stopped With Code" + code);
});


const colours = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
        crimson: "\x1b[38m" // Scarlet
    }
};