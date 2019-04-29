function taskToHTML(task)
{
	var name = task.meta.name;
	var description = task.meta.description;
	var keys = Object.keys(task);
	
	if(typeof(description) != 'undefined' && description != null && description != '' && description != 'undefined')
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
		var ret = name + ': <br/>';
		//var listBegun = false;
		
		for(var i=0; i<keys.length; i++)
		{
			var key = keys[i];
			
			if(key == 'meta')
				continue;
				
			/*
			if(!listBegun)
			{
				ret += ': <ul>';
				listBegun = true;
			}	
			
			ret += '<li>' + key + ': ' + task[key] + '</li>'; //*/
			ret += key + ': ' + task[key] + '<br/>';
		}
		
		/*
		if(listBegun)
			ret += '</ul>';	//*/
		
		return ret;
	}
}