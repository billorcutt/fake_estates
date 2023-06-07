//adding this override to address the callback when limit is one.
cracked.array_next = function(arr,offset,limit,callback) {
    offset = offset || 0;
    limit = limit===0 ? 1 : !limit ? arr.length : limit;
    var adjusted_limit = Math.min(limit,arr.length);
    var adjusted_offset = Math.min(offset,adjusted_limit-1);
    var old_index = arr.current_index = __.ifUndef(arr.current_index,-1);
    arr.current_index = (arr.current_index+1+adjusted_offset) >= adjusted_limit ? 0 : arr.current_index+1;
    if((old_index >= arr.current_index) && (typeof callback === "function")) {
        callback();
    }
    return arr[arr.current_index + adjusted_offset];
};

//////////////////////////////////////////

//set up some variables

let staging_limit_left16    = 0;
let staging_limit_right16   = 0; 

let staging_limit_left8     = 0;
let staging_limit_right8    = 0;

let staging_limit_left4     = 0;
let staging_limit_right4    = 0;

let staging_limit_left2     = 0;
let staging_limit_right2    = 0;

let staging_limit_left1     = 0;
let staging_limit_right1    = 0;

let staging_limit_left_third1     = 0;
let staging_limit_right_third1    = 0;

let staging_limit_left_third16    = 0;
let staging_limit_right_third16   = 0;

//--------------

let limit_left16            = 0;
let limit_right16           = 0; 

let limit_left8             = 0;
let limit_right8            = 0; 

let limit_left4             = 0;
let limit_right4            = 0;

let limit_left2             = 0;
let limit_right2            = 0;

let limit_left1             = 0;
let limit_right1            = 0;

let limit_left_third1       = 0;
let limit_right_third1      = 0; 

let limit_left_third16      = 0;
let limit_right_third16     = 0;

//throttle defaults
window.throttle_eighth_limit    = 2;
window.throttle_quarter_limit   = 4;
window.throttle_half_limit      = 8;
window.throttle_whole_limit     = 16;

window.tempo            = 250;

//no op
function noop(){return true};

//throttles for samples and sines
let throttle_eighth     = noop;
let throttle_quarter    = noop;
let throttle_half       = noop;
let throttle_whole      = noop;

//load the sounds

let sample_root = "/Users/billorcutt/Desktop/FAKE-017/";

let snd_arr_16th = __.ls(sample_root+"sixteenth");

let snd_arr_8th = __.ls(sample_root+"eighth");

let snd_arr_4th = __.ls(sample_root+"quarter");

let snd_arr_2nd = __.ls(sample_root+"half");

let snd_arr_1st = __.ls(sample_root+"whole");

let snd_arr_third_1st = __.ls(sample_root+"third/whole");

let snd_arr_third_16th = __.ls(sample_root+"third/sixteenth");

//filter & sort the sound file array
snd_arr_16th = snd_arr_16th.filter(e => e.indexOf('wav') !== -1).sort((a, b) => {
  const regex = /\d+/g;
  return a.match(regex)[0] - b.match(regex)[0];
})

snd_arr_8th = snd_arr_8th.filter(e => e.indexOf('wav') !== -1).sort((a, b) => {
  const regex = /\d+/g;
  return a.match(regex)[0] - b.match(regex)[0];
})

snd_arr_4th = snd_arr_4th.filter(e => e.indexOf('wav') !== -1).sort((a, b) => {
  const regex = /\d+/g;
  return a.match(regex)[0] - b.match(regex)[0];
})

snd_arr_2nd = snd_arr_2nd.filter(e => e.indexOf('wav') !== -1).sort((a, b) => {
  const regex = /\d+/g;
  return a.match(regex)[0] - b.match(regex)[0];
})

snd_arr_1st = snd_arr_1st.filter(e => e.indexOf('wav') !== -1).sort((a, b) => {
  const regex = /\d+/g;
  return a.match(regex)[0] - b.match(regex)[0];
})

snd_arr_third_1st = snd_arr_third_1st.filter(e => e.indexOf('wav') !== -1).sort((a, b) => {
  const regex = /\d+/g;
  return a.match(regex)[0] - b.match(regex)[0];
})

snd_arr_third_16th = snd_arr_third_16th.filter(e => e.indexOf('wav') !== -1).sort((a, b) => {
  const regex = /\d+/g;
  return a.match(regex)[0] - b.match(regex)[0];
})

//update throttles
function makeThrottles() {
    throttle_eighth     = __.throttle_factory(throttle_eighth_limit);
    throttle_quarter    = __.throttle_factory(throttle_quarter_limit);
    throttle_half       = __.throttle_factory(throttle_half_limit);
    throttle_whole      = __.throttle_factory(throttle_whole_limit);
}

//create the samplers
snd_arr_16th.forEach((item,idx) => {
  if(item.indexOf(".wav")!=-1) {
    __().sampler({id:"left16"+(idx+1),path:item}).gain(1/14).panner(-1).out();
    __().sampler({id:"right16"+(idx+1),path:item}).gain(1/14).panner(1).out();     
  }  
});

