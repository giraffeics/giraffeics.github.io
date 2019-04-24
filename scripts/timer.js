var timer = {};
timer.timeout = null;
timer.time = 0;
timer.labelElement = null;
timer.timeEndCallback = null;

function setTimerCallback(callback)
{
	timer.timeEndCallback = callback;
}

function setTimerLabelElement(labelElement)
{
	timer.labelElement = labelElement;
}

function updateTimerVisual()
{
	if(timer.labelElement != null)	// update label text
	{
		timer.labelElement.innerHTML = timer.time;
	}
}

function updateTimer()
{
	timer.time--;
	
	updateTimerVisual();
	
	if(timer.time == 0)	// check if timer has reached end
	{
		if(timer.timeEndCallback != null)
			timer.timeEndCallback();
		else
			pauseTimer();
	}
}

function pauseTimer()
{
	window.clearTimeout(timer.timeout);
}

function resumeTimer()
{
	pauseTimer();
	timer.timeout = window.setInterval(updateTimer, 1000);
}

function startTimer(time)
{
	pauseTimer();
	
	timer.time = time;
	updateTimerVisual();
	timer.timeout = window.setInterval(updateTimer, 1000);
}