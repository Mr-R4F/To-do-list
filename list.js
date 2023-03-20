const ADD_TASK      = document.querySelectorAll('.addButton');
const REMOVE_TASK   = document.querySelectorAll('.removeButton');
const CHECK_TASK    = document.querySelectorAll('.checkButton');
const SEARCH_TASK   = document.getElementById('searchButton');
const INPUT_TASK    = document.getElementById('addTask');
const REMOVE_ALL    = document.getElementById('removeAll');
const ALL_TASKS     = document.getElementById('all');
const ACTIVE_TASKS  = document.getElementById('active');
const DONE_TASKS    = document.getElementById('done');
const LIST          = document.querySelector('.tasks');

let date            = undefined;
let tasks           = [];

window.onload = function() {
    showDate();
    showTasks();
    getTheme();
}

//--
ADD_TASK.forEach(el => {
    el.onclick = function addTask() {
        if(INPUT_TASK.value === '') {
            alert('Insira uma tarefa');
        } else {
            if( localStorage.getItem('Tarefas') !== null) {
                tasks = JSON.parse(localStorage.getItem('Tarefas'));
            }

            createElements(INPUT_TASK.value);
            tasks.push(INPUT_TASK.value);
            addToStorage(tasks);
        }
    }
});

function showTasks() {
    const TASKS = JSON.parse(localStorage.getItem('Tarefas'));

    if(!TASKS) return; //Quando não há nada no local
    
    TASKS.forEach(el => {
        createElements(el);
    }); 
    tasksAmount();
};

/* EDIT_TASK.onclick = function editTask() {

} */

LIST.onclick = function removeTask(e) {
    if(e.target.classList.contains('removeButton')) {
        e.target.parentElement.remove();
        removeFromStorage(e.target.previousElementSibling.innerText);
    } else {
        return;
    }
}

REMOVE_ALL.onclick = function removeTasks() {
    LIST.innerHTML = '';
    tasks = [];
    removeAllFromStorage();
}
//--

function createElements(val) {
    const BOX           = document.createElement('div');
    const CHECK_BUTTON  = document.createElement('span');
    const TASK          = document.createElement('div');
    const SVG           = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const PATH          = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    BOX.className           = 'box';
    CHECK_BUTTON.className  = 'checkButton';
    TASK.className          = 'task';
    TASK.appendChild(document.createTextNode(val));
  
    SVG.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    SVG.setAttribute('viewBox', '0 0 320 512');
    SVG.setAttribute('class', 'removeButton');

    PATH.setAttribute('d', 'M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z');
    SVG.appendChild(PATH);
            
    BOX.appendChild(CHECK_BUTTON);
    BOX.appendChild(TASK);
    BOX.appendChild(SVG);
    LIST.appendChild(BOX);
}

function addToStorage(task) {
    localStorage.setItem('Tarefas', JSON.stringify(task));
    tasksAmount();
}

function removeFromStorage(task) {
    tasks = JSON.parse(localStorage.getItem('Tarefas'));
    tasks.splice(tasks.indexOf(task), 1);
    addToStorage(tasks);
    tasksAmount();
}

function removeAllFromStorage() {
    localStorage.removeItem('Tarefas');
    tasksAmount();
}

function tasksAmount() {
    document.getElementById('amount').innerText = JSON.parse(localStorage.getItem('Tarefas')) === null ? 0 : JSON.parse(localStorage.getItem('Tarefas')).length;
}

function showDate() {
    date            = new Date();
    const DAY       = date.getDate();
    const MONTH     = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const YEAR      = date.getFullYear();
    const HOURS     = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const MINUTES   = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    document.getElementById('day').innerText    = DAY;
    document.getElementById('month').innerText  = MONTH;
    document.getElementById('year').innerText   = YEAR;
    document.getElementById('minute').innerText = MINUTES;
    document.getElementById('hour').innerText   = HOURS;
}

setInterval(showDate, 1000);