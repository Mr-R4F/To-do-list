const ADD_TASK = document.querySelectorAll('.addButton');
const REMOVE_TASK = document.querySelectorAll('.removeButton');
const SEARCH_TASK = document.getElementById('searchButton');
const CHECK_TASK = document.querySelectorAll('.checkButton');
const INPUT_TASK = document.getElementById('addTask');
const LIST = document.querySelector('.tasks');
let tasks = [];

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
    e.target.parentElement.remove();
    removeFromStorage(e);
}

window.onload = showTasks();

function showTasks() {
    const TASKS = JSON.parse(localStorage.getItem('Tarefas'));

    if(!TASKS) return;
    
    TASKS.forEach(el => {
        createElements(el);
    }); 
};

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
    console.log(BOX);
    LIST.appendChild(BOX);   
}

function addToStorage(tasks) {
    localStorage.setItem('Tarefas', JSON.stringify(tasks));
}

function removeFromStorage(e) {
    tasks = JSON.parse(localStorage.getItem('Tarefas'));
    tasks.splice(tasks.indexOf(e.target.previousElementSibling.innerText), 1);
    addToStorage(tasks);
}