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
}

function saveTasks()
{
	Cookies.set('tasksSaved', 'true');
	
	for(var i=0; i<tasks.length; i++)
	{
		console.log(JSON.stringify(tasks[i]));
		Cookies.set('task' + i, tasks[i]);
	}
}