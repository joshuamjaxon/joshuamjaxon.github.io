function Task(name, priority, due, project)
{
	this.name = name;
	this.priority = priority;
	this.due = due;
	this.project = project;
}


function TaskList()
{
	var list = [];

	var displayList = function()
	{
		var newTask, checkbox;
	
		for (i = 0; i < list.length; i++)
		{
			newTask = document.createElement('li');
			
			newTask.innerHTML = '<input type="checkbox" onclick="crossOut(this);">' + description;
			
			document.querySelector('#high ul').appendChild(newTask);
			
			document.getElementById('newtask').value = "";
			document.getElementById('duedate').value = "";
		}
	}

	this.addTask = function(task)
	{
		list.push(task);
	}
	
	this.removeTask = function(taskName)
	{
		for (i = 0; i < list.length; i++)
		{
			if (list[i].name == taskName)
			{
				
			}
		}
	}
	
	this.saveAll = function()
	{
		
	}
	
	this.restoreAll = function()
	{
		
	}
}