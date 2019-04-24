var mMetronomeAudio = null;
var mMetronomeTimeout = null;

var metronomeTempo = 60;

function setMetronomeAudio(audio)
{
	mMetronomeAudio = audio;
}

function playMetronomeSound()
{
	mMetronomeTimeout = window.setTimeout(playMetronomeSound, 60000 / metronomeTempo);
	
	mMetronomeAudio.pause();
	mMetronomeAudio.currentTime = 0;
	mMetronomeAudio.play();
}

function stopMetronome()
{
	window.clearTimeout(mMetronomeTimeout);
}

function startMetronome()
{
	stopMetronome();
	playMetronomeSound();
}