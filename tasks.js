var tasks = [];
var variations = [];
var nextTask = 0;
var avoidFactor = 0.3;

function addTask(task)
{
	tasks[tasks.length] = task;
}

function shuffleTasks()
{
	variations = tasks;
	
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
			console.log('pick ' + j + '...');
			
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
	
	tasks = variations;
}

//*
// add a task (all of its property combinations) to the list of tasks
function addTask(task)	
{
	var name = task.meta.name;
	var time = task.meta.time;
	var timeBreak = task.meta.timeBreak;
	var tempo = task.meta.tempo;
	
	var keys = Object.keys(task.properties);
	
	var combinations = [{}];
	combinations[0].name = name;
	combinations[0].time = time;
	combinations[0].timeBreak = timeBreak;
	combinations[0].tempo = tempo;
	
	if(task.meta.hasOwnProperty('description'))
	{
		combinations[0].description = task.meta.description;
	}
	
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
	
	for(var i=0; i<combinations.length; i++)
	{
		tasks[tasks.length] = combinations[i];
	}
}	//*/

function getCurrentTask()
{
	if(nextTask <= 0)
		return null;
	
	return tasks[nextTask - 1];
}

function getNextTask()
{
	ret = null;
	
	if(nextTask > tasks.length)
		shuffleTasks();
	
	if(nextTask != tasks.length)
		ret = tasks[nextTask];
	
	nextTask++;
	
	return ret;
}