//dot2bcf2000 v 1.4.1 by ArtGateOne

var easymidi = require('easymidi');
var W3CWebSocket = require('websocket')
    .w3cwebsocket;
var client = new W3CWebSocket('ws://localhost:80/'); //U can change localhost(127.0.0.1) to Your console IP address


//config
var midi_in = 'BCF2000';      //set correct midi in device name
var midi_out = 'BCF2000';     //set correct midi out device name
var page_sw = 1;              //Auto Page switch on dot2  1 = ON, 0 = OFF
var blackout_toggle_mode = 0; //BlackOut toggle mode    1 = ON, 0 = OFF
var executors_view = 1;       //default executors view/control   0 = bottom, 1 = top
var wing = 0;                 //default core = 0, f-wing 1 or 2

var fader7 = "1.1";     //Core fader L SpecialMaster nr
var fader8 = "1.2";     //Core fader R SpecialMaster nr

var fader7_val = 16368; //default fader position for core L master fader
var fader8_val = 0;     //default fader position for core R master fader

//Uncoment when u wan use fader 8 as Grand Master in CORE
//fader8 = "2.1";
//fader8_val = 16368;

//----------------------------------------------------------------------------------------------

var clear_button = 0;
var speedmaster1 = 60;
var speedmaster2 = 60;
var speedmaster3 = 60;
var speedmaster4 = 60;
var blackout = 0;
var grandmaster = 100;
var gmvalue = 43;
var sessionnr = 0;
var pageIndex = 0;

var request = 0;
var interval_on = 0;
var controller = 0;
var matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
var exec = JSON.parse('{"index":[[5,4,3,2,1,0,0,0],[13,12,11,10,9,8,7,6],[21,20,19,18,17,16,15,14]]}');



