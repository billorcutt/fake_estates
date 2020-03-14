let sequence,sequence2,endpoint,endpoint2,offset,offset2;

let throttle = __.throttle_factory(16);

function init() {
  
  console.log("init");
  
  sequence = __.fill_array(7,idx => {
    return __.pitch2freq(__.scales("major")[idx] + __.random(2,7) * 12);
  });

  sequence2 = __.fill_array(7,idx => {
    return __.pitch2freq(__.scales("major")[idx] + __.random(2,7) * 12);
  });
  
  endpoint = __.random(4,7);
  endpoint2 = __.random(4,7);
  
  offset = __.random(0,3);
  offset2 = __.random(0,3);
  
} 

__().square({id:"sq2"}).gain(0).panner(-1).out();
__().square({id:"sq1"}).gain(0).panner(1).out().play()

__.loop(130,function(index,data,array){
  
  __("#sq1").frequency(__.array_next(sequence,offset,endpoint));
  __("#sq2").frequency(__.array_next(sequence2,offset2,endpoint2));

  if(throttle()) {
    init(); 
  }

});

init();

__.loop("start");
__("gain").volume(1/2);



