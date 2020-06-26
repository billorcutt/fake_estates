__().gain({id:"master",gain:3/4}).overdrive().out().play();

__().polysynth({id:"ps1", osc_type:"square"}).gain(1/5).panner(1).connect("#master");
__().polysynth({id:"ps2", osc_type:"square"}).gain(1/5).panner(1/2).connect("#master");
__().polysynth({id:"ps3", osc_type:"square"}).gain(1/5).panner(-1/2).connect("#master");
__().polysynth({id:"ps4", osc_type:"square"}).gain(1/5).panner(-1).connect("#master");

let threshold = __.random(25,65);
let coinflip = () => __.random(1,100) > threshold;

//let chord = __.chords("major");
//let chord = __.chords("seventh");
//let chord = __.chords("ninth");
//let chord = __.chords("diminished");
let chord = __.chords("eleventh");
//let chord = __.chords("thirteenth");

function changeItUp() {
  
  chord.map(x => {
    __("#ps1").polysynth("noteOff",x+36);
    if(coinflip()) {
      __("#ps1").polysynth("noteOn",x+36);
    }
  });

  chord.map(x => {
    __("#ps2").polysynth("noteOff",x+48);
    if(coinflip()) {
      __("#ps2").polysynth("noteOn",x+48);
    } 
  });

  chord.map(x => {
    __("#ps3").polysynth("noteOff",x+60);
    if(coinflip()) {
      __("#ps3").polysynth("noteOn",x+60);
    } 
  });

  chord.map(x => {
    __("#ps4").polysynth("noteOff",x+72);
    if(coinflip()) {
      __("#ps4").polysynth("noteOn",x+72);
    }  
  });
  
}  

setInterval(()=>{
	changeItUp();
  	threshold = __.random(25,65);
},2000);
