'use strict';


const refreshAll = () => {
  getTaskList();
  getArchiveList();
  getNotes();
  getStars();
  setSliderPosition();
}

window.onload = function(){
  refreshAll();
}

const getFullObject = (id) => {
  return JSON.parse(localStorage.getItem(id));
}

const getSortedKeys = () => {
  const keysOfStorage = Object.keys(localStorage);
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
  const keysOfStorage = getSortedKeys();
  if (keysOfStorage.length <= 1) return false;
  for (let key of keysOfStorage) {
    if (key === 'state') continue;
    const oneTask = getFullObject(key);
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
  const activeTasks = TASKS.children.length;
  setState('activeTasks', activeTasks);
  if (activeTasks === 0) {
    TASKS.innerHTML = "There are no tasks.<br>The very time to add few :)";
    ADDED.parentNode.classList.add('display-none');
    COMPLETED.parentNode.classList.add('display-none');
  } else {
    ADDED.parentNode.classList.remove('display-none');
    COMPLETED.parentNode.classList.remove('display-none');
  }
}

//// SHOW Added & Completed dates

const ADDED = document.querySelector('.added');
const COMPLETED = document.querySelector('.completed');

const getAddedAndCompleted = () => {
  if(!getState('currentTaskId')) {
    ADDED.parentNode.classList.add('display-none');
    COMPLETED.parentNode.classList.add('display-none');
  }
  const thisTask = getFullObject(getState('currentTaskId'));
  if (!thisTask) return;
  const dateAdded = new Date(thisTask.dateAdded);
  ADDED.innerHTML = `${dateAdded.toLocaleDateString()} at ${dateAdded.toLocaleTimeString("ru", { hour12: false })}`;
  if (thisTask.dateCompleted) {
    ADDED.parentNode.classList.remove('display-none');
    COMPLETED.parentNode.classList.remove('display-none');
    
    const dateCompleted = new Date(thisTask.dateCompleted);
    COMPLETED.innerHTML = `${dateCompleted.toLocaleDateString()} at ${dateCompleted.toLocaleTimeString("ru", { hour12:  false })}`;
  }
  else {
    COMPLETED.parentNode.classList.add('display-none');
    COMPLETED.innerHTML = '';
  }
}


//// NOTES


const COMPLETEBTN = document.querySelector('.completeBtn');
const NOTES = document.querySelector('.notes');

const getNotes = () => {
  NOTES.value = '';
  if (getState('activeTasks') > 0) { 
    NOTES.disabled = false;
    COMPLETEBTN.addEventListener('click', completeTask);
    NOTES.addEventListener('input', () => {
      const fullObject = getFullObject(getState('currentTaskId'));
      fullObject.note = NOTES.value;
      writeInStorage(getState('currentTaskId'), JSON.stringify(fullObject))});
  } else {
    NOTES.disabled = true;
  }
  getAddedAndCompleted();
  if (getState('currentTaskId')) {
    NOTES.value = getField('note', getState('currentTaskId'));
  }
  else {
    NOTES.value = '';
  }
}

const getTaskList = () => {       
  TASKS.innerHTML = '';
  const keysOfStorage = getSortedKeys();
  for (let key of keysOfStorage) {
    if (key === 'state') continue;
    const oneTask = getFullObject(key);
    if (oneTask.dateCompleted) continue;
    const liTask = document.createElement('li');
    if (oneTask.id === getState('currentTaskId')) liTask.classList.add('selected');
    const isActiveStar = (getField('priority', oneTask.id)) ? 'active' : '';
    liTask.dataset.id = oneTask.id;
    liTask.innerHTML = `${oneTask.name}<p>
        <span class="star ${isActiveStar}" onclick="changePriority('${oneTask.id}')">★</span>
        <span class="del" onclick="deleteTask('${oneTask.id}')">☒</span></p>`;
    TASKS.append(liTask);
  }
  emptyListHandler();
}

//// Archive list sorted by date of complete

const compareDates = (a, b) => {
  const dateA = new Date(a.dateCompleted);
  const dateB = new Date(b.dateCompleted);
 
  return dateB - dateA;
}

const dateFormat = (date) => {
      const day = ('0' + (date.getDate())).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      return day + '.' + month;
    }

const getArchiveList = () => {  
  ARCHIVE.innerHTML = '';
  let tasksArr = [];
  const keysOfStorage = Object.keys(localStorage);
  for (let key of keysOfStorage) {
    if (key === 'state') continue;
    const oneTask = getFullObject(key);
    if (!oneTask.dateCompleted) continue;
    tasksArr.push(oneTask);
  }
  tasksArr.sort(compareDates);
  for (let task of tasksArr) {
    const liTask = document.createElement('li');
    if (task.id === getState('currentTaskId')) liTask.classList.add('selected');
    liTask.dataset.id = task.id;
    const dateHere = new Date(task.dateCompleted);
    liTask.innerHTML = `${task.name}<p><span class="completeDate">${dateFormat(dateHere)}</span><span class="del" onclick="deleteTask('${task.id}')">☒</span></p>`;
    ARCHIVE.append(liTask);
  }
}
