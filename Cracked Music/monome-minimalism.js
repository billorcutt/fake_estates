//sounds
__().gain({id:"mixer"}).gain(1000).overdrive(3000).reverb({path:"Sounds/ir/hall.wav"}).dac();
__().sine({class:"group1"}).adsr({class:"group1"}).gain(1/3).panner(-1).connect("#mixer");
__().sine({class:"group2"}).adsr({class:"group2"}).gain(1/3).panner().connect("#mixer");
__().sine({class:"group3"}).adsr({class:"group3"}).gain(1/3).panner(1).connect("#mixer");

//variables
var len1 = 1, len2 = 1, len3 = 1;
var shift1 = 0, shift2 = 0, shift3 = 0;
var beat_divisor1 = 1, beat_divisor2 = 1, beat_divisor3 = 1, divisor_array = [1, 2, 3, 4, 5, 6, 7, 8];
var note_divisor = 1, note_divisors = {"_4":1,"_5":3/2,"_6":4}, note_divisor_display = {"_1":4,"_1.5":5,"_4":6};
var multiplier=0;
var playing = false;
var interval = 50;

//data
var master = __.fill_array(24,function(){
	return __.random_scale("major",3,4);
});
var clone1 = master.slice(0); //clone master
var clone2 = master.slice(0); //clone master

//configure loop w/ an interval
__.loop(interval);

//bind listeners
__(".group1").bind("step",function(index,data,array,count){
  if(count % (beat_divisor1) === 0) {
        var freq = __.array_next(master,shift1,len1);
        if(freq)
            __.frequency(freq).adsr("trigger",((interval*beat_divisor1)/note_divisor)/1000);
  }
},master);

__(".group2").bind("step",function(index,data,array,count){
    if(count % (beat_divisor2) === 0) {
        var freq = __.array_next(clone1,shift2,len2);
        if(freq)
            __.frequency(freq*4).adsr("trigger",((interval*beat_divisor2)/note_divisor)/1000);
    }
},clone1);

__(".group3").bind("step",function(index,data,array,count){
    if(count % (beat_divisor3) === 0) {
	    var freq = __.array_next(clone2,shift3,len3);
        if(freq)
            __.frequency(freq*2).adsr("trigger",((interval*beat_divisor3)/note_divisor)/1000);
    }
},clone2);

//monome below *************************************

//reset the display in the event any buttons are lit
__.monome_reset_display();

//general purpose button handler
__.monome_press(function(x,y,s){

    switch(x) {
        case 0:
            dispatch_control(x,y,s);
            break;
        case 1:
            if(y > 0 && y < 7) {
              	__.monome_led_set_column_range(x,1,6,0);
                __.monome_led_on(x,y);              
                len1=y+(multiplier*8);
            } else {
              	__.monome_set_led(x,y,s);
                if (s) shift1 = y===0 ? shift1+1 : shift1 - 1 >= 0 ? shift1-1 : 0;
            }
            break;
        case 2:
            if(y > 0 && y < 7) {
              	__.monome_led_set_column_range(x,1,6,0);
                __.monome_led_on(x,y);              
                len2=y+(multiplier*8);
            } else {
                __.monome_set_led(x,y,s);
                if (s) shift2 = y===0 ? shift2+1 : shift2 - 1 >= 0 ? shift2-1 : 0;             
            }
            break;
        case 3:
            if(y > 0 && y < 7) {
              	__.monome_led_set_column_range(x,1,6,0);
                __.monome_led_on(x,y);              
                len3=y+(multiplier*8);
            } else {
                __.monome_set_led(x,y,s);
                if (s) shift3 = y===0 ? shift3+1 : shift3 - 1 >= 0 ? shift3-1 : 0;
            }
            break;
        case 4:
        	__.monome_led_off(x,divisor_array.indexOf(beat_divisor1));
            __.monome_led_on(x,y);
            beat_divisor1 = divisor_array[y];
            break;
        case 5:
        	__.monome_led_off(x,divisor_array.indexOf(beat_divisor2));
            __.monome_led_on(x,y);
            beat_divisor2 = divisor_array[y];
            break;
        case 6:
        	__.monome_led_off(x,divisor_array.indexOf(beat_divisor3));
            __.monome_led_on(x,y);
            beat_divisor3 = divisor_array[y];
            break;
        default:
            break;
    }

});

//handle button presses on the control strip, first column
function dispatch_control(x,y,s) {

	switch(y) {
      case 0:
          __.monome_set_led(x,y,s);
          if(s) {
              reset_sequence_count();
          }
        break;
        case 4:
            __.monome_led_off(x,4);
            __.monome_led_off(x,5);
            __.monome_led_off(x,6);        
            __.monome_led_on(x,y);
            note_divisor = note_divisors["_"+y];
            break;
        case 5:
            __.monome_led_off(x,4);
            __.monome_led_off(x,5);
            __.monome_led_off(x,6); 
            __.monome_led_on(x,y);
            note_divisor = note_divisors["_"+y];
            break;
        case 6:
            __.monome_led_off(x,4);
            __.monome_led_off(x,5);
            __.monome_led_off(x,6); 
            __.monome_led_on(x,y);
            note_divisor = note_divisors["_"+y];
            break;
      case 7:
        start_or_stop(x,y,s);
        break;
      default:
        __.monome_set_led(x,y,s);
        if(!s) {
			multiplier=0;
        } else {
        	multiplier= y > 0 && y < 4 && s ? y-1 : 0;          
        }  
          
        break;
    }   
  
  //start it up
  function start_or_stop(x,y,s) {
    if(!playing && s) {
      
        playing=true;
        __.loop("start").play();
        __.monome_led_on(0,7);
      
        __.monome_led_on(0,note_divisor_display["_"+note_divisor]);      
      
        __.monome_led_on(1,len1);
        __.monome_led_on(2,len2);
        __.monome_led_on(3,len3);
      
        __.monome_led_on(4,divisor_array.indexOf(beat_divisor1));
        __.monome_led_on(5,divisor_array.indexOf(beat_divisor2));
        __.monome_led_on(6,divisor_array.indexOf(beat_divisor3));      
      

    } else if(s) {
        playing=false;
        __.loop("stop").stop();
		__.monome_reset_display();
    }  
  }
}

//reset the sequence
function reset_sequence_count() {
  	shift1 = 0;
  	shift2 = 0;
  	shift3 = 0;
    reset_array_index(master);
    reset_array_index(clone1);
    reset_array_index(clone2);

    function reset_array_index(arr) {
        arr.current_index = 0;
    }
}

//monome above *************************************

/*
    //monome button layout
    
    reset index - [0,0] (press to reset array index to zero)
    array length multiplier - [0,[1-3]] (modifier button, hold down while selecting array length)
    note length divisor - [0,[4-6]]
    start/stop - [0,7] (press to start, press again to stop)
    array length - [1,[1-6]] [2,[1-6]] [3,[1-6]] (press to select)
    array shift increment – [1,0],[2,0],[3,0] (press to increment)
    array shift decrement – [1,7],[2,7],[3,7] (press to decrement)
    count divisor - [4,[0-7]] [5,[0-7]] [6,[0-7]]  (press to select, values : [1, 2, 3, 4, 5, 7, 8, 11])

*/


