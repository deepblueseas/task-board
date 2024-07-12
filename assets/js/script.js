// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;


console.log("Initial taskList:", taskList);
console.log("Initial nextId:", nextId);

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let task = nextId;
    nextId++; // ++ is the increment operator
    localStorage.setItem('nextId', JSON.stringify(nextId));
    return task;
};

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);

    //builds out the look of the new task cards
    const cardHeader = $('<div>').addClass('card-header h4').text(task.taskName);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.taskDescription);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);

    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        .attr('data-task-id', task.id);

    cardDeleteBtn.on('click', handleDeleteTask);

    //puts the card together
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;

};

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    console.log("Rendering taskList:", taskList);
    taskList.forEach(task => {
        console.log("Processing task:", task);
        const taskCard = createTaskCard(task);

        // Correct any status typos here
        if (task.status === 'to-do') {
            task.status = 'todo';
        }

        switch (task.status) {
            case 'todo':
                $('#todo-cards').append(taskCard);
                break;
            case 'in-progress':
                $('#in-progress-cards').append(taskCard);
                break;
            case 'done':
                $('#done-cards').append(taskCard);
                break;
            default:
                console.error("Unknown task status:", task.status);
        }
    });

    $('.draggable').draggable({
        revert: "invalid",
        start: function() {
            $(this).addClass('dragging');
        },
        stop: function() {
            $(this).removeClass('dragging');
        }
    });

    $('.droppable').droppable({
        accept: '.draggable',
        drop: handleDrop
    });
};

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const taskName = $('#taskName').val();
    const taskDescription = $('#taskDescription').val().trim();
    const dueDate = $('#datepicker').val().trim();

    if (taskName.trim() !== "") {
        //building out the new-task object
        //this mirrors the new task-card and fields we can fill in in the modal
        const task = {
            id: generateTaskId(),
            taskName: taskName,
            taskDescription: taskDescription,
            dueDate: dueDate,
            status: 'todo',
        };

        // add the new task to our array to saved objects in local storage with .push
        taskList.push(task);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        console.log("New taskList after adding:", taskList);

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
    console.log("TaskList after deletion:", taskList);
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
    event.preventDefault();
    const taskId = ui.draggable.data('task-id');
    const newStatus = $(this).attr('id').replace('-cards', '');

    const task = taskList.find(task => task.id == taskId);
    if (task) {
        task.status = newStatus;
        localStorage.setItem('tasks', JSON.stringify(taskList));
        renderTaskList();
    }

};

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    openModal();

    // initialize datepicker
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
    });

    //make lanes draggable/accept items dragged into them
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    }); 

    // making each of the cards draggable and change their status based on lane/category
    $('#todo-cards').addClass('droppable').data('status', 'todo');
    $('#in-progress-cards').addClass('droppable').data('status', 'in-progress');
    $('#done-cards').addClass('droppable').data('status', 'done');
    renderTaskList();

    function openModal() {
        $('#openFormModal').on('click', function () {
            $('#formModal').modal('show');
        });

    }

    $('#saveTaskBtn').on('click', handleAddTask);
    });

