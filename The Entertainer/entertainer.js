
var sampler_levelA = 0;
var sampler_levelB = 0;
var sampler_levelC = 0;
var sampler_levelD = 0;

var snd_arr = __.ls(<PATH-TO-WAV-FILES>);

__().compressor().overdrive(1/10).out();

snd_arr.forEach((item,idx) => {
  if(item.indexOf(".wav")!=-1) {
	__().sampler({path:item,id:"s-"+idx+"-a"}).gain({id:"level_A"+idx,gain:sampler_levelA}).panner(1).connect("compressor");
  	__().sampler({path:item,id:"s-"+idx+"-b"}).gain({id:"level_B"+idx,gain:sampler_levelB}).panner(-1).connect("compressor");
  	__().sampler({path:item,id:"s-"+idx+"-c"}).gain({id:"level_C"+idx,gain:sampler_levelC}).panner(0.75).connect("compressor");
 	__().sampler({path:item,id:"s-"+idx+"-d"}).gain({id:"level_D"+idx,gain:sampler_levelD}).panner(-0.75).connect("compressor");    
  }  
});

var throttle1_length = 3;
var throttle2_length = 3;
var throttle3_length = 2;
var throttle4_length = 4;

var throttle1=__.throttle_factory(throttle1_length);
var throttle2=__.throttle_factory(throttle2_length);
var throttle3=__.throttle_factory(throttle3_length);
var throttle4=__.throttle_factory(throttle4_length);

var fileA = 2;
var fileB = 2;
var fileC = 2;
var fileD = 2;

var interval = 200;

__.loop(interval,function(){

    if(throttle1()) {
        __("#s-"+fileA+"-a").stop().start();
        __("#level_A"+fileA).volume(sampler_levelA);
    }
  
  	if(throttle2()) {
        __("#s-"+fileB+"-b").stop().start();
        __("#level_B"+fileB).volume(sampler_levelB);
    }

  	if(throttle3()) {
        __("#s-"+fileC+"-c").stop().start();
        __("#level_C"+fileC).volume(sampler_levelC);
    }
  
  	if(throttle4()) {
        __("#s-"+fileD+"-d").stop().start();
        __("#level_D"+fileD).volume(sampler_levelD);        
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
                //throttle v1
                dispatch_throttle(item);
                break;
            case 1:
                //throttle v2
                dispatch_throttle(item);
                break;
            case 2:
                //throttle v3
                dispatch_throttle(item);
                break;
            case 3:
                //throttle v4
                dispatch_throttle(item);
                break;
            case 4:
	            //level v1
	            dispatch_level(item);
                break;
            case 5:
	            //level v2
	            dispatch_level(item);
                break;
            case 6:
	            //level v3
	            dispatch_level(item);
                break;
            case 7:
	            //level v4
	            dispatch_level(item);
                break;
            case 8:
                //file A
                dispatch_file(item);
                break;
            case 9:
                //file A
                dispatch_file(item);    
                break;
            case 10:
                //file B
                dispatch_file(item); 
                break;
            case 11:
                //file C
                dispatch_file(item);             
                break;
            case 12:
                //nothing
                break;
            case 13:
                //nothing
                break;
            case 14:
                //tempo
                dispatch_tempo(item);
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
            } else {
                __.loop("stop");
                __("dac").volume(0).stop();
            }
            break; 
        default:
            break;
    }
}

function dispatch_file(item) {
    switch(item.x) {
        case 8:
        	__("#s-"+fileA+"-a").stop();
            fileA=item.y+1;
            break;
        case 9:
			__("#s-"+fileB+"-a").stop();
            fileB=item.y+1;
            break;
        case 10:
			__("#s-"+fileC+"-a").stop();
            fileC=item.y+1;
            break;
        case 11:
        	__("#s-"+fileD+"-a").stop();        
            fileD=item.y+1;
            break; 
    }
  console.log(fileA);
}

function dispatch_tempo(item) {
  	interval = (item.y+1)*100;
    __.loop(interval);
}

function dispatch_throttle(item) {
    switch(item.x) {
        case 0:
            throttle1=__.throttle_factory(item.y+1);
            break;
        case 1:
            throttle2=__.throttle_factory(item.y+1);
            break;
        case 2:
            throttle3=__.throttle_factory(item.y+1);
            break;
        case 3:
            throttle4=__.throttle_factory(item.y+1);
            break; 
    }
}

function dispatch_level(item) {
    switch(item.x) {
        case 4:
        	sampler_levelA=(7-item.y)/7;
            __(".level_1").volume(sampler_levelA);
            break;
        case 5:
            sampler_levelB=(7-item.y)/7;
            __(".level_2").volume(sampler_levelB);
            break;
        case 6:
            sampler_levelC=(7-item.y)/7;
            __(".level_3").volume(sampler_levelC);
            break;
        case 7:
            sampler_levelD=(7-item.y)/7;
            __(".level_4").volume(sampler_levelD);
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

//v1_throttle
set_individual_values(0,throttle1_length);
//v2_throttle
set_individual_values(1,throttle2_length);
//v3_throttle
set_individual_values(2,throttle3_length);
//v4_throttle
set_individual_values(3,throttle4_length);

//v1_level
set_individual_values(4,7 - (sampler_levelA*7));
//v2_level
set_individual_values(5,7 - (sampler_levelB*7));
//v3_level
set_individual_values(6,7 - (sampler_levelC*7));
//v4_level
set_individual_values(7,7 - (sampler_levelD*7));

//v1_file
set_individual_values(8,fileA-1);
//v2_file
set_individual_values(9,fileB-1);
//v3_file
set_individual_values(10,fileC-1);
//v4_file
set_individual_values(11,fileD-1);

//tempo level
set_individual_values(14,interval/100-1);

//update the leds
update_monome();
