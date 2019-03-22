//broken chord 4

__().gain({id:"main"}).overdrive().overdrive().overdrive().dac(1);

for(var z=0;z<16;z++) {

  var v = Math.floor(z/4)+1;  
  var p = {v1:-1,v2:1,v3:-1/2,v4:1/2};
  __().sine({id:"s"+z}).gain({class:"v"+v}).panner(p["v"+v]).connect("#main");
  
}
__().sine(120).lowpass({q:200,frequency:60}).adsr(1/16).gain({id:"kick"}).connect("#main");

/////////////////////////////

var throttle = __.throttle_factory(4);
var chord = [0,4,7,10,12];
var chord2 = [0,4,7,10,12];
var chord3 = [0,4,7,10,12];
var chord4 = [0,4,7,10,12]
var step = 0;

__("gain").volume(0);
__("#main,#kick").volume(1);
__(".v1,.v2,.v3,.v4").volume(1/20);

__.loop({interval:75,steps:16},function(idx,data) {


/////////////////////////////
  
  if(data > 1) {

    var p = __.array_next(chord,0,0,function(){
        if(throttle()) {
          //step = __.array_next(progression,0,0);
        }
    });

    for(var i=0;i<chord.length;i++) {
      
          __("#s"+i).frequency(__.pitch2freq(p+i*12+48+step));
     
    }     
    
                  __("adsr").adsr("trigger");
    

  }

/////////////////////////////
  
  if(data) {

    var p2 = __.array_next(chord2,0,0);

    for(var y=0;y<chord2.length;y++) {

      __("#s"+(y+5)).frequency(__.pitch2freq(p2+y*12+36+step));

    }
    
                  //__("adsr").adsr("trigger");
    
  }
  
/////////////////////////////   

    if(data > 2) {

      var p3 = __.array_next(chord3,0,0,function(){
        if(throttle()) {
          //step = __.array_next(progression,0,0);
        }
      });

    for(var i=0;i<chord3.length;i++) {
      
          __("#s"+(i+10)).frequency(__.pitch2freq(p3+i*12+24+step));
     
    }     

  }

/////////////////////////////

  var p4 = __.array_next(chord4,0,0);

  for(var y=0;y<chord2.length;y++) {
      
    __("#s"+(y+15)).frequency(__.pitch2freq(p4+y*12+84+step));
     
  }
  

      
},[3,0,1,0,2,0,1,0,2,0,1,0,2,0,1,0]);

__.loop("start");
__.play();
