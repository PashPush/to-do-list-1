'use strict';


const refreshAll = () => {
  getTaskList();
  getArchiveList();
  getNotes();
  getStars();
}

window.onload = function(){
  refreshAll();
}

const getFullObject = (id) => {
  return JSON.parse(localStorage.getItem(id));
}

const getSortedKeys = () => {
  let keysOfStorage = Object.keys(localStorage);
  return keysOfStorage.sort().reverse();
}

const getField = (field, id) => {
  let obj = getFullObject(id);
  if (obj) {
    return obj[field];
  }
  else {
    setState('currentTaskId', getOneId());
    if (getState('currentTaskId')) {
      obj = getFullObject(id);
      return obj[field];
    }
    else {
      return '';
    }
  }
}

const getOneId = () => {
  let keysOfStorage = getSortedKeys();
  if (keysOfStorage.length <= 1) return false;
  for (let key of keysOfStorage) {
    if (key === 'state') continue;
    let oneTask = getFullObject(key);
    if (oneTask.id && !oneTask.dateCompleted) {
      return oneTask.id;
    }
  }
}

const deleteTask = (id) => {
  localStorage.removeItem(id);
  if (id == getState('currentTaskId')) {
    setState('currentTaskId', getOneId());
  }
  refreshAll();
}

const emptyListHandler = () => {
  let activeTasks = tasks.children.length;
  setState('activeTasks', activeTasks);
  if (activeTasks === 0) {
    tasks.innerHTML = "There are no tasks.<br>The very time to add few :)";
    added.parentNode.classList.add('display-none');
    completed.parentNode.classList.add('display-none');
  } else {
    added.parentNode.classList.remove('display-none');
    completed.parentNode.classList.remove('display-none');
  }
}

//// SHOW Added & Completed dates

let added = document.querySelector('.added');
let completed = document.querySelector('.completed');

const getAddedAndCompleted = () => {
  if(!getState('currentTaskId')) {
    added.parentNode.classList.add('display-none');
    completed.parentNode.classList.add('display-none');
  }
  let thisTask = getFullObject(getState('currentTaskId'));
  if (!thisTask) return;
  let dateAdded = new Date(thisTask.dateAdded);
  added.innerHTML = `${dateAdded.toLocaleDateString()} at ${dateAdded.toLocaleTimeString("ru", { hour12: false })}`;
  if (thisTask.dateCompleted) {
    added.parentNode.classList.remove('display-none');
    completed.parentNode.classList.remove('display-none');
    
    let dateCompleted = new Date(thisTask.dateCompleted);
    completed.innerHTML = `${dateCompleted.toLocaleDateString()} at ${dateCompleted.toLocaleTimeString("ru", { hour12:  false })}`;
  }
  else {
    completed.parentNode.classList.add('display-none');
    completed.innerHTML = '';
  }
}


//// NOTES


let completeBtn = document.querySelector('.completeBtn');
let notes = document.querySelector('.notes');

const getNotes = () => {
  notes.value = '';
  if (getState('activeTasks') > 0) { 
    notes.disabled = false;
    completeBtn.addEventListener('click', completeTask);
    notes.addEventListener('input', () => {
      let fullObject = getFullObject(getState('currentTaskId'));
      fullObject.note = notes.value;
      localStorage.setItem(getState('currentTaskId'), JSON.stringify(fullObject))});
  } else {
    notes.disabled = true;
  }
  getAddedAndCompleted();
  if (getState('currentTaskId')) {
    notes.value = getField('note', getState('currentTaskId'));
  }
  else {
    notes.value = '';
  }
}

const getTaskList = () => {       
  tasks.innerHTML = '';
  let keysOfStorage = getSortedKeys();
  for (let key of keysOfStorage) {
    if (key === 'state') continue;
    let oneTask = getFullObject(key);
    if (oneTask.dateCompleted) continue;
    let liTask = document.createElement('li');
    if (oneTask.id === getState('currentTaskId')) liTask.classList.add('selected');
    let isActiveStar = (getField('priority', oneTask.id)) ? 'active' : '';
    liTask.dataset.id = oneTask.id;
    liTask.innerHTML = `${oneTask.name}<p>
        <span class="star ${isActiveStar}" onclick="changePriority('${oneTask.id}')">★</span>
        <span class="del" onclick="deleteTask('${oneTask.id}')">☒</span></p>`;
    tasks.append(liTask);
  }
  emptyListHandler();
}

//// Archive list sorted by date of complete

const compareDates = (a, b) => {
  let dateA = new Date(a.dateCompleted);
  let dateB = new Date(b.dateCompleted);
 
  return dateB - dateA;
}

const getArchiveList = () => {  
  archive.innerHTML = '';
  let tasksArr = [];
  let keysOfStorage = Object.keys(localStorage);
  for (let key of keysOfStorage) {
    if (key === 'state') continue;
    let oneTask = getFullObject(key);
    if (!oneTask.dateCompleted) continue;
    tasksArr.push(oneTask);
  }
  tasksArr.sort(compareDates);
  for (let task of tasksArr) {
    let liTask = document.createElement('li');
    if (task.id === getState('currentTaskId')) liTask.classList.add('selected');
    liTask.dataset.id = task.id;
    let dateHere = new Date(task.dateCompleted);
    const dateFormat = () => {
      let day = ('0' + (dateHere.getDate())).slice(-2);
      let month = ('0' + (dateHere.getMonth() + 1)).slice(-2);
      return day + '.' + month;
    }
    liTask.innerHTML = `${task.name}<p><span class="completeDate">${dateFormat()}</span><span class="del" onclick="deleteTask('${task.id}')">☒</span></p>`;
    archive.append(liTask);
  }
}
