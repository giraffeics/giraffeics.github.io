var taskGUI = {
	parts:[],
	
	descriptionHelp:'A property name with a dollar sign before it will be replaced with the value of that property.',
	propertyHelp:'Type in a list of possible values for this property, separated by commas.',
	
	getContainer:null,
	externalUpdateFunc:null,
	
	clear:function()
	{
		for(var i=this.parts.length-1; i>=0; i--)
		{
			this.parts[i].remove();
		}
	},
	
	
	setContainerGetter:function(getter)
	{
		this.getContainer = getter;
	},
	
	setUpdateCallback:function(callback)
	{
		this.externalUpdateFunc = callback;
	},
	
	callExternalUpdate:function()
	{
		if(this.externalUpdateFunc != null)
			this.externalUpdateFunc();
	},
	
	createTask:function()
	{
		var name = prompt('New exercise name: ', 'My Exercise');
		
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
		part.task = task;
		var mTask = task;
		
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
					if(this.editorKeyID >= 0)	// if the editor is not for the description...
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
					else	// if the editor is for the description...
					{
						if(this.editorTextArea.value != null && this.editorTextArea.value != '')
						{
							this.task.meta.description = this.editorTextArea.value;
							this.hideEditor();
						}
						else
							alert('No valid values entered!');
					}
					
					taskGUI.callExternalUpdate();
				}
			}
			
			part.showEditor = function(keyID)
			{
				this.hideEditor();	// ensure there is not an active editor
				
				this.editorKeyID = keyID;
				this.editorDiv = document.createElement('div');
				
				var mKeys = Object.keys(this.task.properties);
				var mKey = '';
				var propName = '';
				
				// negative keyID = description
				if(keyID >= 0)
				{
					mKey = mKeys[keyID];
					propName = mKeys[keyID];
				}
				else
					propName = 'Description';
				
				// create HTML elements
				var table = document.createElement('table');				// table & row
				var tr = document.createElement('tr');
				table.appendChild(tr);
				
				var td =  document.createElement('td');						// first table data
				tr.appendChild(td);
				
				var label = document.createElement('span');					// property name label
				label.innerHTML = propName + ': <br/>';
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
				
				var helpTd =  document.createElement('td');					// third table data, with help info
				tr.appendChild(helpTd);
				
				// set textArea value
				if(keyID >= 0)
				{
					helpTd.innerHTML = '<p>' + taskGUI.propertyHelp + '</p>';
					
					for(var i=0; i<this.task.properties[mKey].length; i++)
						this.editorTextArea.value += this.task.properties[mKey][i] + ',';
				}
				else
				{
					helpTd.innerHTML = '<p>' + taskGUI.descriptionHelp + '</p>';
					this.editorTextArea.value = this.task.meta.description;
				}
				
				this.editorDiv.appendChild(table);
				this.container.appendChild(this.editorDiv);
			}
			
			// makes a GUI for the property corresponding to the key ID
			part.makePropertyGUI = function(keyID)
			{
				var keys = Object.keys(this.task.properties);
				var mKeyID = keyID;
				var mSelf = this;
				
				// create & append label td
				var mLabel = document.createElement('td');
				mLabel.innerHTML = keys[keyID];
				this.row1.appendChild(mLabel);
				
				// create and append buttons td
				var mTd = document.createElement('td');
				this.row2.appendChild(mTd);
				
				// create buttons
				var mButton1 = document.createElement('button');
				mButton1.onclick = function(){mSelf.showEditor(mKeyID);};
				mButton1.innerHTML = 'Edit';
				
				var mButton2 = document.createElement('button');
				mButton2.onclick = function(){
					if(confirm('Are you sure you want to delete the property "' + Object.keys(mSelf.task.properties)[mKeyID] + '"?'))
					{
						var curKeys = Object.keys(mSelf.task.properties);
						delete mSelf.task.properties[curKeys[mKeyID]];
						mSelf.row1.removeChild(mLabel);
						mSelf.row2.removeChild(mTd);
						taskGUI.callExternalUpdate();
					}
				};
				mButton2.innerHTML = 'Delete';
				
				var mButton3 = document.createElement('button');
				mButton3.onclick = function(){	// replace the existing key name
					var mKeys = Object.keys(mTask.properties);
					var newKey = prompt('Enter a new name for this property: ', mKeys[mKeyID]);
					
					// replace the new key if the user did not click 'cancel'
					if(newKey != null)
					{
						// ensure that another key is not overwritten
						for(var i=0; i<mKeys.length; i++)
						{
							if(i != mKeyID && mKeys[i] == newKey)
								return;
						}
						
						// replace the key name
						replaceKey(mTask.properties, mKeys[mKeyID], newKey);
						mLabel.innerHTML = newKey;
					}
				};
				mButton3.innerHTML = 'Rename';
				
				// append buttons to td
				mTd.appendChild(mButton1);
				mTd.appendChild(mButton2);
				mTd.appendChild(mButton3);
			};
			
			// ADD TEMPO EDITOR
			
			td = document.createElement('td');
			td.innerHTML = 'Tempo';
			part.row1.appendChild(td);
			
			td = document.createElement('td');
			part.tempoBox = document.createElement('input');
			part.tempoBox.type = 'number';
			part.tempoBox.size = 4;
			part.tempoBox.min = 20;
			part.tempoBox.max = 999;
			part.tempoBox.value = task.meta.tempo;
			part.tempoBox.oninput = function(){
				part.task.meta.tempo = Number(part.tempoBox.value);
				taskGUI.callExternalUpdate();
			};
			
			td.appendChild(part.tempoBox);
			part.row2.appendChild(td);
			
			// ADD TIME EDITOR
			
			td = document.createElement('td');
			td.innerHTML = 'Time';
			part.row1.appendChild(td);
			
			td = document.createElement('td');
			part.timeBox = document.createElement('input');
			part.timeBox.type = 'number';
			part.timeBox.size = 4;
			part.timeBox.min = 5;
			part.timeBox.max = 999;
			part.timeBox.value = task.meta.time;
			part.timeBox.oninput = function(){
				part.task.meta.time = Number(part.timeBox.value);
				taskGUI.callExternalUpdate();
			};
			
			td.appendChild(part.timeBox);
			part.row2.appendChild(td);
			
			// ADD BREAK TIME EDITOR
			
			td = document.createElement('td');
			td.innerHTML = 'Break';
			part.row1.appendChild(td);
			
			td = document.createElement('td');
			part.breakBox = document.createElement('input');
			part.breakBox.type = 'number';
			part.breakBox.size = 4;
			part.breakBox.min = 5;
			part.breakBox.max = 999;
			part.breakBox.value = task.meta.timeBreak;
			part.breakBox.oninput = function(){
				part.task.meta.timeBreak = Number(part.breakBox.value);
				taskGUI.callExternalUpdate();
			};
			
			td.appendChild(part.breakBox);
			part.row2.appendChild(td);
			
			// ADD EDIT DESCRIPTION BUTTON
			
			td = document.createElement('td');
			td.innerHTML = 'Description';
			part.row1.appendChild(td);
			
			td = document.createElement('td');
			var button = document.createElement('button');
			button.innerHTML = 'Edit';
			button.onclick = function()
			{
				part.showEditor(-1);	// show description editor
			}
			td.appendChild(button);
			part.row2.appendChild(td);
			
			// ADD TASK PROPERTIES
			
			var keys = Object.keys(task.properties);
			for(var i=0; i<keys.length; i++)
			{
				part.makePropertyGUI(i);
			}
			
			// ADD "DELETE EXERCISE" BUTTON
			
			var button = document.createElement('button');
			button.innerHTML = 'Delete Exercise';
			button.onclick = function(){part.promptDeleteExercise();};
			
			part.deleteButtonTD = document.createElement('td');
			part.deleteButtonTD.appendChild(button);
			part.row1.appendChild(part.deleteButtonTD);
			
			// ADD "ADD PROPERTY" Button
			
			button = document.createElement('button');
			button.innerHTML = 'Add Property';
			button.onclick = function(){part.promptAddProperty();};
			
			part.addButtonTD = document.createElement('td');
			part.addButtonTD.appendChild(button);
			part.row2.appendChild(part.addButtonTD);
			
			part.task = task;
		}
		
		part.remove = function()
		{
			removeTask(this.task);
			this.container.parentNode.removeChild(this.container);
			taskGUI.callExternalUpdate();
		}
		
		// deletes the task
		part.promptDeleteExercise = function()
		{
			if(confirm('Delete the exercise "' + this.task.meta.name + '"?'))
			{
				this.remove();
			}
		}
		
		part.promptAddProperty = function()
		{
			var name = prompt('Property name: ', 'My Property');
			
			if(name != null && name != '')
			{
				if(this.task.properties.hasOwnProperty(name))
				{
					alert('A property with that name already exists!');
					return;
				}
				
				var keyID = Object.keys(this.task.properties).length;
				
				// add property to task
				this.task.properties[name] = [''];
				
				// create GUI for property
				this.row2.removeChild(this.addButtonTD);
				this.row1.removeChild(this.deleteButtonTD);
				this.makePropertyGUI(keyID);
				this.row2.appendChild(this.addButtonTD);
				this.row1.appendChild(this.deleteButtonTD);
				
				// show property editor
				this.showEditor(keyID);
				
				taskGUI.callExternalUpdate();
			}
		};
		
		this.parts[this.parts.length] = part;
		
		this.callExternalUpdate();
		
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