function Task(name, priority, due, project)
{
	this.name = name;
	this.priority = priority;
	this.due = due;
	this.project = project;
	
	this.idNum = 0;
}


function Project(name)
{
	this.name = name;
	this.tasks = [];
}


function TaskList()
{
	var projects = [];
	var idCount = 0;

	var displayList = function()
	{
		// Create variables to represent new list items
		var projItem;
		
		// Create new task variables
		var taskItem, due, priority;
		
		// Clear previous list
		document.querySelector('#list ul').innerHTML = "";
	
		// Add list item to appropriate place in display
		for (i = 0; i < projects.length; i++)
		{
			// Create project element and add it to display
			projItem = document.createElement('li');
			projItem.className = "project";
			projItem.innerHTML = '<button onclick="toDoList.toggleChildren(this)">Toggle Tasks</button>' + " " + projects[i].name;
			document.querySelector('#list ul').appendChild(projItem);
			
			// Create task elements and add them to display
			for (j = 0; j < projects[i].tasks.length; j++)
			{
				// Format due date
				if (projects[i].tasks[j].due == "") {
					due = "";
				} else {
					due = "[Due: " + projects[i].tasks[j].due + "] ";
				}
				
				// Format priority
 				priority = "[" + projects[i].tasks[j].priority.toUpperCase() + "] ";
				
				// Create task element and add it to display
				taskItem = document.createElement('li');
				taskItem.className = projects[i].tasks[j].priority;
				taskItem.id = idCount;
				projects[i].tasks[j].idNum = idCount;
				idCount += 1;
				taskItem.innerHTML = '<input type="checkbox" onclick="toDoList.crossOut(this);">' + priority + due + projects[i].tasks[j].name;
				projItem.appendChild(taskItem);
			}
		}
	}
	
	var clearFields = function()
	{
		// Reset all fields to default
		document.getElementById('newtask').value = "";
		document.getElementById('duedate').value = "";
		document.getElementById('project').value = "Miscellaneous";
	}
	
	var validate = function(id)
	{
		// Returns true if the input field is not empty
		if (document.getElementById(id).value != "")
		{
			return true;
		}
		
		// Otherwise returns false
		return false;
	}

	this.crossOut = function(item)
	{
		// Cross out item if checked
		if (item.checked)
		{
			item.parentNode.style.textDecoration = "line-through";
		}
		// Remove strikethrough if not checked
		else
		{
			item.parentNode.style.textDecoration = "none";
		}
	}
	
	this.toggleChildren = function(item)
	{
		// Get children
		var children = item.parentNode.childNodes;
	
		// Iterate through children array and toggle elements on and off.
		for(i = 0; i < children.length; i++)
		{
			if (children[i].className == "high" || children[i].className == "medium" || children[i].className == "low")
			{
				if (children[i].style.display == "none")
				{
					children[i].style.display = "block";
				}
				else
				{
					children[i].style.display = "none";
				}
			}
		}
	}
	
	this.addTask = function()
	{
		// Create flag for project name
		var found;
	
		// Make sure name block is filled
		if (validate('newtask'))
		{		
			// Create new task
			var newTask = new Task();
		
			// Assign values to new task
			newTask.name = document.getElementById('newtask').value;
			newTask.priority = document.getElementById('priority').value;
			newTask.due = document.getElementById('duedate').value;
			
			// Default value of project is Misc.
			if (document.getElementById('project').value != "")
			{
				newTask.project = document.getElementById('project').value;
			}
			else
			{
				newTask.project = "Miscellaneous";
			}
		
			// Check to see if project exists
			found = false;
			for (i = 0; i < projects.length; i++)
			{
				if (projects[i].name == newTask.project)
				{
					projects[i].tasks.push(newTask);
					found = true;
				}
			}
			
			// If project does not exist, create it
			if (!found)
			{
				projects.push(new Project(newTask.project));
				
				// And push the new element to the project
				projects[projects.length - 1].tasks.push(newTask);
			}
		
			// Clear all inputs
			clearFields();
			
			// Update the display
			displayList();
		}
		else
		{
			// Alert user that task is unnamed
			alert("Your task needs a name!");
		}
	}

	this.removeCheckedTasks = function()
	{
		// Save all unchecked tasks
		this.saveAll();
		
		// Restore tasks
		this.restoreAll();
	}
		
	this.saveAll = function()
	{
		// Create list to hold all inputs
		var checkboxes = document.getElementsByTagName('input');
		
		// Create a list to hold all unchecked checkboxes
		var unchecked = [];
		
		// Create a list to hold all tasks
		var tempList = [];
		
		// Iterate through checkboxes
		for (i = 0; i < checkboxes.length; i++)
		{
			if (checkboxes[i].type == "checkbox" && !checkboxes[i].checked)
			{
				// Push to unchecked if unchecked
				unchecked.push(checkboxes[i].parentNode);
			}
		}
		
		// Iterate through checked list elements
		for (i = 0; i < unchecked.length; i++)
		{
			// Iterate through projects
			for (j = 0; j < projects.length; j++)
			{
				// Iterate through tasks
				for (k = 0; k < projects[j].tasks.length; k++)
				{
					// If task is unchecked . . .
					if (projects[j].tasks[k].idNum == unchecked[i].id)
					{
						// . . . Push the task to the list to be saved
						tempList.push(projects[j].tasks[k]);
					}
				}
			}
		}
		
		// Store data as JSON in local storage
		localStorage.setItem("tdlist", JSON.stringify(tempList));
	}
	
	this.restoreAll = function()
	{
		// Parse saved data and store in list
		var list = JSON.parse(localStorage.getItem("tdlist"));
		
		// Empty the projects list
		projects = [];
		
		// Add items back into project list
		for (i = 0; i < list.length; i++)
		{
			// Check to see if project exists
			var found = false;
			for (j = 0; j < projects.length; j++)
			{
				// If it does, push task to project
				if (projects[j].name == list[i].project)
				{
					projects[j].tasks.push(list[i]);
					found = true;
				}
			}
			
			// If project does not exist, create it
			if (!found)
			{
				projects.push(new Project(list[i].project));
				
				// And push the new element to the project
				projects[projects.length - 1].tasks.push(list[i]);
			}
		}
		
		// Update the display
		displayList();
	}
}