const LIST          = document.querySelector('.tasks');
const ADD_TASK      = document.querySelectorAll('.addButton');
const EDIT_TASK     = document.querySelectorAll('.editButton');
const CHECK_TASK    = document.querySelectorAll('.checkButton');
const SEARCH_TASK   = document.getElementById('searchButton');
const INPUT_TASK    = document.getElementById('addTask');
const REMOVE_ALL    = document.getElementById('removeAll');

const ALL_TASKS     = document.getElementById('all');
const ACTIVE_TASKS  = document.getElementById('active');
const DONE_TASKS    = document.getElementById('done');

let date            = undefined;
let filteredTasks   = [];
let tasks           = [];
let id              = 1;
let showMessage     = false;

window.addEventListener('DOMContentLoaded', function() {
    showDate();
    showTasks();
    getTheme();
});

//---
ADD_TASK.forEach(el => {
    el.onclick = function() {
        addTask();
    }
});

//EDIT, REMOVE e CHECK
LIST.onclick = function(e) {
    if (e.target.classList.contains('editButton')) {
        const PREVIOUS_VALUE = e.target.previousElementSibling.value;
        e.target.previousElementSibling.disabled = false;
        e.target.previousElementSibling.focus();
        e.target.parentElement.children[0].style.backgroundColor = '#FFC353'; //edit flag
        e.target.parentElement.children[0].classList.add('edit');

        e.target.parentElement.children[0].onclick = function() {
            if(e.target.previousElementSibling.disabled === true) return;

            e.target.parentElement.children[0].style.backgroundColor = '#82868B';
            e.target.parentElement.children[0].classList.remove('edit');
            editTask();
        }

        e.target.previousElementSibling.onkeydown = function(event) {
            if(event.key === 'Enter')  {
                e.target.parentElement.children[0].style.backgroundColor = '#82868B';
                editTask(PREVIOUS_VALUE);
            }
        }
    } else if(e.target.classList.contains('removeButton')) {
        e.target.parentElement.remove();
        removeFromStorage(Number(e.target.parentElement.children[1].dataset.id));
        filteredTasks.splice(filteredTasks.findIndex(obj => obj.id === Number(e.target.parentElement.children[1].dataset.id)), 1);
        tasksAmount(filteredTasks);

        if(filteredTasks.length === 0 && tasks.length !== 0) createText('Nenhuma Tarefa ....');
    
    } else if(e.target.classList.contains('checkButton')) {
        doneTask(e);
    } else {
        return;
    }

    function editTask() {
        const CURRENT_VALUE = e.target.previousElementSibling.value;
        const ID = Number(e.target.previousElementSibling.dataset.id);
    
        e.target.previousElementSibling.disabled = true;
        tasks.splice(tasks.findIndex(obj => obj.id === ID), 1, {id: ID, nome: CURRENT_VALUE, status: 'ativo'});
        addToStorage(tasks);
        console.log('Tarefa editada com sucesso!'); 
    }
}

REMOVE_ALL.onclick = function removeTasks() {
    LIST.innerHTML = '';
    tasks = filteredTasks = [];

    createText('Nenhuma Tarefa ....');
    removeAllFromStorage();
}

INPUT_TASK.onkeydown = function(event) {
    event.key === 'Enter' && INPUT_TASK.id == 'searchTask' ? searchTask() : (event.key === 'Enter' && INPUT_TASK.id == 'addTask' ? addTask() : null);
}

SEARCH_TASK.onclick = function() {
    searchTask();
}

ALL_TASKS.onclick = function() {
    if(!JSON.parse(localStorage.getItem('Tarefas'))) return;

    LIST.innerHTML = '';
    showTasks();
}

ACTIVE_TASKS.onclick = function() {
    if(!JSON.parse(localStorage.getItem('Tarefas'))) return;

    filterTasks('ativo');
    show(filteredTasks);
    tasksAmount(filteredTasks);
}

DONE_TASKS.onclick = function() {
    if(!JSON.parse(localStorage.getItem('Tarefas'))) return;

    filterTasks('completa');
    show(filteredTasks);
    tasksAmount(filteredTasks);
}

//---
function addTask() {
    if(INPUT_TASK.value === '') {
        alert('Insira uma tarefa');
    } else {
        if(INPUT_TASK.id === 'searchTask') INPUT_TASK.id = 'addTask';

        if(localStorage.getItem('Tarefas')) {
            tasks = JSON.parse(localStorage.getItem('Tarefas'));
        } else if(document.querySelector('.noTask')) {
            document.querySelector('.noTask').remove(); 
            showMessage = false;   
        }

        tasks.push(
            {
                id: id,
                nome: INPUT_TASK.value,
                status: 'ativo'
            }
        )

        createElements(INPUT_TASK.value, id);
        addToStorage(tasks);
        id++;
    }
}

