var tasks = [];
var variations = [];
var nextTask = 1;
var avoidFactor = 0.3;

var defaultMeta = {
	name: 'My Task',
	tempo: 80,
	time: 60,
	timeBreak: 30
};

function clearTasks()
{
	tasks = [];
	variations = [];
	nextTask = 1;
}

function sanitizeTask(task)
{
	task.meta.tempo = Number(task.meta.tempo);
	task.meta.time = Number(task.meta.time);
	task.meta.timeBreak = Number(task.meta.timeBreak);
}

function getTotalTaskTime()
{
	var ret = 0;
	
	console.log('hhh');
	
	for(var i=0; i<tasks.length; i++)
	{
		var cTime = tasks[i].meta.time + tasks[i].meta.timeBreak;
		var keys = Object.keys(tasks[i].properties);
		
		console.log('Base time ' + cTime + ', ' + keys.length + ' keys.');
		
		for(var j=0; j<keys.length; j++)
		{
			var property = tasks[i].properties[keys[j]];
			
			if(property.length > 0)
				cTime *= property.length;
		}
		
		ret += cTime;
	}
	
	return ret;
}

function shuffleTasks()
{
	createVariations();
	
	nextTask = 0;
	
	var srcVariations = [];
	
	for(var i=0; i<variations.length; i++)
		srcVariations[i] = variations[i];
	
	var prevN = -1;
	
	for(var i=0; i<variations.length; i++)
	{
		var srcLength = variations.length - i;
		
		var picked = -1;
		var stillPicking = true;
		
		// pick a valid number outside the avoid range (or give up after 5 tries)
		for(var j=0; j<5 && stillPicking; j++)
		{
			//console.log('pick ' + j + '...');
			
			picked = Math.floor(Math.random() * srcLength);
			
			stillPicking = (prevN > -0.5 && Math.abs((picked - prevN) / srcLength) < avoidFactor);
		}
		
		prevN = picked;
		
		// put picked value in sequence
		variations[i] = srcVariations[picked];
		
		// remove picked value from source
		for(var j=picked+1; j<srcLength; j++)
			srcVariations[j-1] = srcVariations[j];
	}
}

function createVariations()
{
	variations = [];
	
	for(var i=0; i<tasks.length; i++)
	{
		addTaskVariations(tasks[i]);
	}
}

function addTaskVariations(task)
{
	var keys = Object.keys(task.properties);
	
	var combinations = [{}];
	
	// iterate through all task properties
	for(var i=0; i<keys.length; i++)
	{
		var key = keys[i];
			
		var values = task.properties[key];
		var newCombinations = [];
		
		// avoid all combinations being deleted due to a non-array property!
		if(!(values.length > 0))
			continue;
			
		// add new property's values to combinations
		for(var k=0; k<combinations.length; k++)
		{
			for(var j=0; j<values.length; j++)
			{
				var n = newCombinations.length;
				newCombinations[n] = clone(combinations[k]);
				newCombinations[n][key] = values[j];
			}
		}
		
		combinations = newCombinations;
	}
	
	// add meta data and register variations
	for(var i=0; i<combinations.length; i++)
	{
		combinations[i].meta = task.meta;	// add meta data at the end to maintain the object reference
		variations[variations.length] = combinations[i];
	}
}

// remove a task from the list of tasks
function removeTask(task)
{
	for(var i=0; i<tasks.length; i++)
	{
		if(tasks[i] == task)
		{
			tasks.splice(i, 1);
		}
	}
}

// add a task to the list of tasks
function addTask(task)	
{
	// add meta properties if they do not exist
	if(task.hasOwnProperty('meta'))
	{
		var defaultMetaKeys = Object.keys(defaultMeta);
		
		// check for each individual property present in defaultMeta
		for(var i=0; i<defaultMetaKeys.length; i++)
		{
			if(!task.meta.hasOwnProperty(defaultMetaKeys[i]))
			{
				task[defaultMetaKeys[i]] = defaultMeta[defaultMetaKeys[i]];
			}
		}
	}
	else
	{
		task.meta = clone(defaultMeta);
	}
	
	tasks[tasks.length] = task;
}

function getCurrentTask()
{
	if(nextTask <= 0)
		return null;
	
	return variations[nextTask - 1];
}

function getNextTask(advance)
{
	ret = null;
	
	if(nextTask > variations.length)
		shuffleTasks();
	
	if(nextTask != variations.length)
		ret = variations[nextTask];
	
	if(typeof(advance) == 'undefined' || advance)
		nextTask++;
	
	return ret;
}