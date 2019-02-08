__().sine({id:"s0"}).gain({id:"g0"}).gain({id:"main"}).dac(1);
__().sine({id:"s1"}).gain({id:"g1"}).connect("#main");
__().sine({id:"s2"}).gain({id:"g2"}).connect("#main");
__().sine({id:"s3"}).gain({id:"g3"}).connect("#main");
__().sine({id:"s4"}).gain({id:"g4"}).connect("#main");
__().sine({id:"s5"}).gain({id:"g5"}).connect("#main");
__().sine({id:"s6"}).gain({id:"g6"}).connect("#main");
__().sine({id:"s7"}).gain({id:"g7"}).connect("#main");
__().sine({id:"s8"}).gain({id:"g8"}).connect("#main");


var throttle = __.throttle_factory(4);
	__("gain").volume(0);

//loop configured with an interval and a single callback-

//var chord_type = ["major","minor","seventh","ninth","major_seventh","minor_seventh","suspended","diminished","eleventh","thirteenth"];
  var chord_type = ["seventh"];
  var thischord = chord_type[__.random(0,chord_type.length-1)];
  var chord = __.chords(thischord);
	var progression = __.chords("major");
	var step = 0;

__.loop(150,function(){
  
	__("gain").volume(0);
  	__("#main").volume(1);
  

  var p = __.array_next(chord,0,0,function(){
    
      if(throttle()) {
        step = __.array_next(progression,0,0);
      }

	});
  
  	for(var i=0;i<chord.length;i++) {
          __("#g"+i).volume(1/9);
          __("#s"+i).frequency(__.pitch2freq(p+i*12+36+step));
     
    	} 

      	console.log(step);
  
      
    });

__.loop("start");
	__.play();
