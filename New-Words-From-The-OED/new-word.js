var dur = 0,
    start = 0,
    end = 0;

var index = 1,
    index2 = 1,
    divisor = 50,
	multiplier = 1,
   	divisor2 = 50,
    percentage = 50,
    percentage2 = 50,
    incrementor = 1,
	incrementor2 = 1,
	multiplier2 = 1;
	
//var path = "./neckbeard_gb_1.mp3";
//var path = "./douchebaggery_gb_1.mp3";
//var path = "./mansplain_gb_3.mp3";
var path = "./amazeballs_gb_1.mp3";
//var path = "./vape_gb_1.mp3";

__().
        sampler({
    	path:path,
  		id:"s1",
  		loop:true
        }).
		panner(-1).
        dac();

__().
        sampler({
    	path:path,
  		id:"s2",
  		loop:true,
        }).
		panner(1).
        dac();


__.loop(1000,function(){
  
    index = __.random(0,100) > percentage ? index+incrementor : index;
  	multiplier = (divisor-index)/divisor;
  
    index2 = __.random(0,100) > percentage2 ? index2+incrementor2 : index2;
  	multiplier2 = (divisor2-index2)/divisor2;
    
    if(index>=divisor) {
		index = divisor-1;
      	incrementor = -1
    } else if(index2>=divisor2) {
      	index2 = divisor2-1;
      	incrementor2 = -1 
    } else if(index2<1||index<1){
        __.loop("stop");
        multiplier = 1;
        multiplier2 = 1;
      	setTimeout(function(){
       		__("sampler").stop();
        },dur*3000);
    }
  
  	console.log(index,index2,multiplier,multiplier2);
  
  	__("#s1").attr({end:dur*multiplier});
  	__("#s2").attr({end:dur*multiplier2});
    
  
});

//let the sample load
setTimeout(function(){
    dur = __("sampler").attr("duration");
  	console.log(dur)
  	__.loop(dur*1000);
    __("sampler").start();
  	setTimeout(function(){
          __.loop("start");
    },dur*3000);
},1000);