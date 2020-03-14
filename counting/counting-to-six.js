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

//old blighty
__().sampler({id:"s1",path:"./numbers/one_gb.mp3"}).out();
__().sampler({id:"s2",path:"./numbers/two_gb.mp3"}).out();
__().sampler({id:"s3",path:"./numbers/three_gb.mp3"}).out();
__().sampler({id:"s4",path:"./numbers/four_gb.mp3"}).out();
__().sampler({id:"s5",path:"./numbers/five_gb.mp3"}).out();
__().sampler({id:"s6",path:"./numbers/six_gb.mp3"}).out();

//set up some variables
let threshold = 4;
let throttle = __.throttle_factory(threshold);
let arr = [1];
let increment = true;

//loop
__.loop({interval:500},function(index,data,array){
  
  //play the sound. weird syntax, have to stop it before we start
  __("#s"+data).stop().start();
  
  //every four times increment or decrement the count
  if(throttle()) {
    if(increment) {
      arr.push(arr.length+1);
      increment = arr.length !== 6
    } else {
      arr.pop();
      increment = arr.length === 1
    } 
    //make a new throttle
    throttle = __.throttle_factory(threshold * arr.length);
    //refresh the loop with the new array
    __.loop(null,null,arr);
  }  
  
},arr);

//start it
__.loop("start");

