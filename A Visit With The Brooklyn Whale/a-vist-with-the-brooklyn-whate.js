/*
oopy and paste into many cracked windows.
*/

__().sine(100).gain(0).panner(__.random(-100,100)/100).dac(1/5).play()

var sequence = __.fill_array(7,function(idx){
	return __.pitch2freq(__.scales("major")[idx] + (6) * 12);
});

var endpoint = 2;

__.loop(100,function(f){
  
    var freq = __.array_next(sequence,0,endpoint);
    __("sine").frequency(freq);
 
});

__.loop("start");
__("gain").volume(1);


setInterval(function(){
	endpoint = __.random(2,7);
	__.loop(__.random(50,400));
},1000);