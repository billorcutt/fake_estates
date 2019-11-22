var counter_factory = function() {
    var index = 0;
    return function() {
        index++;
        return index;
    };
};

var sequence_factory = function(arr,fn) {
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

__().compressor().dac();
__("compressor").reverb({seconds:1}).connect("dac");

__().sampler({path:"./Korg-N1R-Maracas.wav"}).panner(1).connect("dac");
__().sampler({path:"./Korg-N1R-Maracas.wav"}).panner(-1).connect("dac");
__().polysynth({id:"ps1"}).gain().panner(1).connect("compressor");
__().polysynth({id:"ps2"}).gain().panner(1/2).connect("compressor");
__().polysynth({id:"ps3"}).gain().panner(-1/2).connect("compressor");
__().polysynth({id:"ps4"}).gain().panner(-1).connect("compressor");

var chord = __.chords("eleventh");

var sq_array1 = [1,4,7];
var sq_array2 = [2,4,6];
var sq_array3 = [2,5,5];
var sq_array4 = [2,4,6];

var throttle1 = __.throttle_factory(4);
var throttle2 = __.throttle_factory(8);
var throttle3 = __.throttle_factory(12);
var throttle4 = __.throttle_factory(16);

var organ1 = function(){};
var organ2 = function(){};
var organ3 = function(){};
var organ4 = function(){};

var counter = counter_factory();

function grow_sequence(arr) {
    var x = arr[1];
    x++;
    arr[1]=__.random(Math.max(1,x-2),Math.max(x-2,x+2));
    return arr;
}

function initOrgan1() {
  organ1 = sequence_factory(sq_array1,function(b,c){
    if(b && c==1) {
      chord.map(x => {
        __("#ps1").polysynth("noteOn",x+48);
      });
    }  else if(b && c==2){
      chord.map(x => {
        __("#ps1").polysynth("noteOff",x+48);
      });
      if(throttle1()) {
        grow_sequence(sq_array1);
        initOrgan1();
      }
    }
  });
}

function initOrgan2() {
  organ2 = sequence_factory(sq_array2,function(b,c){
      if(b && c==1) {
        chord.map(x => {
          __("#ps2").polysynth("noteOn",x+72);
        });
      }  else if(b && c==2){
        chord.map(x => {
          __("#ps2").polysynth("noteOff",x+72);
        });
        if(throttle2()) {
          grow_sequence(sq_array2);
          initOrgan2();
        }
      }
  });
}

function initOrgan3() {
  organ3 = sequence_factory(sq_array3,function(b,c){
      if(b && c==1) {
        chord.map(x => {
          __("#ps3").polysynth("noteOn",x+60);
        });
      }  else if(b && c==2){
        chord.map(x => {
          __("#ps3").polysynth("noteOff",x+60);
        });
        if(throttle3()) {
          grow_sequence(sq_array3);
          initOrgan3();          
        }      
      }
  });
}

function initOrgan4() {
  organ4 = sequence_factory(sq_array4,function(b,c){
      if(b && c==1) {
        chord.map(x => {
          __("#ps4").polysynth("noteOn",x+48);
        });
      }  else if(b && c==2){
        chord.map(x => {
          __("#ps4").polysynth("noteOff",x+48);
        });
        if(throttle4()) {
          grow_sequence(sq_array4);
          initOrgan4();
        }      
      }
  });
}

initOrgan1();
initOrgan2();
initOrgan3();
initOrgan4();

__.loop(300,function(){
    __("sampler").stop().start();
    if(counter()>8) {
        organ1();
        organ2();
        organ3();
        organ4();
    }
});
__.loop("start").play();
