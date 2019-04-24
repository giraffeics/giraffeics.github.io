function taskToHTML(task)
{
	var name = task.name;
	var description = task.description;
	var keys = Object.keys(task);
	
	if(description)
	{
		for(var i=0; i<keys.length; i++)
		{
			var key = keys[i];
			
			if(key == 'description' || key == 'name' || key == 'meta' || key == 'time' || key == 'timeBreak' || key == 'tempo')
				continue;
				
			description = description.split('$' + key).join(task[key]);
		}
		
		return description;
	}
	else
	{
		var ret = name;
		var listBegun = false;
		
		for(var i=0; i<keys.length; i++)
		{
			var key = keys[i];
			
			if(key == 'description' || key == 'name' || key == 'meta' || key == 'time' || key == 'timeBreak' || key == 'tempo')
				continue;
				
			if(!listBegun)
			{
				ret += ': <ul>';
				listBegun = true;
			}
			
			ret += '<li>' + key + ': ' + task[key] + '</li>';
		}
		
		if(listBegun)
			ret += '</ul>';
		
		return ret;
	}
}