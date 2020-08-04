//load the sounds
/*
//us version
__().sampler({id:"s1",path:"./numbers/one_us.mp3"}).out();
__().sampler({id:"s2",path:"./numbers/two_us.mp3"}).out();
__().sampler({id:"s3",path:"./numbers/three_us.mp3"}).out();
__().sampler({id:"s4",path:"./numbers/four_us.mp3"}).out();
__().sampler({id:"s5",path:"./numbers/five_us.mp3"}).out();
__().sampler({id:"s6",path:"./numbers/six_us.mp3"}).out();
*/

let register = 5

let sequence = __.fill_array(7,idx => {
  return __.pitch2freq(__.scales("major")[idx] + register * 12);
});

//old blighty
__().sampler({id:"s1",path:"./numbers/one_gb.mp3"}).gain(2).out();
__().sampler({id:"s2",path:"./numbers/two_gb.mp3"}).gain(2).out();
__().sampler({id:"s3",path:"./numbers/three_gb.mp3"}).gain(2).out();
__().sampler({id:"s4",path:"./numbers/four_gb.mp3"}).gain(4).out();
__().sampler({id:"s5",path:"./numbers/five_gb.mp3"}).gain(3).out();
__().sampler({id:"s6",path:"./numbers/six_gb.mp3"}).gain(2).out();

//set up some variables
let threshold = 2;
let throttle = __.throttle_factory(threshold);
let arr = [1];
let increment = true;
let offset = 0;

__().sine({id:"sq1"}).gain(5).adsr().panner(0).out()

//loop
__.loop({interval:250},function(index,data,array){
  
  //play the sound. weird syntax, have to stop it before we start
  __("#s"+data).stop().start();
	__("#sq1").frequency(sequence[data-1]);
  __("adsr").adsr("trigger",100/1000);
  
  //every x times increment or decrement the count
  if(throttle()) {
    if(increment) {
      arr.push(arr.length+1);
      increment = arr.length !== 6
    } else {
      arr.pop();
      if(arr.length === 1) {
      	increment = true;
        threshold++;
      } else {
		increment = false;
      }  
    } 
    //make a new throttle
    throttle = __.throttle_factory(threshold * arr.length);
    //refresh the loop with the new array
    __.loop(null,null,arr);
  }  
  
},arr);

//start it
__.loop("start");
__("sine,saw,square").start();

__.sequence("counting").step(function(){
  __.loop("stop");
  __("*").stop();
},30).start();

