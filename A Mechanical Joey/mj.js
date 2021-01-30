 //load the sounds
__().sampler({id:"l1",path:"./numbers/one.wav"}).panner(1).gain(1/2).out();
__().sampler({id:"l2",path:"./numbers/two.wav"}).panner(1).gain(1/2).out();
__().sampler({id:"l3",path:"./numbers/three.wav"}).panner(1).gain(1/2).out();
__().sampler({id:"l4",path:"./numbers/four.wav"}).panner(1).gain(1/2).out();
__().sampler({id:"l5",path:"./numbers/five.wav"}).panner(1).gain(1/2).out();
__().sampler({id:"l6",path:"./numbers/six.wav"}).panner(1).gain(1/2).out();
__().sampler({id:"l7",path:"./numbers/seven.wav"}).panner(1).gain(1/2).out();

__().sampler({id:"r1",path:"./numbers/one.wav"}).panner(-1).gain(1/2).out();
__().sampler({id:"r2",path:"./numbers/two.wav"}).panner(-1).gain(1/2).out();
__().sampler({id:"r3",path:"./numbers/three.wav"}).panner(-1).gain(1/2).out();
__().sampler({id:"r4",path:"./numbers/four.wav"}).panner(-1).gain(1/2).out();
__().sampler({id:"r5",path:"./numbers/five.wav"}).panner(-1).gain(1/2).out();
__().sampler({id:"r6",path:"./numbers/six.wav"}).panner(-1).gain(1/2).out();
__().sampler({id:"r7",path:"./numbers/seven.wav"}).panner(-1).gain(1/2).out();

//tempo
let tempo_l = 1;
let tempo_throttle_l = __.throttle_factory(tempo_l);
let tempo_r = 1;
let tempo_throttle_r = __.throttle_factory(tempo_r);

//left side
let threshold_l = 17;
let throttle_l = __.throttle_factory(threshold_l);
let arr_l = [1];
let increment_l = true;
let bounceback_l = 2;


//right side
let threshold_r = 8;
let throttle_r = __.throttle_factory(threshold_r);
let arr_r = [1];
let increment_r = true;
let bounceback_r = 3;

let bounceback_arr_l = [2,3,4,5,6,5,4,3];
let bounceback_arr_r = [2,3,4,5,6,5,4,3];

//loop
__.loop(225,function(){

  if(tempo_throttle_l()) {
    __("#l"+__.array_next(arr_l)).stop().start();
    
    //every x times increment or decrement the count
    if(throttle_l()) {
      if(increment_l) {
        arr_l.push(arr_l.length+1);
        increment_l = arr_l.length !== bounceback_l
      } else {
        arr_l.pop();
        if(arr_l.length === 1) {
          increment_l = true;
          threshold_l++;
          bounceback_l = 6; //__.array_next(bounceback_arr_l,0,0);
        } else {
          increment_l = false;
        }  
      } 
      //make a new throttle
      throttle_l = __.throttle_factory(threshold_l * arr_l.length);
    } 
  }

  if(tempo_throttle_r()) {
    __("#r"+__.array_next(arr_r)).stop().start();
  
    //every x times increment or decrement the count
    if(throttle_r()) {
      if(increment_r) {
        arr_r.push(arr_r.length+1);
        increment_r = arr_r.length !== bounceback_r
      } else {
        arr_r.pop();
        if(arr_r.length === 1) {
          increment_r = true;
          threshold_r++;
          bounceback_r = 6; //__.array_next(bounceback_arr_r,1,0);
        } else {
          increment_r = false;
        }  
      } 
      //make a new throttle
      throttle_r = __.throttle_factory(threshold_r * arr_r.length);
    }
  }

  
});

//start it
__.loop("start");
__.sequence("counting").step(function(){
  __.loop("stop");
  __("*").stop();
},35).start();






