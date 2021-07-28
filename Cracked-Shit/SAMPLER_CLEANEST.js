//cutting edge...
cracked.urnFactory = function (max) {

    var arr = [];
    while(arr.length < max){
        var r = Math.floor(Math.random() * max);
        if(arr.indexOf(r) === -1) arr.push(r);
    }

    return function() {
        return cracked.array_next(arr);
    };

};

//array of midi note numbers from midi controller.
var pad_array = [
  	36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,
  	58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,
  	80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,
    100,101,103,105,107,108,110,112,113,115,117
];

//var pad_array1 = [36, 38, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59, 60, 62];
//var pad_array2 = [64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89];
//var pad_array3 = [91, 93, 95, 96, 98, 100, 101, 103, 105, 107, 108, 110, 112, 113, 115, 117];

//CHANGE THIS TO POINT TO A DIRECTORY OF WAVS OR MP3S. 
//array of sound files.
var snd_arr = __.ls("</ABSOLUTE/PATH/TO/FOLDER/OF/SAMPLES>");


//init
let noteMap = {},
    r = __.random,
    speed = 1,
    speed_offset = 0.1;

//returns a random number between -1 and 1
function ranPan() {
  return (__.random(1,200)-100)/100;
} 

var urn = __.urnFactory(snd_arr.length);

//create a sampler for each pad on the midi controller
pad_array.forEach(function(el,i,arr){

    //name of this sampler
    let selector = "pad_"+ el;

    //path to a randomly selected sound file    
    let path = snd_arr[urn()];

    //connect em up: sampler->panner
    __().sampler({
        id:selector,
        path:path
    }).panner(ranPan());

});

//connect all the panners to the output
__("panner").out();

//initialize midi
__.midi_init(function(){

    //note on handler
    __.midi_noteon(function(data){
      
        //construct the name for the incoming notes
        var selector = "pad_"+data[1];

        //stop the sampler (in case it's running), trigger the note on, then set the playback speed,
        __("#"+selector).stop().start();

    });

    //midi controller messages- hardcoded for my ernie ball volume pedal/midi controller
    __.midi_control(function(data){
      
        //calculate the playback speed
        speed = (__.scale(data[2],0,127,50,100,"log")/100);
        
        //change the playback speed of all the samplers
        __("sampler").speed(speed-speed_offset);

    });

});