//create the samplers
snd_arr_8th.forEach((item,idx) => {
  if(item.indexOf(".wav")!=-1) {
    __().sampler({id:"left8"+(idx+1),path:item}).gain(1/14).panner(-1).out();
    __().sampler({id:"right8"+(idx+1),path:item}).gain(1/14).panner(1).out();     
  }  
});

//create the samplers
snd_arr_4th.forEach((item,idx) => {
  if(item.indexOf(".wav")!=-1) {
    __().sampler({id:"left4"+(idx+1),path:item}).gain(1/14).panner(-1).out();
    __().sampler({id:"right4"+(idx+1),path:item}).gain(1/14).panner(1).out();     
  }  
});

//create the samplers
snd_arr_2nd.forEach((item,idx) => {
  if(item.indexOf(".wav")!=-1) {
    __().sampler({id:"left2"+(idx+1),path:item}).gain(1/14).panner(-1).out();
    __().sampler({id:"right2"+(idx+1),path:item}).gain(1/14).panner(1).out();     
  }  
});

//create the samplers
snd_arr_1st.forEach((item,idx) => {
  if(item.indexOf(".wav")!=-1) {
    __().sampler({id:"left1"+(idx+1),path:item}).gain(1/14).panner(-1).out();
    __().sampler({id:"right1"+(idx+1),path:item}).gain(1/14).panner(1).out();     
  }  
});

//create the samplers
snd_arr_third_1st.forEach((item,idx) => {
  if(item.indexOf(".wav")!=-1) {
    __().sampler({id:"left_third1"+(idx+1),path:item}).gain(1/14).panner(-1).out();
    __().sampler({id:"right_third1"+(idx+1),path:item}).gain(1/14).panner(1).out();     
  }  
});

snd_arr_third_16th.forEach((item,idx) => {
  if(item.indexOf(".wav")!=-1) {
    __().sampler({id:"left_third16"+(idx+1),path:item}).gain(1/14).panner(-1).out();
    __().sampler({id:"right_third16"+(idx+1),path:item}).gain(1/14).panner(1).out();     
  }  
});

//build the sequence 16
let seq_left16 = __.fill_array(6,idx => idx+1);
let seq_right16 = __.fill_array(6,idx => idx+1);

//build the sequence 8
let seq_left8 = __.fill_array(6,idx => idx+1);
let seq_right8 = __.fill_array(6,idx => idx+1);

//build the sequence 4
let seq_left4 = __.fill_array(6,idx => idx+1);
let seq_right4 = __.fill_array(6,idx => idx+1);

//build the sequence 2
let seq_left2 = __.fill_array(6,idx => idx+1);
let seq_right2 = __.fill_array(6,idx => idx+1);

//build the sequence 1
let seq_left1 = __.fill_array(6,idx => idx+1);
let seq_right1 = __.fill_array(6,idx => idx+1);

//build the sequence 1
let seq_left_third1 = __.fill_array(6,idx => idx+1);
let seq_right_third1 = __.fill_array(6,idx => idx+1);

let seq_left_third16 = __.fill_array(6,idx => idx+1);
let seq_right_third16 = __.fill_array(6,idx => idx+1);


