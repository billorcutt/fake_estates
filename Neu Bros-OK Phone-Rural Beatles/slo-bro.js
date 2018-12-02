//LATEST LATEST LATEST THING Neu Bros/OK Phone/Rural Beatles

/*
 length min/max |
 offset min/max |
 length2 min/max |
 offset2 min/max |
 delay | delay2 |
 env min/max |
 env2 min/max |
 mix |
 control
 */

__().sine({id:"s1"}).gain({id:"g1"}).panner(1).dac(0);
__().sine({id:"s2"}).gain({id:"g2"}).panner(-1).dac(0);
__().sine({id:"s3"}).gain({id:"g3",gain:1/2}).adsr({id:"a3"}).delay({
    id:"d3",
    damping:1,
    cutoff:8000,
    feedback:0,
    delay:0
}).panner(1).dac(0);

__().sine({id:"s4"}).gain({id:"g4",gain:1/2}).adsr({id:"a4"}).delay({
    id:"d4",
    damping:1,
    cutoff:8000,
    feedback:0,
    delay:0
}).panner(-1).dac(0);

__().sine({id:"s1_2"}).connect("#g1");
__().sine({id:"s2_2"}).connect("#g2");
__().sine({id:"s3_2"}).connect("#g3");
__().sine({id:"s4_2"}).connect("#g4");

__().sine({id:"s1_3"}).connect("#g1");
__().sine({id:"s2_3"}).connect("#g2");
__().sine({id:"s3_3"}).connect("#g3");
__().sine({id:"s4_3"}).connect("#g4");


let env_test_func = () => true;
let env_test_func2 = () => true;

var major = __.scales("major");

//make octave 7 for other section
var sequence = __.fill_array(48,function(idx) {
    let add_to_octave = Math.floor(idx/7);
    let pitch = __.array_next(major) + (7+add_to_octave) * 12;
    return {
        freq:__.pitch2freq(pitch),
        pitch:pitch
    };
});

var sequence2 = sequence.slice();

var endpoint = 2;
var endpoint2 = 3;
var offset = 0;
var offset2 = 0;
var tempo = 420;

var endpoint_max = 3;
var endpoint_min = 3;

var endpoint2_max = 3;
var endpoint2_min = 3;

var offset_max = 0;
var offset_min = 0;

var offset2_max = 0;
var offset2_min = 0;

var env_max = 6;
var env_min = 3;
var env_max_array = [0.5,1,2,3,4,5,6,7];
var env_min_array = [8,7,6,5,4,3,2,1];

var env2_max = 7;
var env2_min = 4;

var tempo_max = 420;
var tempo_min = 420;
var tempo_min_array = [420,215,210,195,190,185,180];

var env_delay = 0;
var env_delay2 = 0;
var env_delay_array = [0,tempo*1/8,tempo*3/16,tempo*1/4,tempo*5/16,tempo*6/16,tempo*7/16,tempo*1/2];

var voice_interval_1 = -37;
var voice_interval_2 = -25;


__.loop(tempo,function(f) {

    var freq = __.array_next(sequence,offset,endpoint,function() {
        endpoint = __.random(endpoint_min,endpoint_max);
        offset = __.random(offset_min,offset_max);
        tempo = __.random(tempo_min,tempo_max);
        __.loop(tempo);
    });

    __("#s1").frequency(freq.freq);
    __("#s1_2").frequency(__.pitch2freq(freq.pitch+voice_interval_1));
    __("#s1_3").frequency(__.pitch2freq(freq.pitch+voice_interval_2));

    if(env_test_func()) {
        __("#s3").frequency(__.pitch2freq(freq.pitch));
        __("#s3_2").frequency(__.pitch2freq(freq.pitch+voice_interval_1));
        __("#s3_3").frequency(__.pitch2freq(freq.pitch+voice_interval_2));
        var env_len = __.random(tempo/env_min_array[env_min],tempo*env_max_array[env_max]);
        var throttle_size = Math.ceil((env_len+env_delay_array[env_delay])/tempo);
        env_test_func = __.throttle_factory(throttle_size);
        __("#d3").time(__.ms2sec(env_delay_array[env_delay]));
        __("#a3").adsr("trigger",(env_len-(env_len * 0.10))/1000);
    }

    var freq2 = __.array_next(sequence2,offset2,endpoint2,function() {
        endpoint2 = __.random(endpoint2_min,endpoint2_max);
        offset2 = __.random(offset2_min,offset2_max);
    });

    __("#s2").frequency(freq2.freq);
    __("#s2_2").frequency(__.pitch2freq(freq2.pitch+voice_interval_1));
    __("#s2_3").frequency(__.pitch2freq(freq2.pitch+voice_interval_2));

    if(env_test_func2()) {
        __("#s4").frequency(__.pitch2freq(freq2.pitch));
        __("#s4_2").frequency(__.pitch2freq(freq2.pitch+voice_interval_1));
        __("#s4_3").frequency(__.pitch2freq(freq2.pitch+voice_interval_2));
        var env_len2 = __.random(tempo/env_min_array[env2_min],tempo*env_max_array[env2_max]);
        var throttle_size2 = Math.ceil((env_len2+env_delay_array[env_delay2])/tempo);
        env_test_func2 = __.throttle_factory(throttle_size2);
        __("#d4").time(__.ms2sec(env_delay_array[env_delay2]));
        __("#a4").adsr("trigger",(env_len2-(env_len2 * 0.10))/1000);
    }

});

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
            default:
                item.led_state = 1;
                break;
        }
        dispatch_control(item);
    } else {
        item.led_state = 1;
        switch(item.x) {
            case 0:
                //endpoint min
                dispatch_endpoint(item);
                break;
            case 1:
                //endpoint max
                dispatch_endpoint(item);
                break;
            case 2:
                //offset min
                dispatch_offset(item);
                break;
            case 3:
                //offset max
                dispatch_offset(item);
                break;
            case 4:
                //endpoint 2 min
                dispatch_endpoint(item);
                break;
            case 5:
                //endpoint 2 max
                dispatch_endpoint(item);
                break;
            case 6:
                //offset 2 min
                dispatch_offset(item);
                break;
            case 7:
                //offset 2 max
                dispatch_offset(item);
                break;
            case 8:
                //env pitch
                dispatch_envelope_delay(item);
                break;
            case 9:
                //env pitch 2
                dispatch_envelope_delay(item);
                break;
            case 10:
                //env min
                dispatch_env(item);
                break;
            case 11:
                //env max
                dispatch_env(item);
                break;
            case 12:
                //env 2 min
                dispatch_env(item);
                break;
            case 13:
                //env 2 max
                dispatch_env(item);
                break;
            case 14:
                //dispatch preset
                dispatch_preset(item);
                break;
            default:
                break;
        }
    }
}

