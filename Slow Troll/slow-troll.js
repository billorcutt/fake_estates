__().gain({id:"master",gain:3/4}).gain().out().play();

__().polysynth({id:"ps1", osc_type:"sine"}).gain(1/5).panner(1).connect("#master");
__().polysynth({id:"ps2", osc_type:"sine"}).gain(1/5).panner(1/2).connect("#master");
__().polysynth({id:"ps3", osc_type:"sine"}).gain(1/5).panner(-1/2).connect("#master");
__().polysynth({id:"ps4", osc_type:"sine"}).gain(1/5).panner(-1).connect("#master");

let threshold = __.random(60,100);
let threshold_bass = __.random(10,50);
let coinflip = () => __.chance(threshold);
let coinflip_bass = () => __.chance(threshold_bass);

let arr = __.fill_array(73,()=>'x');
arr[arr.length-1]='o';
arr.push('z');
let prev_val;

//let chord = __.chords("major");
//let chord = __.chords("seventh");
//let chord = __.chords("ninth");
//let chord = __.chords("diminished");
let chord = __.chords("eleventh");
//let chord = __.chords("thirteenth");

function changeItUp() {
  
  chord.map(x => {
    __("#ps1").polysynth("noteOff",{pitch:x+36});
    if(coinflip_bass()) {
      __("#ps1").polysynth("noteOn",{pitch:x+36});
    }
  });

  chord.map(x => {
    __("#ps2").polysynth("noteOff",{pitch:x+48});
    if(coinflip()) {
      __("#ps2").polysynth("noteOn",{pitch:x+48});
    } 
  });

  chord.map(x => {
    __("#ps3").polysynth("noteOff",{pitch:x+60});
    if(coinflip()) {
      __("#ps3").polysynth("noteOn",{pitch:x+60});
    } 
  });

  chord.map(x => {
    __("#ps4").polysynth("noteOff",{pitch:x+72});
    if(coinflip()) {
      __("#ps4").polysynth("noteOn",{pitch:x+72});
    }  
  });
  
}

var throttle = __.throttle_factory(40);

__.loop(50,function(){
  if(throttle()) {
    let val = __.array_next(arr,0,0,()=>__("#master").volume(1));
    console.log(val);
    if(val=='o' && prev_val =='x') {
      arr[arr.current_index-1]='o';
      console.log(arr);
      __("#master").fadeOut(((arr.length-1)-arr.current_index)*2)
    } else if(val==='o'||val==='z') {
      //do nothing while fade out
    } else {
      changeItUp();
      threshold = __.random(15,55);
    }
    prev_val = val;
  }
});

__.loop("start");

__.sequence("troll").step(function(){
  __.loop("stop");
},182).start();
