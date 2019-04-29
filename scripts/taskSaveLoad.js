function loadTasks()
{
	//console.log('COOKIE: ' + document.cookie);
	
	var savedCookie = Cookies.get('tasksSaved');
	
	console.log(savedCookie);
	
	if(savedCookie != 'true')
		return;
	
	clearTasks();
	
	for(var i=0; true; i++)
	{
		var taskCookie = Cookies.getJSON('task' + i);
		
		if(!taskCookie)
			return;
		
		console.log(taskCookie);
		
		addTask(taskCookie);
	}
	
	// save tasks to keep the cookie valid
	saveTasks();
}

function saveTasks()
{
	Cookies.set('tasksSaved', 'true', { expires: 365 });
	
	for(var i=0; i<tasks.length; i++)
	{
		Cookies.set('task' + i, tasks[i], { expires: 365 });
	}
}