var express = require("express");
var app = express();
var path = require("path");
var events = require('events');
var eventEmitter = new events.EventEmitter();
var bodyParser = require("body-parser");

// ============== Constants ====================================================
var PORT = 5000;
var Data = {
    switch1:false,
    switch2:false,
    switch3:false,
    switch4:false,
};
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
    console.log("triggered");
    // console.log("Switch1:"+arg.data.switch1);
    // console.log("Switch2:"+arg.data.switch2);
    // console.log("Switch3:"+arg.data.switch3);
    // console.log("Switch4:"+arg.data.switch4);
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
    console.log(req.body);
    res.send(req.body);
    eventEmitter.emit('bluetoothTrigger',{data:req.body});
    console.log("Switch flicked");
});

// Route 3
router.get('/State',function(req,res){
    res.send(Data);
});
// =============================================================================

app.use('',router);
app.listen(PORT);
console.log("Listening for request on "+addresses+":"+PORT);
