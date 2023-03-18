const ADD_TASK = document.querySelectorAll('.addButton');
const REMOVE_TASK = document.querySelectorAll('.removeButton');
const CHECK_TASK = document.querySelectorAll('.checkButton');
const SEARCH_TASK = document.getElementById('searchButton');
const INPUT_TASK = document.getElementById('addTask');
const LIST = document.querySelector('.tasks');

const REMOVE_ALL = document.getElementById('removeAll');
const ALL_TASKS = document.getElementById('all');
const ACTIVE_TASKS = document.getElementById('active');
const DONE_TASKS = document.getElementById('done');

const AMOUNT = document.getElementById('amount');
const ITEM = document.querySelector('.bottom .row:last-child .item');

let tasks = [];





/* ITEM.onclick = function(e) {
    if(e.target.classList.contains('selected')) {
        e.target.classList.remove('selected');
        e.target.style.color = '#ECECEC98';
    } else {
        e.target.classList.add('selected'); 
        e.target.style.color = '#FFF';
    }
    console.log(e.target.parentElement.children[2].className);
} */

ADD_TASK.forEach(el => {
    el.onclick = function addTask() {
        if(INPUT_TASK.value == '') {
            alert('Insira uma tarefa');
        } else {
            if(localStorage.getItem('Tarefas') !== null) {
                tasks = JSON.parse(localStorage.getItem('Tarefas'));
            }
            
            createElements(INPUT_TASK.value);
            tasks.push(INPUT_TASK.value);
            addToStorage(tasks);
        }
    }
});

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
    removeAllFromStorage();
}

window.onload = function showTasks() {
    const TASKS = JSON.parse(localStorage.getItem('Tarefas'));
    if(!TASKS) return; //Quando não há nada no local
    
    TASKS.forEach(el => {
        createElements(el);
    }); 
    tasksAmount();
};

function selectOption(el) {

    if(el.classList.contains('selected')) {
        el.classList.remove('selected');
        el.style.color = '#FFF';

    } else {
        el.classList.add('selected');
        el.style.color = 'red';
    }
}

function createElements(val) {
    const BOX = document.createElement('div');
    const CHECK_BUTTON = document.createElement('span');
    const TASK = document.createElement('div');
    const SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const PATH = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    BOX.className = 'box';
    CHECK_BUTTON.className = 'checkButton';
    TASK.className = 'task';
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
    localStorage.removeItem('Tarefa');
    tasksAmount();
}

function tasksAmount() {
    AMOUNT.innerText = JSON.parse(localStorage.getItem('Tarefas')).length;
}