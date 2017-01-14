var express = require("express");
var app = express();
var path = require("path");
var events = require('events');
var fs = require('fs');
var eventEmitter = new events.EventEmitter();
var bodyParser = require("body-parser");
var childProcess = require("child_process");        //Child process
var spawn = childProcess.spawn;     //Child process spawned
var http = require('http').Server(app);   //We will use seperate http server so that we can superimpose socket listener on it
var io = require('socket.io')(http);    //Placing socket on the http server object

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
    var child = spawn('java',['-jar','./jar/bluetoothSwitch.jar']);
    child.stdin.write(data+"\n");
    feedback = '';
    child.stdout.on('data',function(chunk){
        console.log(chunk);
        feedback = feedback+chunk;
    });
    // child.stdout.pipe(process.stdout);

    // Feedback chain start when the java process closes
    child.on('close',function(code){
        feedback = feedback.trim();     //Feedback is the data we are recieving from JAR file
        console.log(feedback);
        fs.writeFile('./data.txt',feedback,function(err){
            if(err){
                console.log("Error while writing file. Aborting!!");
            }
            else{
                fs.readFile('./data.txt',{encoding: 'utf-8'},function(err,feedback){
                    eventEmitter.emit('feedback',feedback);
                });
            }
        });
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
    eventEmitter.emit('bluetoothTrigger',{data:req.body});
    // When positive feedback is recieved
    eventEmitter.on('feedback',function(data){
        res.send(JSON.stringify(eval("(" + data + ")")));
    });
});

// Route 3
router.get('/State',function(req,res){
    fs.readFile('./data.txt',{encoding: 'utf-8'},function(err,data){
        res.send(JSON.stringify(eval("(" + data + ")")));
    });
});
// =============================================================================

app.use('',router);
// http.listen(3000, function(){
//   console.log("Listening for request on "+addresses+":"+PORT);
// });
app.listen(PORT);
console.log("Listening for request on "+addresses+":"+PORT);
