// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


// Todo: create a function to generate a unique task id
function generateTaskId() {
    let newtaskId = nextId;
    nextId++; // ++ is the increment operator
    localStorage.setItem('nextId', JSON.stringify(nextId));
    return newtaskId;
};

// the below would be used in alternate way to delete task function
// function readTaskListFromStorage(){
//     let tasks = JSON.parse(localStorage.getItem('tasks'));

//     if (!tasks) {
//         tasks = [];
//     }
//     return tasks;
// }

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);

    const cardHeader = $('<div>').addClass('card-header h4').text(task.taskName);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.taskDescription);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);

    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);

    cardDeleteBtn.on('click', handleDeleteTask);

    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.forEach(task => {
        const taskCard = createTaskCard(task);
        $('#todo-cards').append(taskCard);
    });

    $('.draggable').draggable({
        revert: "invalid"
    });

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    // event.preventDefault();

    const taskName = $('#taskName').val();
    const taskDescription = $('#taskDescription').val().trim();
    const dueDate = $('#datepicker').val().trim();

    if (taskName.trim() !== "") {
        const newTask = {
            id: generateTaskId(),
            taskName: taskName,
            taskDescription: taskDescription,
            dueDate: dueDate
        };

        console.log("New task added:" + taskName);
        console.log("Description: " + taskDescription);
        console.log("Due Date: " + dueDate);

        // add the new task to our array to saved objects in local storage with .push
        taskList.push(newTask);
        localStorage.setItem('tasks', JSON.stringify(taskList));

        renderTaskList();

        // sets these fields back to empty after new task is saved/submitted
        $('#taskName').val('');
        $('#taskDescription').val('');
        $('#datepicker').val('');
        $('#formModal').modal('hide');
    } else {
        alert("Please enter a task name!");
    }
};

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    const taskId = $(event.target).attr('data-task-id');
    taskList = taskList.filter(task => task.id !=taskId);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    renderTaskList();

// this could also have been written as:
// const taskId = $(this).attr('data-project-id');
// const taskList = readTaskListFromStorage();
// tasks.forEach((task => {
//     if (task.id === taskId) {
//         tasks.splice(tasks.indexOf(project), 1);
//     }
// }))

};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('task-id');
    const newStatus = $(this).attr('id');

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    openModal();

    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
    });

    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });

    function openModal() {
        $('#openFormModal').on('click', function () {
            $('#formModal').modal('show');
        });

    }

    $('#saveTaskBtn').on('click', function () {
        handleAddTask();
    });
});
