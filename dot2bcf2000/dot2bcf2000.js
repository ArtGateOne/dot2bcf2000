//dot2bcf2000 by ArtGateO)ne v1.0.0 (basic)


//config
midi_in = 'BCF2000';     //set correct midi in device name
midi_out = 'BCF2000';    //set correct midi out device name




var sessionnr = 0;
var pageIndex = 0;
var wing = 1;
var request = 0;
var controller = 0;
var matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
var exec = JSON.parse('{"index":[[5,4,3,2,1,0,0,0],[13,12,11,10,9,8,7,6],[21,20,19,18,17,16,15,14]]}');



function interval(){
  if (sessionnr > 0){
    if (wing == 2){
      client.send('{"requestType":"playbacks","startIndex":[14,114,214],"itemsCount":[8,8,8],"pageIndex":'+ pageIndex +',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":'+ sessionnr +',"maxRequests":1}');
    }
    if (wing == 1){
      client.send('{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":'+ pageIndex +',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":'+ sessionnr +',"maxRequests":1}');
    }
    if (wing === 0){//not used
      client.send('{"requestType":"playbacks","startIndex":[0,100,200],"itemsCount":[6,6,6],"pageIndex":'+ pageIndex +',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":'+ sessionnr +',"maxRequests":1}');
    }
  }
}

setInterval (interval, 100);

var easymidi = require('easymidi');
//display info
console.log("BCF200 .2 WING " + wing);
console.log(" ");

//display all midi devices
console.log("Midi IN");
console.log(easymidi.getInputs());
console.log("Midi OUT");
console.log(easymidi.getOutputs());

console.log(" ");

console.log("Connecting to midi device " + midi_in);

//open midi device
var input = new easymidi.Input(midi_in);
var output = new easymidi.Output(midi_out);


//send fader pos do dot2
input.on('pitch', function (msg) {
var faderValue = ((msg.value-134)*0.0000625)
if (msg.value <= 134){faderValue = 0;}
if (faderValue > 1){faderValue = 1;}
client.send('{"requestType":"playbacks_userInput","execIndex":'+ exec.index[wing][msg.channel] +',"pageIndex":'+ pageIndex +',"faderValue":'+ (faderValue) +',"type":1,"session":'+ sessionnr +',"maxRequests":0}');
});

//send wing led status
output.send('noteon', {note: 43, velocity: 127, channel: 0});
output.send('noteon', {note: 44, velocity: 0, channel: 0});

for (controller = 48; controller <= 55; controller++){
output.send('cc', {controller: controller, value: 0, channel: 0});
}


output.send('cc', {controller: 48, value: 54, channel: 0});
//output.send('sysex',[0xf0, 0x00, 0x00, 0x66, 0x05, 0x00, 0x10, 0x00, 0x00, 0x00, 0x31, 0x33, 0xf7]);


input.on('noteon', function (msg) {
  
    if (msg.note == 43){//wing1
        wing = 1;
        output.send('noteon', {note: 43, velocity: 127, channel: 0});
        output.send('noteon', {note: 44, velocity: 0, channel: 0});
        matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
	}

    if (msg.note == 44){//wing2
        wing = 2;
        output.send('noteon', {note: 43, velocity: 0, channel: 0});
        output.send('noteon', {note: 44, velocity: 127, channel: 0});
        matrix = [221, 220, 219, 218, 217, 216, 215, 214, 121, 120, 119, 118, 117, 116, 115, 114, 21, 20, 19, 18, 17, 16, 15, 14, 21, 20, 19, 18, 17, 16, 15, 14];
        }

    if (31 < msg.note && msg.note < 40){
	for (controller = 48; controller <= 55; controller++){
	output.send('cc', {controller: controller, value: 0, channel: 0});
	}
	output.send('cc', {controller: ((msg.note)+16), value: 54, channel: 0});
	pageIndex = msg.note - 32;

    }


    if (msg.note <= 31){//send buttons to dot2
	if (msg.note < 24){
		if (msg.velocity === 127){
			client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":'+ matrix[msg.note] +',"pageIndex":'+ pageIndex +',"buttonId":0,"pressed":true,"released":false,"type":0,"session":'+ sessionnr +',"maxRequests":0}');
	    	} else {
			client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":'+ matrix[msg.note] +',"pageIndex":'+ pageIndex +',"buttonId":0,"pressed":false,"released":true,"type":0,"session":'+ sessionnr +',"maxRequests":0}');
	}} else {
		if (msg.velocity === 127){
			client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":'+ matrix[msg.note] +',"pageIndex":'+ pageIndex +',"buttonId":1,"pressed":true,"released":false,"type":0,"session":'+ sessionnr +',"maxRequests":0}');
	    	} else {
			client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":'+ matrix[msg.note] +',"pageIndex":'+ pageIndex +',"buttonId":1,"pressed":false,"released":true,"type":0,"session":'+ sessionnr +',"maxRequests":0}');
	}
	}}
  
});





//WEBSOCKET-------------------
var W3CWebSocket = require('websocket').w3cwebsocket;
 
var client = new W3CWebSocket('ws://localhost:80/');

 
client.onerror = function() {
    console.log('Connection Error');
};
 
client.onopen = function() {
    console.log('WebSocket Client Connected');
 

};
 
client.onclose = function() {
    console.log('Client Closed');
    input.close();
    output.close();
    process.exit();
};
 
client.onmessage = function(e) {



  request = request + 1;
  
  if (request > 9){
    client.send('{"session":'+ sessionnr+'}');

    client.send('{"requestType":"getdata","data":"set","session":'+ sessionnr +',"maxRequests":1}');
    
    request = 1;
  }


    if (typeof e.data === 'string') {
        //console.log("Received: '" + e.data + "'");
        //console.log("-----------------");
	//console.log(e.data);
        
        obj = JSON.parse(e.data);
        
        
        if (obj.status == "server ready"){
          console.log("SERVER READY");
          client.send ('{"session":0}')
        }
        if (obj.forceLogin === true){
          console.log("LOGIN ...");
          sessionnr = (obj.session);
          client.send('{"requestType":"login","username":"remote","password":"2c18e486683a3db1e645ad8523223b72","session":'+ obj.session +',"maxRequests":10}')
          }

        if (obj.session){
          sessionnr = (obj.session);
        }


        if (obj.responseType == "login" && obj.result === true){
          client.send('{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":'+ pageIndex +',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":'+ sessionnr +',"maxRequests":1}');
          }


        if (obj.responseType == "getdata"){
          //"data":[{"set":"0"}],"worldIndex":0}){
          }

          

        if (obj.responseType == "playbacks"){//recive data from dot & set to BCF
		var channel = 7;
		for (var i = 0; i < 8; i++){
		output.send('noteon', {note: (channel), velocity: ((obj.itemGroups[2].items[i][0].isRun)*127), channel: 0});//executor
		output.send('noteon', {note: ((channel)+8), velocity: ((obj.itemGroups[1].items[i][0].isRun)*127), channel: 0});//executor
		//output.send('noteon', {note: ((channel)+16), velocity: ((obj.itemGroups[0].items[i][0].isRun)*127), channel: 0});
		output.send('noteon', {note: ((channel)+24), velocity: ((obj.itemGroups[0].items[i][0].isRun)*127), channel: 0});//executor
		
		
		var value = (obj.itemGroups[0].items[i][0].executorBlocks[0].fader.v);//fader
		if (value == 1){value = 16368;}
		else if (value === 0){;}
		else {
		value = (value/0.0000625)+134;}
		output.send('pitch', {value: (value), channel: (channel)});		
		channel--;
		
		}
	}       
    }
}

