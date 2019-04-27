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
			
			part.table = document.createElement('table');
			part.row1 = document.createElement('tr');
			part.row2 = document.createElement('tr');
			
			part.table.appendChild(part.row1);
			part.table.appendChild(part.row2);
			part.container.appendChild(part.table);
			
			var td = document.createElement('td');
			td.innerHTML = 'Exercise Name';
			part.row1.appendChild(td);
			
			td = document.createElement('td');
			part.nameBox = document.createElement('input');
			part.nameBox.type = 'text';
			part.nameBox.value = task.meta.name;
			td.appendChild(part.nameBox);
			part.row2.appendChild(td);
			
			// ADD TASK PROPERTIES
			
			var keys = Object.keys(task.properties);
			for(var i=0; i<keys.length; i++)
			{
				// create textbox
				var mBox = document.createElement('input');
				mBox.type = 'text';
				mBox.value = keys[i];
				
				// create & append td
				td = document.createElement('td');
				td.appendChild(mBox);
				part.row1.appendChild(td);
				
				// create buttons
				var mButton1 = document.createElement('button');
				mButton1.onclick = function(){alert(mBox.value);};
				mButton1.innerHTML = 'Edit...';
				
				var mButton2 = document.createElement('button');
				mButton2.onclick = function(){alert('Delete..?');};
				mButton2.innerHTML = 'Delete';
				
				// create & append td
				td = document.createElement('td');
				td.appendChild(mButton1);
				td.appendChild(mButton2);
				part.row2.appendChild(td);
				
			}
			
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