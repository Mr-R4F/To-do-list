const ADD_TASK      = document.querySelectorAll('.addButton');
const EDIT_TASK     = document.querySelectorAll('.editButton');
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
            if(localStorage.getItem('Tarefas') !== null) {
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

//edit e remove
LIST.onclick = function(e) {
    if (e.target.classList.contains('editButton')) {
        e.target.previousElementSibling.disabled = false;

        e.target.previousElementSibling.onblur = function() {
            e.target.previousElementSibling.disabled = true;
        }
    } else if (e.target.classList.contains('removeButton')) {
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