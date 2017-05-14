var title = "AN ACCOUNT OF THE CRIMES OF PETER THIEL AND HIS SUBSEQUENT ARREST, TRIAL AND EXECUTION.";
var sequence = title.split('');
var result = ['<p>'];


var endpoint = 2;
var breakpoint = 6;
var mywin;

for(var i=0;i<250005;i++) {
    var freq = __.array_next(sequence,0,endpoint,function() {
        result.push(' ');
        if(endpoint > breakpoint) {
            endpoint=1;
            breakpoint++;
            result.push('</p><p>');
            console.log("The array is ",result.length);
        }
        endpoint++;
    });
    result.push(freq);
    if(result.length > 250000) {
        result.push('</p>');
        mywin = window.open("http://localhost:8000/result.html","result","");
        setTimeout(function(){
            mywin.document.body.innerHTML = result.join('');
        },1000);
        break;
    }
}