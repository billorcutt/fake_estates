function noteOn(path,pitch) {
  __(path +" osc").frequency(__.pitch2freq(pitch));
  __(path).volume(1);
}

function noteOff(path) {
  __(path).volume(0);
}

function getRegister() {
  let registers = [36,48,60,72];
  return registers[__.random(0,registers.length-1)];
}  

function getPan() {
	return (__.random(0,200)-100)/100;  
}

__().gain({id:"master",gain:1/4}).gain().out().play();
__().begin("goo").gang_of_oscillators("sine").end("goo").gain(1/5).panner().connect("#master");

let chord1 = __.chords("thirteenth");
let chord2 = __.chords("thirteenth");

let reg1, reg2, endpoint1, endpoint2, offset1, offset2;

function init() {
  reg1 = getRegister();
  reg2 = getRegister();
  __("panner").pan(getPan());
}

init();

__.loop(100,function(){

  //noteOff("goo gang_of_oscillators v1");
  noteOn("goo gang_of_oscillators v1",__.array_next(chord1)+reg1);
  
  //noteOff("goo gang_of_oscillators v2");
  noteOn("goo gang_of_oscillators v2",__.array_next(chord2)+reg2);  
  
});

__.sequence("fast").step(function(){
  __.loop("start").play();
},35).step(function(){
  __.loop("stop");
  __("*").stop();
},50).start();

__.random_interval(function(time){
  init();
},__.min2ms(1),__.min2ms(5));

