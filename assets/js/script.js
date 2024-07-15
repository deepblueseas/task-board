// Retrieve tasks and nextId from localStorage

// the [] assigns tasklist an empty array if there is nothing yet stored in local storage
// if there is no information stored, then the 1 will assign taskID of 1 the first item stored 

// this could have been coded as if (!tasklist) {tasklist=[];} and if (!nextId) {nextid=1;}
// but i think the below looks cleaner

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
        //draggble is a jQuery UI method :)
        .addClass('card task-card draggable my-3')
        //assigning the id to the task
        .attr('data-task-id', task.id);

    //builds out the look of the new task cards
    const cardHeader = $('<div>').addClass('card-header h4').text(task.taskName);
    const cardBody = $('<div>').addClass('card-body');
    const cardDescription = $('<p>').addClass('card-text').text(task.taskDescription);
    const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);

    const cardDeleteBtn = $('<button>')
        .addClass('btn btn-danger delete')
        .text('Delete')
        //makes sure we're deleting the right task w/the corresponding id
        .attr('data-task-id', task.id);

    cardDeleteBtn.on('click', handleDeleteTask);

    //puts the card together by appending children to the parent
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);

    return taskCard;

};

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    //this helps with bugs that occur when moving cards across lanes
    //if not included then cards duplicate in a really fascinating way and do not land properly in their lanes
    //the .empty clears old data (what lane the card was in before dragging for example)
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
    
    // forEach method iterates through each element in an array and in this instance we are running the createtaskcard function on each task in the tasklist
    taskList.forEach(task => {
        const taskCard = createTaskCard(task);

        // Correct any status typos here...this tripped me up for a while trying to pull from local storage
        // i had previously saved array items with to-do, this probably does not matter for my deployed project
        if (task.status === 'to-do') {
            task.status = 'todo';
        }

        // switch statements are awesome (in this instance) "perform different actions based on different conditions" -w3schools
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
                console.error("Unknown task status!", task.status);
        }
    });

    //above we added the attribute draggable to the taskcard div and are applying the jQuery method draggable
    $('.draggable').draggable({
        //if the card is let go of somewhere other than in a lane it bounces back to its original position on the page
        revert: "invalid",
        start: function() {
            // this is referring to the taskcard in this function
            $(this).addClass('dragging');
        },
        stop: function() {
            $(this).removeClass('dragging');
        }
    });

    //.droppable is another jQuery UI method :)
    //this is what allows the lanes to accept our taskcards
    $('.droppable').droppable({
        accept: '.draggable',
        drop: handleDrop
    });
};

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    // getting values input into these fields in the form
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

// this could also have been written as or something very close,
// as we did in the mini project for this week

// const taskId = $(this).attr('data-project-id');
// const taskList = readTaskListFromStorage();
// tasks.forEach((task => {
//     if (task.id === taskId) {
//         tasks.splice(tasks.indexOf(project), 1);
//     }
// }))

//however i do believe a loop/slicing takes up more energy than .filter

};

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    event.preventDefault();
    // getting all the info about the dragged/draggable task and its id
    const taskId = ui.draggable.data('task-id');
    // grab the id of the lane the card was dropped in and replace the previous "..."-card part of the tasks id
    // the initial instance would be 'todo-card'
    // here this refers to the taskcard
    // by doing this we are getting the status only of the card
    // ie: todo, in progress, and complete rather than todo-cards, in-progress-cards etc
    const newStatus = $(this).attr('id').replace('-cards', '');

    // and now we can update the status part of the task const!

    // we are finding the specific task we're modifying by moving and setting its new status in local storage so that it's positon on the page persists
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

    // initialize jQuery datepicker
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
    });

    //make lanes draggable/accept items dragged into them
    // i think i could have made this and the previous droppable part drier...
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    }); 

    // making each of the cards draggable and 'set' their status based on lane/category
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

