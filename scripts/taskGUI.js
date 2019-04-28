var taskGUI = {
	parts:[],
	
	getContainer:null,
	
	setContainerGetter:function(getter)
	{
		this.getContainer = getter;
	},
	
	createTask:function()
	{
		var name = prompt('New task name: ', 'My Task');
		
		// If the user did not cancel, create & add the task
		if(name != null)
		{
			var task = {properties:{}};
			task.meta = clone(defaultMeta);
			task.meta.name = name;
			addTask(task);
			this.addPart(task);
		}
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
			
			var mTask = task;
			
			// CREATE PROPERTY EDITOR
			
			part.hideEditor = function()
			{
				if(this.hasOwnProperty('editorDiv'))
				{
					this.container.removeChild(this.editorDiv);
					delete this.editorDiv;
				}
			}
			
			part.applyEditorChanges = function()
			{
				if(this.hasOwnProperty('editorDiv'))
				{
					var enteredValues = this.editorTextArea.value.split(',');
					var newValues = [];
					
					// ensure empty or null values are removed
					for(var i=0; i<enteredValues.length; i++)
					{
						if(enteredValues[i] != null && enteredValues[i] != '')
							newValues[newValues.length] = enteredValues[i];
					}
					
					if(newValues.length > 0)
					{
						var key = Object.keys(this.task.properties)[this.editorKeyID];
						this.task.properties[key] = newValues;
						this.hideEditor();
					}
					else
						alert('No valid values entered!');
				}
			}
			
			part.showEditor = function(keyID)
			{
				this.hideEditor();	// ensure there is not an active editor
				
				this.editorKeyID = keyID;
				this.editorDiv = document.createElement('div');
				
				var mKeys = Object.keys(this.task.properties);
				var mKey = mKeys[keyID];
				
				// create HTML elements
				var table = document.createElement('table');				// table & row
				var tr = document.createElement('tr');
				table.appendChild(tr);
				
				var td =  document.createElement('td');						// first table data
				tr.appendChild(td);
				
				var label = document.createElement('span');					// property name label
				label.innerHTML = mKeys[keyID] + ': <br/>';
				td.appendChild(label);
				
				var button = document.createElement('button');				// 'apply' button
				button.innerHTML = 'Apply';
				button.onclick = function(){part.applyEditorChanges()};
				td.appendChild(button);
				
				td =  document.createElement('td');							// seond table data
				tr.appendChild(td);
				
				part.editorTextArea = document.createElement('textArea');	// text area
				part.editorTextArea.rows = 4;
				part.editorTextArea.cols = 60;
				td.appendChild(part.editorTextArea);
				
				// set textArea value
				for(var i=0; i<this.task.properties[mKey].length; i++)
					part.editorTextArea.value += this.task.properties[mKey][i] + ',';
				
				this.editorDiv.appendChild(table);
				this.container.appendChild(this.editorDiv);
			};
			
			// ADD TASK PROPERTIES
			
			var keys = Object.keys(task.properties);
			for(var i=0; i<keys.length; i++)
			{
				var mKeyID = i;
				
				// create & append td
				var mLabel = document.createElement('td');
				mLabel.innerHTML = keys[i];
				part.row1.appendChild(mLabel);
				
				// create buttons
				var mButton1 = document.createElement('button');
				mButton1.onclick = function(){part.showEditor(mKeyID);};
				mButton1.innerHTML = 'Edit';
				
				var mButton2 = document.createElement('button');
				mButton2.onclick = function(){alert('delete..?');};
				mButton2.innerHTML = 'Delete';
				
				var mButton3 = document.createElement('button');
				mButton3.onclick = function(){	// replace the existing key name
					var mKeys = Object.keys(mTask.properties);
					var newKey = prompt('Enter a new name for this property: ', mKeys[mKeyID]);
					
					// replace the new key if the user did not click 'cancel'
					if(newKey != null)
					{
						// ensure that another key is not overwritten
						for(var j=0; j<mKeys.length; j++)
						{
							if(j != mKeyID && mKeys[j] == newKey)
								return;
						}
						
						// replace the key name
						replaceKey(mTask.properties, mKeys[mKeyID], newKey);
						mLabel.innerHTML = newKey;
					}
				};
				mButton3.innerHTML = 'Rename';
				
				// create & append td
				td = document.createElement('td');
				td.appendChild(mButton1);
				td.appendChild(mButton2);
				td.appendChild(mButton3);
				part.row2.appendChild(td);
			}
			
			// create & append td for "add property" button
			var button = document.createElement('button');
			button.innerHTML = 'Add...';
			button.onclick = function(){part.addProperty();};
			
			part.addButtonTD = document.createElement('td');
			part.addButtonTD.appendChild(button);
			part.row2.appendChild(part.addButtonTD);
			
			part.task = task;
		}
		
		part.addProperty = function()
		{
			var name = prompt('Property name: ', 'My Property');
			
			if(name != null && name != '')
			{
				alert('yeet, ' + this.task.meta.name + ', ' + name);
			}
		};
		
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