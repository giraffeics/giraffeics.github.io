var taskGUI = {
	parts:[],
	
	getContainer:null,
	
	setContainerGetter:function(getter)
	{
		this.getContainer = getter;
	},
	
	addPart:function(task)
	{
		var part = {};
		
		if(this.getContainer != null)
		{
			part.container = this.getContainer();
			part.container.innerHTML = '<p>' + task.meta.name + '</p>';
			part.task = task;
		}
		
		this.parts[this.parts.length] = part;
		return part;
	},
	
	readTasks:function()
	{
		for(var i=0; i<tasks.length; i++)
		{
			var part = this.addPart(tasks[i]);
		}
	}
};