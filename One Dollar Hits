var pad_array = [
  	36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,
  	58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,
  	80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99
];

//var pad_array1 = [36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];
//var pad_array2 = [52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67];
//var pad_array3 = [68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83];
//var pad_array4 = [84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99];

var snd_arr = __.ls("<PATH-TO-SOUNDFILE-DIRECTORY>");

(function() {

    //init on page load
    var noteMap = {},
            r = __.random;

    var speed = 1,
        speed_offset = 0.1;

    //create a sampler for each tile / pad on the midi controller
    pad_array.forEach(function(el,i,arr){

        var path = snd_arr[r(0,snd_arr.length-1)];

        var selector = "pad_"+ el;

        //sampler->overdrive->gain
        __().sampler({
            id:selector,
            path:path
        }).overdrive({
            id:selector+"_od"
        }).gain({
            id:selector+"_g"
        });


        //create a delay and connect it to the existing sampler and gain
        __("#"+selector).delay({
            id:selector+"_d2",
            damping:r(0,100)/100,
            cutoff:r(0,3000),
            feedback:r(0,100)/100,
            delay:0.0
        }).connect("#"+selector+"_g");

    });

    //connect all the gains to the dac
    __("gain").gain(1/2).multi_out(3);
      //__("gain").gain(1/2).out();

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


            //use this when no expression pedal
            //speed = (__.scale(__.random(0,127),0,127,50,100,"log")/100);
            //change the playback speed of all the samplers
            //__("sampler").speed(speed-speed_offset);

        });

        //midi controller messages- hardcoded for my setup
        __.midi_control(function(data){
            //expression pedal
           // if(data[1]===7) {
                speed = (__.scale(data[2],0,127,50,100,"log")/100);
                //change the playback speed of all the samplers
                __("sampler").speed(speed-speed_offset);
                //slider on mpc
          //  } else if(data[1]===1) {
          //      speed_offset = (__.scale(data[2],0,127,15,125,"log")/100);
          //  }
        });

    });

    //run on page load- make the data for each note
    function makeNoteData() {
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
    }
    makeNoteData();
})();
