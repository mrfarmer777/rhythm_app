var timerID=null;
var interval=100;

self.onmessage=function(e){
	if (e.data=="start") {
		console.info("starting");
		timerID=setInterval(function(){postMessage("tick");},interval)
	}
	else if (e.data.interval) {
		console.info("setting interval");
		interval=e.data.interval;
		console.info("interval="+interval);
		if (timerID) {
			clearInterval(timerID);
			timerID=setInterval(function(){postMessage("tick");},interval)
		}
	}
	else if (e.data=="stop") {
		console.info("stopping");
		clearInterval(timerID);
		timerID=null;
	}
};

postMessage('Metronome worker loaded');
