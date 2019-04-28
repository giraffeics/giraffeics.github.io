function taskToHTML(task)
{
	var name = task.meta.name;
	var description = task.meta.description;
	var keys = Object.keys(task);
	
	if(description)
	{
		for(var i=0; i<keys.length; i++)
		{
			var key = keys[i];
			
			if(key == 'meta')
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
			
			if(key == 'meta')
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