//doing it
__.loop(tempo,function(){

    //16th notes
    let idx16L = __.array_next(seq_left16,0,limit_left16);
    let idx16R = __.array_next(seq_right16,0,limit_right16);

    let idx16thirdL = __.array_next(seq_left_third16,0,limit_left_third16);
    let idx16thirdR = __.array_next(seq_right_third16,0,limit_right_third16);

    if(limit_left_third16) __("#left_third16"+idx16thirdL).stop().start();
    if(limit_right_third16) __("#right_third16"+idx16thirdR).stop().start();

    if(limit_left16) __("#left16"+idx16L).stop().start();
    if(limit_right16) __("#right16"+idx16R).stop().start();

    if(idx16thirdL === 1 && idx16thirdR === 1 && idx16L === 1 && idx16R === 1) {
        limit_left_third16 = staging_limit_left_third16;
        limit_right_third16 = staging_limit_right_third16;
        limit_left16 = staging_limit_left16;
        limit_right16 = staging_limit_right16;
    }

    //8th notes
    if(throttle_eighth()) {

        let idx8L = __.array_next(seq_left8,0,limit_left8);
        let idx8R = __.array_next(seq_right8,0,limit_right8);

        if(idx8L === idx8R) {
            limit_left8 = staging_limit_left8;
            limit_right8 = staging_limit_right8;
        }

        if(staging_limit_left8) __("#left8"+idx8L).stop().start();
        if(staging_limit_right8) __("#right8"+idx8R).stop().start();

    }

    //quarter notes
    if(throttle_quarter()) {

        let idx4L = __.array_next(seq_left4,0,limit_left4);
        let idx4R = __.array_next(seq_right4,0,limit_right4);
  

        if(idx4L === idx4R) {
            limit_left4 = staging_limit_left4;
            limit_right4 = staging_limit_right4;
        }

        if(staging_limit_left4) __("#left4"+idx4L).stop().start();
        if(staging_limit_right4) __("#right4"+idx4R).stop().start();

    }

    //half notes
    if(throttle_half()) {

        let idx2L = __.array_next(seq_left2,0,limit_left2);
        let idx2R = __.array_next(seq_right2,0,limit_right2);
  

        if(idx2L === idx2R) {
            limit_left2 = staging_limit_left2;
            limit_right2 = staging_limit_right2;
        }

        if(staging_limit_left2) __("#left2"+idx2L).stop().start();
        if(staging_limit_right2) __("#right2"+idx2R).stop().start();

    }


    //whole notes
    if(throttle_whole()) {

        let idx1L = __.array_next(seq_left1,0,limit_left1);
        let idx1R = __.array_next(seq_right1,0,limit_right1);

        let idx1thirdL = __.array_next(seq_left_third1,0,limit_left_third1);
        let idx1thirdR = __.array_next(seq_right_third1,0,limit_right_third1);
      
        console.log(idx1L,idx1R,idx1thirdL,idx1thirdR);

        if(idx1L === idx1R && idx1thirdL === idx1thirdR) {
            limit_left1 = staging_limit_left1;
            limit_right1 = staging_limit_right1;
            limit_left_third1 = staging_limit_left_third1;
            limit_right_third1 = staging_limit_right_third1;
        }
      
        if(limit_left1) __("#left1"+idx1L).stop().start();
        if(limit_right1) __("#right1"+idx1R).stop().start();

        if(limit_left_third1) __("#left_third1"+idx1thirdL).stop().start();
        if(limit_right_third1) __("#right_third1"+idx1thirdR).stop().start();

    }


});

makeThrottles();

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
                dispatch_endpoint(item);
                break;
            case 5:
                //throttle v2
                dispatch_endpoint(item);
                break;
            case 6:
                //throttle v3
                dispatch_endpoint(item);
                break;
            case 7:
                //throttle v4
                dispatch_endpoint(item);
                break;
            case 8:
                //throttle kick
                dispatch_endpoint(item);
                break;
            case 9:
                //level v1
                dispatch_endpoint(item);
                break;
            case 10:
                //level v2
                dispatch_endpoint(item);
                break;
            case 11:
                //level v3
                dispatch_endpoint(item);
                break;
            case 12:
                //level v4
                dispatch_endpoint(item);
                break;
            case 13:
                //level kick
                dispatch_endpoint(item);
                break;
            case 14:
                dispatch_endpoint(item);
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
              //__("dac").volume(0).stop();
                __.loop("start");
                //__("dac").volume(1).play();
            } else {
                __.loop("stop");
                __("dac").volume(0).stop();
            }
            break;
         /*case 0:
            if(item.led_state) {
                __.loop("stop");
            } else {
                __.loop("start");
            } */ 
        default:
            break;
    }
}

function dispatch_endpoint(item) {
    switch(item.x) {
        case 0:
            staging_limit_left16 = 7-item.y;
            break;
        case 1:
            staging_limit_right16 = 7-item.y;
            break;
        case 2:
            staging_limit_left_third16 = 7-item.y;
            break;
        case 3:
            staging_limit_right_third16 = 7-item.y;
            break;
        case 4:
            staging_limit_left8 = 7-item.y;
            break;
        case 5:
            staging_limit_right8 = 7-item.y;
            break;
        case 6:
            staging_limit_left4 = 7-item.y;
            break;
        case 7:
            staging_limit_right4 = 7-item.y;
            break;
        case 8:
            staging_limit_left2 = 7-item.y;
            break;
        case 9:
            staging_limit_right2 = 7-item.y;
            break;
        case 10:
            staging_limit_left1 = 7-item.y;
            break;
        case 11:
            staging_limit_right1 = 7-item.y;
            break;
        case 12:
            staging_limit_left_third1 = 7-item.y;
            break;
        case 13:
            staging_limit_right_third1 = 7-item.y;
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
set_individual_values(0,7-limit_left16);
//v2_length
set_individual_values(1,7-limit_right16);

set_individual_values(2,7-limit_left_third16);
//v4_length
set_individual_values(3,7-limit_right_third16);

//v3_length
set_individual_values(4,7-limit_left8);
//v4_length
set_individual_values(5,7-limit_right8);
//v3_length
set_individual_values(6,7-limit_left4);
//v4_length
set_individual_values(7,7-limit_right4);
//v3_length
set_individual_values(8,7-limit_left2);
//v4_length
set_individual_values(9,7-limit_right2);
//v3_length
set_individual_values(10,7-limit_left1);
//v4_length
set_individual_values(11,7-limit_right1);

set_individual_values(12,7-limit_left_third1);
//v4_length
set_individual_values(13,7-limit_right_third1);

//update the leds
update_monome();











