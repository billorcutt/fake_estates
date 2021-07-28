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

//CHANGE THIS TO POINT TO A DIRECTORY OF WAVS OR MP3S. 
//array of sound files.
var snd_arr = __.ls("</ABSOLUTE/PATH/TO/FOLDER/OF/SAMPLES>");



//init on page load
let noteMap = {},
    r = __.random,
    speed = 1,
    speed_offset = 0.1;

function ranPan() {
  return (__.random(1,200)-100)/100;
}   

var urn = __.urnFactory(snd_arr.length);  

//create a sampler for each tile / pad on the midi controller
pad_array.forEach(function(el,i,arr){

    let path = snd_arr[urn()];

    let selector = "pad_"+ el;

    //sampler->overdrive->gain->panner
    __().sampler({
        id:selector,
        path:path
    }).overdrive({
        id:selector+"_od"
    }).gain({
        id:selector+"_g"
    }).panner(ranPan());

    //create a delay and connect it to the existing sampler and gain
    __("#"+selector).delay({
        id:selector+"_d2",
        damping:r(0,100)/100,
        cutoff:r(0,3000),
        feedback:r(0,100)/100,
        delay:0.0
    }).connect("#"+selector+"_g");

});

//connect all the panners to the dac
__("panner").dac();

//initialize midi
__.midi_init(function(){

    //note on handler
    __.midi_noteon(function(data){

        var selector = "pad_"+data[1];

        //grab the data for that note
        var note_data = noteMap[selector];

        //stop the sampler (in case it's running), trigger the note on, then set the playback speed,
        __("#"+selector).stop().start().speed(speed);

        //ramp low pass freq and low pass q
        __("#"+selector+"_lp").ramp(note_data.lp_ramp[0],note_data.lp_ramp[1],"frequency",note_data.lp_ramp[2]).q(note_data.lp_q);

        //set delay and feedback values for delay 2
        __("#"+selector+"_d2").time(note_data.delay2_delay).feedback(note_data.delay2_feedback);

        __("#"+selector+"_g").volume(note_data.velocity);

        //set distortion level for overdrive
        __("#"+selector+"_od").drive(note_data.overdrive);

    });

    //midi controller messages- hardcoded for my setup
    __.midi_control(function(data){
        //expression pedal
        speed = (__.scale(data[2],0,127,50,100,"log")/100);
        //change the playback speed of all the samplers
        __("sampler").speed(speed-speed_offset);

    });

});

//run on page load- make the data for each note
pad_array.forEach(function(el,i,arr){
    var selector = "pad_"+ el;
    noteMap[selector]={
        pitch:r(100,10000)/1000,
        velocity:r(100,5000)/100,
        lp_ramp:[r(100,1000),(r(10,100)),r(0,100)],
        lp_q:r(5,100),
        overdrive:r(0,1000)/300,
        delay2_delay:r(0,100)/1000,
        delay2_feedback:r(0,100)/100
    };
});


