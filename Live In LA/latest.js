//latest

//adding this override to address the callback when limit is one.
cracked.array_next = function(arr,offset,limit,callback) {
    offset = offset || 0;
    limit = limit || arr.length;
    var adjusted_limit = Math.min(limit,arr.length);
    var adjusted_offset = Math.min(offset,adjusted_limit-1);
    var old_index = arr.current_index = __.ifUndef(arr.current_index,-1);
    arr.current_index = (arr.current_index+1+adjusted_offset) >= adjusted_limit ? 0 : arr.current_index+1;
    if((old_index >= arr.current_index) && (typeof callback === "function")) {
        callback();
    }
    return arr[arr.current_index + adjusted_offset];
};

/*
  v1_length
  v2_length
  v3_length
  v4_length

  v1_throttle
  v2_throttle
  v3_throttle
  v4_throttle
*/

/////////////////////////////

var v1_length_staging = 0;
var v2_length_staging = 0
var v3_length_staging = 0;
var v4_length_staging = 0;

var v1_length = 0;
var v2_length = 0
var v3_length = 0;
var v4_length = 0;

var throttle_64  = function(d){return d >=64;};
var throttle_32  = function(d){return d >=32;};
var throttle_16  = function(d){return d >=16;};
var throttle_8   = function(d){return d >=8};
var throttle_4   = function(d){return d >=4};
var throttle_2   = function(d){return d >=2};
var throttle_1   = function(d){return d >=1};

var v1_throttle_staging = throttle_4;
var v2_throttle_staging = throttle_2;
var v3_throttle_staging = throttle_16;
var v4_throttle_staging = throttle_1;
var v5_throttle_staging = throttle_4;

var v1_throttle = throttle_4;
var v2_throttle = throttle_2;
var v3_throttle = throttle_16;
var v4_throttle = throttle_1;
var v5_throttle = throttle_4;

var throttle_lookup = [
    throttle_1,
    throttle_2,
    throttle_4,
    throttle_8,
    throttle_16,
    throttle_32,
    throttle_64
];

/////////////////////////////

__().gain({id:"main"}).overdrive().overdrive().overdrive().dac(1);

for(var z=0;z<20;z++) {

  var v = Math.floor(z/5)+1;  
  var p = {v1:-1,v2:1,v3:-1/2,v4:1/2};
  __().sine({id:"s"+z}).gain({class:"v"+v}).gain({class:"level_"+v}).panner(p["v"+v]).connect("#main");
  
}
__().sine(120).lowpass({q:200,frequency:60}).adsr(1/16).gain({id:"kick"}).gain({class:"kick_level"}).connect("#main");

/////////////////////////////

var chord = [0,4,7,10,12];
var chord2 = [0,4,7,10,12];
var chord3 = [0,4,7,10,12];
var chord4 = [0,4,7,10,12];
var step = 0;


var ok_to_run = [
    true,
    true,
    true,
    true,
    true
];

__("gain").volume(0);
__("#main,#kick").volume(1);
__(".level_1,.level_2,.level_3,.level_4,.kick_level").volume(1);
__(".v1,.v2,.v3,.v4").volume(1/20);