//clear the column
function clear_column(x) {
    Object.keys(monome_model).map(function(el,idx,arr){
        if(!(x === 15 && monome_model[el].y===7)) {
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

    if(!(x===15 && y === 7)) {
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
                __("dac").volume(0.5).play();
            } else {
                __.loop("stop");
                __("dac").volume(0).stop();
            }
            break;
        default:
            tempo_min = tempo_min_array[item.y] || 420;
            break;
    }
}

function dispatch_endpoint(item) {
    switch(item.x) {
        case 0:
            endpoint_min = item.y+2;
            break;
        case 1:
            endpoint_max = item.y+2;
            break;
        case 4:
            endpoint2_min = item.y+2;
            break;
        case 5:
            endpoint2_max = item.y+2;
            break;
    }
}

function dispatch_offset(item) {
    switch(item.x) {
        case 2:
            offset_min = item.y;
            break;
        case 3:
            offset_max = item.y;
            break;
        case 6:
            offset2_min = item.y;
            break;
        case 7:
            offset2_max = item.y;
            break;
    }
}

function dispatch_env(item) {
    switch(item.x) {
        case 10:
            env_min = item.y;
            break;
        case 11:
            env_max = item.y;
            break;
        case 12:
            env2_min = item.y;
            break;
        case 13:
            env2_max = item.y;
            break;
    }
}

function dispatch_envelope_delay(item) {
    switch(item.x) {
        case 8:
            env_delay = item.y;
            break;
        case 9:
            env_delay2 = item.y;
            break;
    }
}


//1, .707, .5, .35, .25, .18, .09, .045. 0
function dispatch_preset(item) {
    switch(item.y) {
        case 0:
            __("#g1,#g2").ramp(0,__.ms2sec(10),"gain");
            //__("#g3,#g4").volume(1/2);
            break;
        case 1:
            //__("#g1,#g2").volume(0.045/4);
            __("#g1,#g2").ramp(0.045/10,__.ms2sec(10),"gain");
            //__("#g3,#g4").volume(1/2-1/128);
            break;
        case 2:
            //__("#g1,#g2").volume(0.09/4);
            __("#g1,#g2").ramp(0.09/10,__.ms2sec(10),"gain");
            //__("#g3,#g4").volume(1/2-1/64);
            break;
        case 3:
            //__("#g1,#g2").volume(0.18/4);
            __("#g1,#g2").ramp(0.18/10,__.ms2sec(10),"gain");
            //__("#g3,#g4").volume(1/2-1/32);
            break;
        case 4:
            //__("#g1,#g2").volume(0.25/4);
            __("#g1,#g2").ramp(0.25/10,__.ms2sec(10),"gain");
            //__("#g3,#g4").volume(1/2-1/16);
            break;
        case 5:
            //__("#g1,#g2").volume(0.35/4);
            __("#g1,#g2").ramp(0.35/10,__.ms2sec(10),"gain");
            //__("#g3,#g4").volume(1/2-1/8-1/32);
            break;
        case 6:
            //__("#g1,#g2").volume(0.707/4);
            __("#g1,#g2").ramp(0.707/10,__.ms2sec(10),"gain");
            //__("#g3,#g4").volume(1/2-1/8-1/32);
            break;
        case 7:
            //__("#g1,#g2").volume(1/4);
            __("#g1,#g2").ramp(1/10,__.ms2sec(10),"gain");
            //__("#g3,#g4").volume(1/2-1/8-1/32);
            break;
        default:
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

//endpoint min
set_individual_values(0,endpoint_min-2);
//endpoint max
set_individual_values(1,endpoint_max-2);
//offset min
set_individual_values(2,offset_min);
//offset max
set_individual_values(3,offset_max);
//endpoint 2 min
set_individual_values(4,endpoint2_min-2);
//endpoint 2 max
set_individual_values(5,endpoint2_max-2);
//offset 2 min
set_individual_values(6,offset2_min);
//offset 2 max
set_individual_values(7,offset2_max);
//env_delay
set_individual_values(8,env_delay);
//env_delay 2
set_individual_values(9,env_delay2);
//env min
set_individual_values(10,env_min);
//env max
set_individual_values(11,env_max);
//env 2 min
set_individual_values(12,env2_min);
//env 2 max
set_individual_values(13,env2_max);
//initial preset
set_individual_values(14,6);
dispatch_preset({y:6});
//tempo min = 120
set_individual_values(15,0);

//update the leds
update_monome();