function searchTask() {
    INPUT_TASK.id = 'searchTask';
    
    if((!localStorage.getItem('Tarefas') && !showMessage) && document.querySelector('.noTask')) {
        document.querySelector('.noTask').remove();
        createText('Nenhuma Tarefa Encontrada ....');
        return;
    }

    const BOX = document.querySelectorAll('.tasks .box');

    tasks = JSON.parse(localStorage.getItem('Tarefas'));

    BOX.forEach(el => {
        if(el.children[1].value.toLowerCase().indexOf(INPUT_TASK.value.toLowerCase()) !== -1) {
            el.style.display = 'flex';
        } else {
            el.style.display = 'none';   
        }
    });

    tasksAmount(tasks);
}

function doneTask(e) {
    const ID = Number(e.target.parentElement.children[1].dataset.id);
    const CURRENT_VALUE = e.target.parentElement.children[1].value;

    if(!e.target.parentElement.children[0].classList.contains('checked')) {
        e.target.parentElement.children[0].classList.add('checked');
        e.target.parentElement.children[0].style.backgroundColor = '#CEFD89';
        tasks.splice(tasks.findIndex(obj => obj.id === ID), 1, {id: ID, nome: CURRENT_VALUE, status: 'completa'});
        addToStorage(tasks);
    } else {
        e.target.parentElement.children[0].classList.remove('checked');
        e.target.parentElement.children[0].style.backgroundColor = '#82868B';
        tasks.splice(tasks.findIndex(obj => obj.id === ID), 1, {id: ID, nome: CURRENT_VALUE, status: 'ativo'});
        addToStorage(tasks);
    }
}

function showTasks() {
    if(!JSON.parse(localStorage.getItem('Tarefas'))) {
        createText('Nenhuma Tarefa ....');
        return;
    } else {
        tasks = JSON.parse(localStorage.getItem('Tarefas'));
    }

    show(tasks);

    id = tasks.reduce((a, b) => {
        return a.id > b.id ? a.id : b.id;
    });
    id++;

    tasksAmount(tasks);  
};

function show(array) {
    array.forEach(el => {
        createElements(el.nome, el.id);
    });
}

function filterTasks(statusValue) {
    filteredTasks = JSON.parse(localStorage.getItem('Tarefas')).filter((val) => {
        return val.status === statusValue;
    });

    if(!filteredTasks) return;

    LIST.innerHTML = '';
}

function createText(txt) {
    const SPAN = document.createElement('span');

    SPAN.className = 'noTask';
    SPAN.classList.add('show');
    SPAN.appendChild(document.createTextNode(txt));
    LIST.appendChild(SPAN);
}

function createElements(val, id) {
    const BOX           = document.createElement('div');
    const TASK          = document.createElement('input');
    const CHECK_BUTTON  = document.createElement('span');
    const EDIT_BUTTON   = createSVG('http://www.w3.org/2000/svg', '0 0 512 512', 'editButton', 'M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z');
    const REMOVE_BUTTON = createSVG('http://www.w3.org/2000/svg', '0 0 320 512', 'removeButton', 'M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z');

    BOX.className           = 'box';
    CHECK_BUTTON.className  = 'checkButton';
    TASK.className          = 'task';
    TASK.type               = 'text';
    TASK.disabled           = true;
    TASK.value              = val;
    TASK.setAttribute('data-id', String(id));
    
    BOX.appendChild(CHECK_BUTTON);
    BOX.appendChild(TASK);
    BOX.appendChild(EDIT_BUTTON);
    BOX.appendChild(REMOVE_BUTTON);
    LIST.appendChild(BOX);

    function createSVG(xmlsValue, viewBoxValue, className, pathValue) {
        const SVG   = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const PATH  = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
        SVG.setAttribute('xmlns', xmlsValue);
        SVG.setAttribute('viewBox', viewBoxValue);
        SVG.setAttribute('class', className);
        PATH.setAttribute('d', pathValue);
        SVG.appendChild(PATH);
    
        return SVG;
    }
}

function addToStorage(task) {
    localStorage.setItem('Tarefas', JSON.stringify(task));
    tasksAmount(task);
}

function removeFromStorage(id) {
    tasks.splice(tasks.findIndex(obj => obj.id === id), 1);

    if(tasks.length === 0) {
        localStorage.removeItem('Tarefas');
        createText('Nenhuma Tarefa ....');
        tasksAmount(tasks);
        return;
    }
    
    addToStorage(tasks);
    tasksAmount(tasks);
}

function removeAllFromStorage() {
    localStorage.removeItem('Tarefas');
    tasksAmount(tasks);
}

function tasksAmount(array) {
    document.getElementById('amount').innerText = array.length === 0 ? 0 : array.length;
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