var metronome = {

	audio:null,
	timeout:null,

	tempo:60,
	
	setAudio:function(audio)
	{
		this.audio = audio;
	},

	playSound:function()
	{
		this.audio.pause();
		this.audio.currentTime = 0;
		this.audio.play();
	},

	stop:function()
	{
		window.clearTimeout(this.timeout);
	},

	start:function()
	{
		this.stop();
		this.playSound();
		
		// Obtain static versions of member variables for interval function
		var mSelf = this;
		var mTempo = this.tempo;
		
		// Interval function
		this.timeout = window.setInterval(function(){
			
			if(mSelf.tempo != mTempo)	// If the tempo has changed, restart the interval timer
				mSelf.start();
			else
				mSelf.playSound();		// Otherwise, play the click sound
			
		}, 60000 / this.tempo);
	}
};