function interval() {
    if (sessionnr > 0) {
        if (wing == 2) {
            client.send('{"requestType":"playbacks","startIndex":[14,114,214],"itemsCount":[8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }
        if (wing == 1) {
            client.send('{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }
        if (wing === 0) {//not used
            client.send('{"requestType":"playbacks","startIndex":[0,100,200],"itemsCount":[6,6,6],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }
    }
}

//setInterval(interval, 100);


//display info
console.log("BCF2000 .2 CORE");
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


input.on('cc', function (msg) {


    if (msg.controller == 16) {//DIM
        if (msg.value < 60) {
            client.send('{"requestType":"encoder","name":"DIM","value":' + (msg.value) + ',"session":' + sessionnr + '","maxRequests":0}');

        } else {
            client.send('{"requestType":"encoder","name":"DIM","value":' + ((msg.value - 64) * -1) + ',"session":' + sessionnr + '","maxRequests":0}');
        }
    }

    if (msg.controller == 17) {//PAN
        if (msg.value < 60) {
            client.send('{"requestType":"encoder","name":"PAN","value":' + (msg.value) + ',"session":' + sessionnr + '","maxRequests":0}');

        } else {
            client.send('{"requestType":"encoder","name":"PAN","value":' + ((msg.value - 64) * -1) + ',"session":' + sessionnr + '","maxRequests":0}');
        }
    }

    if (msg.controller == 18) {//TILT
        if (msg.value < 60) {
            client.send('{"requestType":"encoder","name":"TILT","value":' + (msg.value) + ',"session":' + sessionnr + '","maxRequests":0}');

        } else {
            client.send('{"requestType":"encoder","name":"TILT","value":' + ((msg.value - 64) * -1) + ',"session":' + sessionnr + '","maxRequests":0}');
        }
    }

    if (msg.controller == 19) {//SpeedMaster 1
        if (msg.value < 60) {
            speedmaster1 = speedmaster1 + msg.value;
        } else {
            speedmaster1 = speedmaster1 - (msg.value - 64)
        }
        if (speedmaster1 < 0) {
            speedmaster1 = 0;
        }
        client.send('{"command":"SpecialMaster 3.1 At ' + (speedmaster1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.controller == 20) {//SpeedMaster 2
        if (msg.value < 60) {
            speedmaster2 = speedmaster2 + msg.value;
        } else {
            speedmaster2 = speedmaster2 - (msg.value - 64)
        }
        if (speedmaster2 < 0) {
            speedmaster2 = 0;
        }
        client.send('{"command":"SpecialMaster 3.2 At ' + (speedmaster2) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.controller == 21) {//SpeedMaster 3
        if (msg.value < 60) {
            speedmaster3 = speedmaster3 + msg.value;
        } else {
            speedmaster3 = speedmaster3 - (msg.value - 64)
        }
        if (speedmaster3 < 0) {
            speedmaster3 = 0;
        }
        client.send('{"command":"SpecialMaster 3.3 At ' + (speedmaster3) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.controller == 22) {//SpeedMaster 4
        if (msg.value < 60) {
            speedmaster4 = speedmaster4 + msg.value;
        } else {
            speedmaster4 = speedmaster4 - (msg.value - 64)
        }
        if (speedmaster4 < 0) {
            speedmaster4 = 0;
        }
        client.send('{"command":"SpecialMaster 3.4 At ' + (speedmaster4) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.controller == 23) {//grand master
        if (msg.value < 60) {
            grandmaster = grandmaster + msg.value;
        } else {
            grandmaster = grandmaster - (msg.value - 64);
        }
        if (grandmaster > 100) {
            grandmaster = 100;
        } else if (grandmaster < 0) {
            grandmaster = 0;
        }

        gmvalue = ((grandmaster / 10) + 33);

        if (blackout == 0) {
            client.send('{"command":"SpecialMaster 2.1 At ' + (grandmaster) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }

        if (blackout == 1) {
            gmvalue = gmvalue - 32;
        }
        output.send('cc', { controller: 55, value: gmvalue, channel: 0 });
    }
});



input.on('pitch', function (msg) {//send fader pos do dot2
    if (wing == 0) {
        if (msg.channel < 6) {
            var faderValue = ((msg.value - 134) * 0.0000625)
            if (msg.value <= 134) { faderValue = 0; }
            if (faderValue > 1) { faderValue = 1; }
            client.send('{"requestType":"playbacks_userInput","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex + ',"faderValue":' + (faderValue) + ',"type":1,"session":' + sessionnr + ',"maxRequests":0}');
        } else if (msg.channel == 6) {
            var faderValue = ((msg.value - 134) * 0.00625)
            if (msg.value <= 134) { faderValue = 0; }
            if (faderValue > 100) { faderValue = 100; }
            fader7_val = msg.value;
            output.send('pitch', { value: msg.value, channel: 6 });
            client.send('{"command":"SpecialMaster ' + fader7 + ' At ' + (faderValue) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else if (msg.channel == 7) {
            var faderValue = ((msg.value - 134) * 0.00625)
            if (msg.value <= 134) { faderValue = 0; }
            if (faderValue > 100) { faderValue = 100; }
            fader8_val = msg.value;
            output.send('pitch', { value: msg.value, channel: 7 });
            client.send('{"command":"SpecialMaster ' + fader8 + ' At ' + (faderValue) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }
    else if (wing == 1 || wing == 2) {
        var faderValue = ((msg.value - 134) * 0.0000625)
        if (msg.value <= 134) { faderValue = 0; }
        if (faderValue > 1) { faderValue = 1; }
        client.send('{"requestType":"playbacks_userInput","execIndex":' + exec.index[wing][msg.channel] + ',"pageIndex":' + pageIndex + ',"faderValue":' + (faderValue) + ',"type":1,"session":' + sessionnr + ',"maxRequests":0}');
    }
});

//send wing led status
if (wing == 1) {
    output.send('noteon', { note: 43, velocity: 127, channel: 0 });
    output.send('noteon', { note: 44, velocity: 0, channel: 0 });
    output.send('noteon', { note: 92, velocity: 127, channel: 0 });
    output.send('noteon', { note: 94, velocity: 127, channel: 0 });
    matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
} else if (wing == 2) {
    output.send('noteon', { note: 43, velocity: 0, channel: 0 });
    output.send('noteon', { note: 44, velocity: 127, channel: 0 });
    output.send('noteon', { note: 92, velocity: 127, channel: 0 });
    output.send('noteon', { note: 94, velocity: 127, channel: 0 });
    matrix = [221, 220, 219, 218, 217, 216, 215, 214, 121, 120, 119, 118, 117, 116, 115, 114, 21, 20, 19, 18, 17, 16, 15, 14, 21, 20, 19, 18, 17, 16, 15, 14];
} else if (wing == 0) {
    output.send('noteon', { note: 43, velocity: 0, channel: 0 });
    output.send('noteon', { note: 44, velocity: 0, channel: 0 });
    output.send('noteon', { note: 92, velocity: 127, channel: 0 });
    output.send('noteon', { note: 94, velocity: 127, channel: 0 });
    matrix = [205, 204, 203, 202, 201, 200, 0, 0, 105, 104, 103, 102, 101, 100, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
    output.send('pitch', { value: fader7_val, channel: 6 });
    output.send('pitch', { value: fader8_val, channel: 7 });
}


for (controller = 48; controller <= 55; controller++) {//reset encoder led
    output.send('cc', { controller: controller, value: 0, channel: 0 });
}
output.send('noteon', { note: 42, velocity: 0, channel: 0 });//led OFF EDIT key
output.send('noteon', { note: 45, velocity: 3, channel: 0 });//led clear blink
output.send('cc', { controller: 48, value: 54, channel: 0 });//led page 1
output.send('cc', { controller: 51, value: 33, channel: 0 });//led speedmaster 1
output.send('cc', { controller: 52, value: 34, channel: 0 });//led speedmaster 2
output.send('cc', { controller: 53, value: 35, channel: 0 });//led speedmaster 3
output.send('cc', { controller: 54, value: 36, channel: 0 });//led speedmaster 4
output.send('cc', { controller: 55, value: 54, channel: 0 });//led grandmaster
//output.send('sysex',[0xf0, 0x00, 0x00, 0x66, 0x05, 0x00, 0x10, 0x00, 0x00, 0x00, 0x31, 0x33, 0xf7]);
if (executors_view == 1) {//executors view
    output.send('noteon', { note: 91, velocity: 127, channel: 0 });//top
    output.send('noteon', { note: 93, velocity: 0, channel: 0 });//bottom
} else {
    output.send('noteon', { note: 91, velocity: 0, channel: 0 });//top
    output.send('noteon', { note: 93, velocity: 127, channel: 0 });//bottom
}


input.on('noteon', function (msg) {

    /*
    if (msg.note == 41 && msg.velocity == 127) {//encoder 1 click
      //output.send('cc', { controller: 54, value: testnote, channel: 0 });
      output.send('noteon', { note: 126, velocity:  testnote, channel: 0 });//led clear blink
      testnote++;
      console.log(testnote);
    }*/




    if (msg.note <= 31) {//send buttons to dot2
        if (msg.note == 22 && wing == 0 || msg.note == 23 && wing == 0 || msg.note == 30 && wing == 0 || msg.note == 31 && wing == 0) {
            //do nothing
        } else if (executors_view == 0) {
            if (msg.note < 24) {
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            } else {
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":1,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":1,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            }
        } else if (executors_view == 1) {
            if (msg.note < 16) {// do edycji!!!!
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[msg.note] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            } else if (msg.note >= 24) {
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[(msg.note - 24)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[(msg.note - 24)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            } else {
                if (msg.velocity === 127) {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[(msg.note - 8)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":true,"released":false,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                } else {
                    client.send('{"requestType":"playbacks_userInput","cmdline":"","execIndex":' + matrix[(msg.note - 8)] + ',"pageIndex":' + pageIndex + ',"buttonId":0,"pressed":false,"released":true,"type":0,"session":' + sessionnr + ',"maxRequests":0}');
                }
            }
        }
    }


    if (msg.note == 32 && msg.velocity == 127) {//1 enc click (Highlite)
        client.send('{"command":"Highlight","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.note == 33 && msg.velocity == 127) {//2 enc click (Pan center)
        client.send('{"command":"Attribute PAN At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.note == 34 && msg.velocity == 127) {//3 enc click (Tild center)
        client.send('{"command":"Attribute TILT At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.note == 35 && msg.velocity == 127) {//4 enc click (learn speedmaster 1)/Reset
        if (clear_button == 1) {
            client.send('{"command":"Rate1 SpecialMaster 3.1","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            speedmaster1 = 60;
        } else {
            client.send('{"command":"Learn SpecialMaster 3.1","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }
    if (msg.note == 36 && msg.velocity == 127) {//5 enc click (learn speedmaster 2)/Reset
        if (clear_button == 1) {
            client.send('{"command":"Rate1 SpecialMaster 3.2","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            speedmaster2 = 60;
        } else {
            client.send('{"command":"Learn SpecialMaster 3.2","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    if (msg.note == 37 && msg.velocity == 127) {//6 enc click (learn speedmaster 3)/Reset
        if (clear_button == 1) {
            client.send('{"command":"Rate1 SpecialMaster 3.3","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            speedmaster3 = 60;
        } else {
            client.send('{"command":"Learn SpecialMaster 3.3","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    if (msg.note == 38 && msg.velocity == 127) {//7 enc click (learn speedmaster 4)/Reset
        if (clear_button == 1) {
            client.send('{"command":"Rate1 SpecialMaster 3.4","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            speedmaster4 = 60;
        } else {
            client.send('{"command":"Learn SpecialMaster 3.4","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    if (msg.note == 39) {//8 enc click Blackout
        if (blackout_toggle_mode == 0) {
            if (msg.velocity == 127) {
                blackout = 1;
                client.send('{"command":"SpecialMaster 2.1 At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                gmvalue = gmvalue - 32;

            } else {
                blackout = 0;
                client.send('{"command":"SpecialMaster 2.1 At ' + (grandmaster) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                gmvalue = gmvalue + 32;
            }
        } else if (blackout_toggle_mode == 1) {
            if (msg.velocity == 127) {
                if (blackout == 0) {
                    blackout = 1;
                    client.send('{"command":"SpecialMaster 2.1 At 0","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                    gmvalue = gmvalue - 32;
                } else {
                    blackout = 0;
                    client.send('{"command":"SpecialMaster 2.1 At ' + (grandmaster) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
                    gmvalue = gmvalue + 32;
                }
            }
        }
        output.send('cc', { controller: 55, value: gmvalue, channel: 0 });
    }

    if (msg.note == 42 && msg.velocity == 127) {//ClearAll
        if (clear_button == 1) {
          client.send('{"command":"Off Page Thru","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
          //client.send('{"command":"Exec *.* At zero","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
      }

    if (msg.note == 43 && msg.velocity == 127) {//wing 1
        if (wing == 0 || wing == 2) {
            wing = 1;
            output.send('noteon', { note: 43, velocity: 127, channel: 0 });
            output.send('noteon', { note: 44, velocity: 0, channel: 0 });
            matrix = [213, 212, 211, 210, 209, 208, 207, 206, 113, 112, 111, 110, 109, 108, 107, 106, 13, 12, 11, 10, 9, 8, 7, 6, 13, 12, 11, 10, 9, 8, 7, 6];
        } else {
            wing = 0;
            output.send('noteon', { note: 43, velocity: 0, channel: 0 });
            output.send('noteon', { note: 44, velocity: 0, channel: 0 });
            matrix = [205, 204, 203, 202, 201, 200, 0, 0, 105, 104, 103, 102, 101, 100, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
        }
    }

    if (msg.note == 44 && msg.velocity == 127) {//wing 2
        if (wing == 0 || wing == 1) {
            wing = 2;
            output.send('noteon', { note: 43, velocity: 0, channel: 0 });
            output.send('noteon', { note: 44, velocity: 127, channel: 0 });
            matrix = [221, 220, 219, 218, 217, 216, 215, 214, 121, 120, 119, 118, 117, 116, 115, 114, 21, 20, 19, 18, 17, 16, 15, 14, 21, 20, 19, 18, 17, 16, 15, 14];
        } else {
            wing = 0;
            output.send('noteon', { note: 43, velocity: 0, channel: 0 });
            output.send('noteon', { note: 44, velocity: 0, channel: 0 });
            matrix = [205, 204, 203, 202, 201, 200, 0, 0, 105, 104, 103, 102, 101, 100, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0, 5, 4, 3, 2, 1, 0, 0, 0];
        }
    }


    if (msg.note == 45) {// Clear commabd
        if (msg.velocity == 127) {
          clear_button = 1;
          output.send('noteon', { note: 42, velocity: 3, channel: 0 });
          client.send('{"command":"Clear","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        } else {
          clear_button = 0;
          output.send('noteon', { note: 42, velocity: 0, channel: 0 });
        }
      }

    if (msg.note == 46 && msg.velocity == 127 || msg.note == 48 && msg.velocity == 127 || msg.note == 70 && msg.velocity == 127) {//page select <
        output.send('cc', { controller: pageIndex + 48, value: 0, channel: 0 });
        output.send('cc', { controller: 51, value: 33, channel: 0 });//led speedmaster 1
        output.send('cc', { controller: 52, value: 34, channel: 0 });//led speedmaster 2
        output.send('cc', { controller: 53, value: 35, channel: 0 });//led speedmaster 3
        output.send('cc', { controller: 54, value: 36, channel: 0 });//led speedmaster 4
        pageIndex--;
        if (pageIndex < 0) {
            pageIndex = 0;
        }
        output.send('cc', { controller: pageIndex + 48, value: 54, channel: 0 });
        if (page_sw == 1) {
            client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }

    if (msg.note == 47 && msg.velocity == 127 || msg.note == 49 && msg.velocity == 127 || msg.note == 71 && msg.velocity == 127) {//page select > 
        output.send('cc', { controller: pageIndex + 48, value: 0, channel: 0 });
        output.send('cc', { controller: 51, value: 33, channel: 0 });//led speedmaster 1
        output.send('cc', { controller: 52, value: 34, channel: 0 });//led speedmaster 2
        output.send('cc', { controller: 53, value: 35, channel: 0 });//led speedmaster 3
        output.send('cc', { controller: 54, value: 36, channel: 0 });//led speedmaster 4
        pageIndex++;
        if (pageIndex > 6) {
            pageIndex = 6;
        }
        output.send('cc', { controller: pageIndex + 48, value: 54, channel: 0 });
        if (page_sw == 1) {
            client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
        }
    }


    //encder click 32-39 

    /*
    if (31 < msg.note && msg.note < 40) {//old page select
      for (controller = 48; controller <= 55; controller++) {
        output.send('cc', { controller: controller, value: 0, channel: 0 });
      }
      output.send('cc', { controller: ((msg.note) + 16), value: 54, channel: 0 });
      pageIndex = msg.note - 32;
    
    }
    */


    if (msg.note == 91 && msg.velocity == 127) {//top
        executors_view = 1;
        output.send('noteon', { note: 91, velocity: 127, channel: 0 });//top
        output.send('noteon', { note: 93, velocity: 0, channel: 0 });//bottom
    }

    if (msg.note == 92 && msg.velocity == 127) {//exec time toggle
        client.send('{"command":"DefGoBack","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

    if (msg.note == 93 && msg.velocity == 127) {//bottom 
        executors_view = 0;
        output.send('noteon', { note: 91, velocity: 0, channel: 0 });//top
        output.send('noteon', { note: 93, velocity: 127, channel: 0 });//bottom
    }

    if (msg.note == 94 && msg.velocity == 127) {//prog time toggle
        client.send('{"command":"DefGoForward","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
    }

});





//WEBSOCKET-------------------

client.onerror = function () {
    console.log('Connection Error');
};

client.onopen = function () {
    console.log('WebSocket Client Connected');
    setInterval(interval, 80);
    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    //sendNumber();
};

client.onclose = function () {
    console.log('Client Closed');
    setInterval(interval, 0);
    for (i = 0; i <= 127; i++) {
        output.send('noteon', { note: i, velocity: 0, channel: 0 });
        sleep(10, function () { });
    }

    for (i = 0; i <= 127; i++) {
        output.send('cc', { controller: i, value: 55, channel: 0 });
        sleep(10, function () { });
    }


    for (i = 0; i <= 7; i++) {
        output.send('pitch', { value: 0, channel: i });
        sleep(10, function () { });
    }


    input.close();
    output.close();
    process.exit();
};

client.onmessage = function (e) {



    request = request + 1;

    if (request > 9) {
        client.send('{"session":' + sessionnr + '}');

        client.send('{"requestType":"getdata","data":"set","session":' + sessionnr + ',"maxRequests":1}');

        request = 1;
    }


    if (typeof e.data === 'string') {
        //console.log("Received: '" + e.data + "'");
        //console.log("-----------------");
        //console.log(e.data);

        obj = JSON.parse(e.data);


        if (obj.status == "server ready") {
            client.send('{"session":0}')
        }
        if (obj.forceLogin === true) {
            sessionnr = (obj.session);
            client.send('{"requestType":"login","username":"remote","password":"2c18e486683a3db1e645ad8523223b72","session":' + obj.session + ',"maxRequests":10}')
        }

        if (obj.session) {
            sessionnr = (obj.session);
        }


        if (obj.responseType == "login" && obj.result === true) {
            if (interval_on == 0) {
                interval_on = 1;
                setInterval(interval, 100);//80
            }
            console.log("...LOGGED");
            console.log("SESSION " + sessionnr);
            if (page_sw == 1) {
                client.send('{"command":"Page ' + (pageIndex + 1) + '","session":' + sessionnr + ',"requestType":"command","maxRequests":0}');
            }
            //client.send('{"requestType":"playbacks","startIndex":[6,106,206],"itemsCount":[8,8,8],"pageIndex":' + pageIndex + ',"itemsType":[2,3,3],"view":2,"execButtonViewMode":1,"buttonsViewMode":0,"session":' + sessionnr + ',"maxRequests":1}');
        }


        if (obj.responseType == "getdata") {
            //"data":[{"set":"0"}],"worldIndex":0}){
        }



        if (obj.responseType == "playbacks") {//recive data from dot & set to BCF


            if (obj.itemGroups[0].items[0][0].iExec == 0) {
                var channel = 5;
                var exec = 6;
                output.send('pitch', { value: fader7_val, channel: 6 });
                output.send('pitch', { value: fader8_val, channel: 7 });
                output.send('noteon', { note: 6, velocity: 0, channel: 0 });
                output.send('noteon', { note: 7, velocity: 0, channel: 0 });
                output.send('noteon', { note: 14, velocity: 0, channel: 0 });
                output.send('noteon', { note: 15, velocity: 0, channel: 0 });
                output.send('noteon', { note: 22, velocity: 0, channel: 0 });
                output.send('noteon', { note: 23, velocity: 0, channel: 0 });
                output.send('noteon', { note: 30, velocity: 0, channel: 0 });
                output.send('noteon', { note: 31, velocity: 0, channel: 0 }); //60 61 68 69
            } else {
                var channel = 7;
                var exec = 8;
            }

            for (var i = 0; i < exec; i++) {
                if (executors_view == 0) {
                    output.send('noteon', { note: (channel), velocity: ((obj.itemGroups[2].items[i][0].isRun) * 127), channel: 0 });//executor top 
                    output.send('noteon', { note: ((channel) + 8), velocity: ((obj.itemGroups[1].items[i][0].isRun) * 127), channel: 0 });//executor top
                    output.send('noteon', { note: ((channel) + 16), velocity: ((obj.itemGroups[0].items[i][0].isRun)), channel: 0 });//executor fader bottom 1
                    output.send('noteon', { note: ((channel) + 24), velocity: ((obj.itemGroups[0].items[i][0].isRun) * 127), channel: 0 });//executor fader bottom 0
                } else {
                    output.send('noteon', { note: (channel), velocity: ((obj.itemGroups[2].items[i][0].isRun) * 127), channel: 0 });//executor top 
                    output.send('noteon', { note: ((channel) + 8), velocity: ((obj.itemGroups[1].items[i][0].isRun) * 127), channel: 0 });//executor top
                    output.send('noteon', { note: ((channel) + 24), velocity: ((obj.itemGroups[2].items[i][0].isRun) * 127), channel: 0 });//executor top 
                    output.send('noteon', { note: ((channel) + 16), velocity: ((obj.itemGroups[1].items[i][0].isRun) * 127), channel: 0 });//executor top

                }
                var value = (obj.itemGroups[0].items[i][0].executorBlocks[0].fader.v);//fader
                if (value == 1) { value = 16368; }
                else if (value === 0) { ; }
                else {
                    value = (value / 0.0000625) + 134;
                }
                output.send('pitch', { value: (value), channel: (channel) });
                channel--;

            }
        }
    }
}

//sleep function
function sleep(time, callback) {
    var stop = new Date()
        .getTime();
    while (new Date()
        .getTime() < stop + time) {
        ;
    }
    callback();
}