__.loop({interval:75,steps:64},function(idx,data) {

///////////////////////////// V1
  
  if(v1_throttle(data) && ok_to_run[0]) {

    var p = __.array_next(chord,0,v1_length,function(){
        v1_length = v1_length_staging;
        v1_throttle = v1_throttle_staging;
    });

    for(var i=0;i<chord.length;i++) {
      __("#s"+i).frequency(__.pitch2freq(p+i*12+48+step));
    }     
    
  }

///////////////////////////// V2
  
  if(v2_throttle(data) && ok_to_run[1]) {

    var p2 = __.array_next(chord2,0,v2_length,function(){
        v2_length = v2_length_staging;
        v2_throttle = v2_throttle_staging;
    });

    for(var j=0;j<chord2.length;j++) {
      __("#s"+(j+5)).frequency(__.pitch2freq(p2+j*12+36+step));
    }
    
  }
  
///////////////////////////// V3

    if(v3_throttle(data) && ok_to_run[2]) {

        var p3 = __.array_next(chord3,0,v3_length,function(){
            v3_length = v3_length_staging;
            v3_throttle = v3_throttle_staging;
        });

        for(var k=0;k<chord3.length;k++) {
            __("#s"+(k+10)).frequency(__.pitch2freq(p3+k*12+24+step));
        }     

    }

///////////////////////////// V4

    if(v4_throttle(data) && ok_to_run[3]) {

        var p4 = __.array_next(chord4,0,v4_length,function(){
            v4_length = v4_length_staging;
            v4_throttle = v4_throttle_staging;
        });

        for(var l=0;l<chord2.length;l++) {
            __("#s"+(l+15)).frequency(__.pitch2freq(p4+l*12+72+step));
        }

    }

///////////////////////////// V5

  if(v5_throttle(data) && ok_to_run[4]) {

    v5_throttle = v5_throttle_staging;

    __("adsr").adsr("trigger");

  }
  
      
},[
        64,1,2,1,4,1,2,1,8,1,2,1,4,1,2,1,
        16,1,2,1,4,1,2,1,8,1,2,1,4,1,2,1,
        32,1,2,1,4,1,2,1,8,1,2,1,4,1,2,1,
        16,1,2,1,4,1,2,1,8,1,2,1,4,1,2,1
]);


/* monome code below **************************************/
//the model
var monome_model = {};
//copy the old one
var previous_monome_model = {};

//dispatch events to the right functions
function dispatch_event(item) {
    if(item.x === 15) {
        switch(item.y) {
            case 7:
                item.led_state = item.led_state ? 0 : 1;
                break;
            case 0:
                item.led_state = item.led_state ? 0 : 1;
                break;
            default:
                item.led_state = 1;
                break;
        }
        dispatch_control(item);
    } else {
        item.led_state = 1;
        switch(item.x) {
            case 0:
                //endpoint v1
                dispatch_endpoint(item);
                break;
            case 1:
                //endpoint v2
                dispatch_endpoint(item);
                break;
            case 2:
                //endpoint v3
                dispatch_endpoint(item);
                break;
            case 3:
                //endpoint v4
                dispatch_endpoint(item);
                break;
            case 4:
                //throttle v1
                dispatch_throttle(item);
                break;
            case 5:
                //throttle v2
                dispatch_throttle(item);
                break;
            case 6:
                //throttle v3
                dispatch_throttle(item);
                break;
            case 7:
                //throttle v4
                dispatch_throttle(item);
                break;
            case 8:
                //throttle kick
                dispatch_throttle(item);
                break;
            case 9:
                //level v1
                dispatch_level(item);
                break;
            case 10:
                //level v2
                dispatch_level(item);
                break;
            case 11:
                //level v3
                dispatch_level(item);
                break;
            case 12:
                //level v4
                dispatch_level(item);
                break;
            case 13:
                //level kick
                dispatch_level(item);
                break;
            case 14:
                break;
            default:
                break;
        }
    }
}

//clear the column
function clear_column(x) {
    Object.keys(monome_model).map(function(el,idx,arr){
        if(!(x === 15 && monome_model[el].y===7) && !(x === 15 && monome_model[el].y===0)) {
            var regexp = new RegExp('mn_col_'+x+"_");
            if(regexp.test(el)) {
                delete monome_model[el];
            }
        }
    });
}

//handle press events
function handle_press(x,y) {

    var item;

    if(!(x===15 && y === 7)&&!(x===15 && y === 0)) {
        clear_column(x);
    }

    if(monome_model['mn_col_'+x+'_row_'+y]) {
        item = monome_model['mn_col_'+x+'_row_'+y];
    } else {
        item = {
            "led_state":0,
            "x":x,
            "y":y
        };
        monome_model['mn_col_'+x+'_row_'+y] = item;
    }

    dispatch_event(monome_model['mn_col_'+x+'_row_'+y]);
    update_monome();
}

