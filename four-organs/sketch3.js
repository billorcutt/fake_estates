//chord 5

var counter_factory = function() {
    var index = 0;
    return function() {
        index++;
        return index;
    };
};

__().compressor().dac();
__("compressor").reverb({seconds:1}).connect("dac");

__().sampler({path:"./Korg-N1R-Maracas.wav"}).panner(1).connect("dac");
__().sampler({path:"./Korg-N1R-Maracas.wav"}).panner(-1).connect("dac");
__().polysynth({id:"ps1"}).gain(1/4).panner(1).connect("compressor");
__().polysynth({id:"ps2"}).gain(1/4).panner(1/2).connect("compressor");
__().polysynth({id:"ps3"}).gain(1/4).panner(-1/2).connect("compressor");
__().polysynth({id:"ps4"}).gain(1/4).panner(-1).connect("compressor");

var chord = __.chords("eleventh");

var throttle1 = __.throttle_factory(16);
var counter = counter_factory();

var sequence = [{},{
	o1:{note:"on"},
	o2:{note:"on"},
	o3:{note:"on"},
	o4:{note:"on"}
},{},{},{},{},{},{},{
	o1:{note:"off"},
	o2:{note:"off"},
	o3:{note:"off"},
	o4:{note:"off"}
},{}];

function set_note(on,off,voice) {
	sequence.map(function(element){
		delete element[voice];
	});


}

function grow_sequence(number) {
	for(var i=0;i<sequence.length;i++) {
		var el = sequence[i];
		var keys = Object.keys(sequence[i]);
		if(i!=0 && keys.length==0) {
			for(var j=0;j<number;j++) {
				sequence.splice(i,0,{});
			}
			break;
		}
	}	
}

function advance_sequence() {
	var element = __.array_next(sequence);
	var keys = Object.keys(element);
	for(var i=0;i<keys.length;i++) {
		if(keys[i]==="o1") {
			if(element[keys[i]].note==="on") {
				chord.map(x => {
					__("#ps1").polysynth("noteOn",x+60);
		        });
			} else if(element[keys[i]].note==="off") {
				chord.map(x => {
					__("#ps1").polysynth("noteOff",x+60);
		        });	
			}
		} else if(keys[i]==="o2") {
			if(element[keys[i]].note==="on") {
				chord.map(x => {
					__("#ps2").polysynth("noteOn",x+84);
		        });
			} else if(element[keys[i]].note==="off") {
				chord.map(x => {
					__("#ps2").polysynth("noteOff",x+84);
		        });		
			}
		} else if(keys[i]==="o3") {
			if(element[keys[i]].note==="on") {
				chord.map(x => {
					__("#ps3").polysynth("noteOn",x+72);
		        });
			} else if(element[keys[i]].note==="off") {
				chord.map(x => {
					__("#ps3").polysynth("noteOff",x+72);
		        });		
			}
		} else if(keys[i]==="o4") {
			
			if(element[keys[i]].note==="on") {
				chord.map(x => {
					__("#ps4").polysynth("noteOn",x+48);
		        });
			} else if(element[keys[i]].note==="off") {
				chord.map(x => {
					__("#ps4").polysynth("noteOff",x+48);
		        });		
			}			
		}
	}
}

__.loop(300,function(){
    __("sampler").stop().start();
    if(counter()>8) {
		advance_sequence();
    }
});
__.loop("start").play();
