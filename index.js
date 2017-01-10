var express = require("express");
var app = express();
var path = require("path");
var events = require('events');
var fs = require('fs');
var eventEmitter = new events.EventEmitter();
var bodyParser = require("body-parser");
var childProcess = require("child_process");        //Child process
var spawn = childProcess.spawn;     //Child process spawned

// ============== Constants ====================================================
var PORT = 5000;
// =============================================================================

// =============== Middle wares ================================================
// Path to look for static files
app.use(express.static('./static'));        //The relative path in which the statics requests are done depends on this path

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
// =============================================================================

//================= Code to find the host IP address============================
var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}
//==============================================================================

// ================= Bluetooth Event ===========================================
eventEmitter.on('bluetoothTrigger',function(arg){
    data = JSON.stringify(arg.data.data);
    // Spawing java class to deal with bluetooth hardware
    var child = spawn('java',['-cp','./java_code','Driver']);
    child.stdin.write(data+"\n");
    // child.stdout.on('data',function(data){
    //     console.log(data.toString().trim());
    // });
    child.stdout.pipe(process.stdout);
    child.on('close',function(code){
        fs.writeFile('./data.txt',data,function(err){
            if(err){
                console.log("Error while writing file. Aborting!!");
            }
        });
        console.log("Java snippet ran successfully with exit code ",code);
    });
});
// =============================================================================

var router = express.Router();

// ================ Routes =====================================================
// Route 1
router.get('/',function(req,res){
    res.sendfile(path.join(__dirname,"/static/index.html"));
});

// Route 2
router.post('/switchFlick',function(req,res){
    // Emit event to execute java function
    res.send(req.body);
    eventEmitter.emit('bluetoothTrigger',{data:req.body});
});

// Route 3
router.get('/State',function(req,res){
    fs.readFile('./data.txt',{encoding: 'utf-8'},function(err,data){
        res.send(JSON.stringify(eval("(" + data + ")")));
    });
});
// =============================================================================

app.use('',router);
app.listen(PORT);
console.log("Listening for request on "+addresses+":"+PORT);