//update the monome view - sync leds w model
function update_monome() {

    //if a key is missing from the current model, then it
    //has been deleted and we want to turn the led off
    Object.keys(previous_monome_model).map(function(el,idx,arr){

        if(!monome_model[el]) {
            __.monome_led_off(previous_monome_model[el].x,previous_monome_model[el].y);
        }

    });

    //update the monome from the current model
    Object.keys(monome_model).map(function(el,idx,arr) {
        var item = monome_model[el];
        if(item.led_state) {
            __.monome_led_on(item.x, item.y);
        } else {
            __.monome_led_off(item.x, item.y);
        }
    });

    //save a copy of the model for later reference
    previous_monome_model = Object.assign({},monome_model);

}

function dispatch_control(item) {
    switch(item.y) {
        case 7:
            if(item.led_state) {
                __.loop("start");
                __("dac").volume(1).play();
            } else {
                __.loop("stop");
                __("dac").volume(0).stop();
            }
            break;
         case 0:
            if(item.led_state) {
                __.loop("stop");
            } else {
                __.loop("start");
            }  
        default:
            break;
    }
}

function dispatch_endpoint(item) {
    switch(item.x) {
        case 0:
            v1_length_staging = Math.max(chord.length-item.y,1);
            break;
        case 1:
            v2_length_staging = Math.max(chord.length-item.y,1);
            break;
        case 2:
            v3_length_staging = Math.max(chord.length-item.y,1);
            break;
        case 3:
            v4_length_staging = Math.max(chord.length-item.y,1);
            break;
    }
}


function dispatch_throttle(item) {
    if(item.y === 7) {
        ok_to_run[item.x-4]=false;
    } else {
        ok_to_run[item.x-4]=true;
        switch(item.x) {
            case 4:
                v1_throttle_staging = throttle_lookup[item.y] ? throttle_lookup[item.y] : v1_throttle_staging;
                break;
            case 5:
                v2_throttle_staging = throttle_lookup[item.y] ? throttle_lookup[item.y] : v2_throttle_staging;
                break;
            case 6:
                v3_throttle_staging = throttle_lookup[item.y] ? throttle_lookup[item.y] : v3_throttle_staging;
                break;
            case 7:
                v4_throttle_staging = throttle_lookup[item.y] ? throttle_lookup[item.y] : v4_throttle_staging;
                break;
            case 8:
                v5_throttle_staging = throttle_lookup[item.y] ? throttle_lookup[item.y] : v5_throttle_staging;
                break;    
        }
    }
}

function dispatch_level(item) {
    switch(item.x) {
        case 9:
            __(".level_1").volume((7-item.y)/7);
            break;
        case 10:
            __(".level_2").volume((7-item.y)/7);
            break;
        case 11:
            __(".level_3").volume((7-item.y)/7);
            break;
        case 12:
            __(".level_4").volume((7-item.y)/7);
            break; 
        case 13:
            __(".kick_level").volume((7-item.y)/7);
            break;   
    }
}


//general purpose button handler
__.monome_press(function(x,y,s) {
    if(s) {
        handle_press(x,y);
    }
});

function set_individual_values(x,y) {
    monome_model['mn_col_'+x+'_row_'+y] = {
        "led_state":1,
        "x":x,
        "y":y
    };
}

function clear_monome() {
    for(var i=0;i<16;i++) {
        for(var j=0;j<8;j++) {
            __.monome_led_off(i, j);
        }
    }
}

//reset the sucker
clear_monome();

//v1_length
set_individual_values(0,v1_length);
//v2_length
set_individual_values(1,v2_length);
//v3_length
set_individual_values(2,v3_length);
//v4_length
set_individual_values(3,v4_length);

//v1_throttle
set_individual_values(4,throttle_lookup.indexOf(v1_throttle));
//v2_throttle
set_individual_values(5,throttle_lookup.indexOf(v2_throttle));
//v3_throttle
set_individual_values(6,throttle_lookup.indexOf(v3_throttle));
//v4_throttle
set_individual_values(7,throttle_lookup.indexOf(v4_throttle));
//v5_throttle
set_individual_values(8,throttle_lookup.indexOf(v5_throttle));

//v1 level
set_individual_values(9,0);
//v2 level
set_individual_values(10,0);
//v3 level
set_individual_values(11,0);
//v4 level
set_individual_values(12,0);
//kick level
set_individual_values(13,0);


//update the leds
update_monome();
