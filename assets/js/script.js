// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {

}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskcard = $('<div>')
        .addClass('card task-card draggable my-3')
        .attr('data-task-id', task.id);

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    const taskName = $('#taskName').val();
    if (taskName.trim() !== "") {
        console.log("New task added:" + taskName);
        $('#taskName').val('');

        $('#formModal').modal('hide');
    } else {
        alert("Please enter a task name!")
    }
}

function openModal() {
    $('#openFormModal').on('click', function () {
        $('#formModal').modal('show');
    });

    $('#saveTaskButton').on('click', function(){
        handleAddTask();
    });
};


$("#datepicker").datepicker();





// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    openModal();

});
