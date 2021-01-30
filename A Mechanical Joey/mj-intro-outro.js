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

let offset = 0;
let limit_l = 6;
let limit_r = 6;

//tempo
let tempo_l = 1;
let tempo_throttle_l = __.throttle_factory(tempo_l);
let tempo_r = 1;
let tempo_throttle_r = __.throttle_factory(tempo_r);

//left side
let arr_l = [1,2,3,4,5,6];


//right side
let arr_r = [1,2,3,4,5,6];


//loop
__.loop(224,function(){

  if(tempo_throttle_l()) {
    __("#l"+__.array_next(arr_l,offset,limit_l)).stop().start();
  }

  if(tempo_throttle_r()) {
    __("#r"+__.array_next(arr_r,0,limit_r)).stop().start();
  }

});

//start it
__.loop("start");
__.sequence("counting").step(function(){
  offset = 1;
},1/4).step(function(){
  limit_l = 1;
  limit_r = 2;
},1/2).step(function(){
  __.loop("stop");
  __("*").stop();
},35).start();






