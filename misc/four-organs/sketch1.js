//chord thing

__().sampler({path:"./Korg-N1R-Maracas.wav"}).panner(1).dac().play();
__().sampler({path:"./Korg-N1R-Maracas.wav"}).panner(-1).dac().play();
__().polysynth({id:"ps1"}).gain(1/4).panner(1).dac().play();
__().polysynth({id:"ps2"}).gain(1/4).panner(1/2).dac().play();
__().polysynth({id:"ps3"}).gain(1/4).panner(-1/2).dac().play();
__().polysynth({id:"ps4"}).gain(1/4).panner(-1).dac().play();

var chord = __.chords("thirteenth");
var chord2 = __.chords("eleventh");
var chord3 = __.chords("ninth");
var chord4 = __.chords("seventh");

var sq_array1 = [2,8,7];
var sq_array2 = [4,10,5];
var sq_array3 = [3,12,4];
var sq_array4 = [1,10,6];

var sequence_factory = function  (arr,fn) {
        var count = 0;
	var current_index = 0;
        var arr_copy = arr.slice();
	var current_value = arr_copy[current_index];
	var transition = true;
	var first_run = true;
        return function() {
		if(count===current_value) {
			if(current_index===arr_copy.length-1) {
				current_index = 0;
			} else {
				current_index++;
			}
			count = 1;
			transition=true;
			current_value = arr_copy[current_index];
		} else {
			count++;
			transition=first_run||false;
		}
		fn(transition,current_index);
		first_run=false;
        };
    };


var organ1 = sequence_factory(sq_array1,function(b,c){
    if(b && c==1) {
      chord.map(x => {
        __("#ps1").polysynth("noteOn",x+60);
      });
    }  else if(b && c==2){
      chord.map(x => {
        __("#ps1").polysynth("noteOff",x+60);
      });
    }
});

var organ2 = sequence_factory(sq_array2,function(b,c){
    if(b && c==1) {
      chord2.map(x => {
        __("#ps2").polysynth("noteOn",x+72);
      });
    }  else if(b && c==2){
      chord2.map(x => {
        __("#ps2").polysynth("noteOff",x+72);
      });
    }
});

var organ3 = sequence_factory(sq_array3,function(b,c){
    if(b && c==1) {
      chord3.map(x => {
        __("#ps3").polysynth("noteOn",x+60);
      });
    }  else if(b && c==2){
      chord.map(x => {
        __("#ps3").polysynth("noteOff",x+60);
      });
    }
});

var organ4 = sequence_factory(sq_array4,function(b,c){
    if(b && c==1) {
      chord4.map(x => {
        __("#ps4").polysynth("noteOn",x+48);
      });
    }  else if(b && c==2){
      chord2.map(x => {
        __("#ps4").polysynth("noteOff",x+48);
      });
    }
});

__.loop(300,function(){
		__("sampler").stop().start();
			organ1();
  			organ2();
  			organ3();
  			organ4();
});

__.loop("start");