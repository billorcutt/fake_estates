function noteOn(path,pitch) {
  __(path +" osc").frequency(__.pitch2freq(pitch));
  __(path).fadeIn(1/10);
}

function noteOff(path) {
  __(path).fadeOut(1/10);
}

function getRegister() {
  let registers = [36,48,60];
  return registers[__.random(0,registers.length-1)];
}  

function getPan() {
  return (__.random(0,200)-100)/100; 
}

__().gain({id:"master",gain:1/4}).gain().out().play();
__().begin("goo").gang_of_oscillators("sine").end("goo").gain(1/5).panner(getPan()).connect("#master");

let chord1 = __.chords("thirteenth");
let chord2 = __.chords("thirteenth");

let reg1 = getRegister();
let reg2 = getRegister();

let throttle = __.throttle_factory(1);

__.loop(200,function(){
  if(throttle()) {
    //noteOff("goo gang_of_oscillators v1");
    noteOn("goo gang_of_oscillators v1", chord1[__.random(0,chord1.length-1)]+reg1);
    
    //noteOff("goo gang_of_oscillators v2");
    noteOn("goo gang_of_oscillators v2", chord2[__.random(0,chord1.length-1)]+reg2);

    throttle = __.throttle_factory(__.random(60,72));
  }
});

__.sequence("slow").step(function(){
  __.loop("stop");
  __("*").stop();
},60).start();

__.loop("start").play();

