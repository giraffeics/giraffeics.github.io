var timer = {
	timeout:null,
	time:0,
	labelElement:null,
	timeEndCallback:null,

	setCallback:function(callback)
	{
		this.timeEndCallback = callback;
	},

	setLabelElement:function(labelElement)
	{
		this.labelElement = labelElement;
	},

	updateVisual:function()
	{
		if(this.labelElement != null)	// update label text
		{
			this.labelElement.innerHTML = this.time;
		}
	},

	update:function()
	{
		timer.time--;
		
		timer.updateVisual();
		
		if(timer.time == 0)	// check if timer has reached end
		{
			if(timer.timeEndCallback != null)
				timer.timeEndCallback();
			else
				timer.pause();
		}
	},

	pause:function()
	{
		window.clearTimeout(this.timeout);
	},

	resume:function()
	{
		this.pause();
		timer.timeout = window.setInterval(this.update, 1000);
	},

	start:function(time)
	{
		this.pause();
		
		this.time = time;
		this.updateVisual();
		this.timeout = window.setInterval(this.update, 1000);
	}
};