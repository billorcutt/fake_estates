__().sine(100).gain(1/3).panner(1).dac(0);
__().square(100).gain(1/3).panner(-1).dac(0);
__().saw(100).gain(1/3).dac(0);

var major = __.scales("major");
var sequence = __.fill_array(112,function(idx) {
	var add_to_octave = Math.floor(idx/7);
	return __.pitch2freq(__.array_next(major) + (6+add_to_octave) * 12);
});

var endpoint = 2;
var breakpoint = 6;
var tempo = 100;

__.loop(tempo,function(f) {
	var freq = __.array_next(sequence,0,endpoint,function() {
		if(endpoint > breakpoint) {
			endpoint=1;
			breakpoint++;
			__.loop(tempo--);
		}
		endpoint++;
	});
	__("sine").frequency(freq);
	__("square").frequency(freq/3);
	__("saw").frequency(freq/2);
});

__.loop("start");
__("dac").volume(1).play();