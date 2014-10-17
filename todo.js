function Task(name, priority, due, project)
{
	this.name = name;
	this.priority = priority;
	this.due = due;
	this.project = project;
	
	this.idNum = 0;
}


function TaskList()
{
	var list = [];
	var idCount = 0;

	var displayList = function()
	{
		// Create task variables
		var item, due, priority;
		
		// Create project variables
		var projects = [], found;
		var projItem, projSpan;
		
		// Clear previous list
		document.querySelector('#list ul').innerHTML = "";
		
		// Iterate through task list
		for (i = 0; i < list.length; i++)
		{
			// Format due date
			if (list[i].due == "") {
				due = "";
			} else {
				due = "[Due: " + list[i].due + "] ";
			}
			
			// Format priority
			priority = "[" + list[i].priority.toUpperCase() + "] ";
		
			// Create task list element
			item = document.createElement('li');
			item.className = list[i].priority;
			item.id = list[i].idNum;
			item.innerHTML = '<input type="checkbox" onclick="toDoList.crossOut(this);">' + priority + due + list[i].name;
		
			// Display element under the appropriate project
			found = false;		// Assume not found
			for (j = 0; j < projects.length; j++)
			{
				// Append item to existing project
				if (list[i].project == projects[j].childNodes[2].innerText)		// Check third child. This skips the button and the extra space.
				{
					projects[j].appendChild(item);
					found = true;
					break;
				}
			}
			
			// If project was not found, create it
			if (!found)
			{
				// Create project element
				projItem = document.createElement('li');
				projItem.className = "project";																 // v-- Must be a space here
				projItem.innerHTML = '<button onclick="toDoList.toggleChildren(this)">Hide all tasks in</button> <span>' + list[i].project + '</span>';
				
				// Push project element to project list
				projects.push(projItem);
				
				// Append item to new project
				projItem.appendChild(item);
				
				// Append project to list
				document.querySelector('#list ul').appendChild(projItem);
			}
			
		}
	}
	
	var clearFields = function()
	{
		// Reset all fields to default
		document.getElementById('newtask').value = "";
		document.getElementById('duedate').value = "";
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
			// If the child is a task, which is indicated by a priority class
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
		
		// Also change the button text based on context
		if (item.innerText == "Hide all tasks in")
		{
			item.innerText = "Show all tasks in";
		}
		else
		{
			item.innerText = "Hide all tasks in";
		}
	}
	
	this.addTask = function(name, dueDate, priority, project)
	{
		// Create flag for project name
		var found;
	
		// Make sure name block is filled
		if (document.getElementById('newtask').value != "")
		{		
			// Create new task
			var newTask = new Task();
		
			// Assign values to new task
			newTask.name = name;
			newTask.priority = priority;
			newTask.due = dueDate;
			
			// Default value of project is Misc.
			if (project != "")
			{
				newTask.project = project;
			}
			else
			{
				newTask.project = "Miscellaneous";
			}
			
			// Give task an id number
			newTask.idNum = idCount;
			idCount += 1;
			
			// Add task to list
			list.push(newTask);
		
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
		// Get list of all inputs
		var inputs = document.getElementsByTagName('input');
		
		// Create a list to store all checked IDs
		var checked = []
		
		// Iterate through list of inputs
		for (i = 0; i < inputs.length; i++)
		{
			// If checkbox is checked, push its parents ID to a list
			if (inputs[i].checked)
			{
				checked.push(inputs[i].parentNode.id);
			}
		}

		// Iterate through list of ids
		for (i = 0; i < checked.length; i++)
		{
			// Iterate through list of tasks
			for (j = 0; j < list.length; j++)
			{
				// If ID of list element matches checked id
				if (list[j].idNum == checked[i])
				{
					// Splice checked task from list
					list.splice(j, 1);
					
					// Break from inner loop because IDs are unique
					break;
				}
			}
		}
		
		// Refresh the display
		displayList();
	}

	this.saveAll = function()
	{
		// Create list to hold all inputs
		var checkboxes = document.getElementsByTagName('input');
		
		// Create a list to hold all unchecked ids
		var unchecked = [];
		
		// Create a list to hold all tasks
		var saveList = [];
		
		// Iterate through checkboxes
		for (i = 0; i < checkboxes.length; i++)
		{
			if (checkboxes[i].type == "checkbox" && !checkboxes[i].checked)
			{
				// Push to unchecked if unchecked
				unchecked.push(checkboxes[i].parentNode.id);
			}
		}
		
		// Iterate through checked list elements
		for (i = 0; i < unchecked.length; i++)
		{
			// Iterate through projects
			for (j = 0; j < list.length; j++)
			{
				// If task is unchecked . . .
				if (list[j].idNum == unchecked[i])
				{
					// . . . Push the task to the list to be saved
					saveList.push(list[j]);
					
					// . . . And break from inner loop because each task has a unique id
					break;
				}
			}
		}

		// Store data as JSON in local storage
		localStorage.setItem("tdlist", JSON.stringify(saveList));
	}
	
	this.restoreAll = function()
	{
		// Parse saved data and store back in list
		list = JSON.parse(localStorage.getItem("tdlist"));
		
		// Reset ID count
		idCount = 0;
		
		// Iterate through list
		for (i = 0; i < list.length; i++)
		{
			// Give each task a new ID
			list[i].idNum = idCount;
			
			// Increment ID counter
			idCount += 1;
		}
		
		// Update the display
		displayList();
	}
}