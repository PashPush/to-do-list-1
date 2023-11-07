'use strict';


const setState = (key, value) => {
  const fullObj = JSON.parse(localStorage.state);
  fullObj[key] = value;
  localStorage.state = JSON.stringify(fullObj);
}
const getState = (key) => {
  const fullObj = JSON.parse(localStorage.state);
  return fullObj[key];
}

const addNew = document.querySelector('.add');
addNew.addEventListener('submit', (event) => {
  event.preventDefault();
  addNewTask(event)});

  
const addNewTask = (event) => {
  const taskInput = document.querySelector('.task');
  if (!taskInput.value) {
    event.preventDefault(); 
    return;
  }
  const taskSample = {
    name : taskInput.value,
    note : '',
    dateAdded : new Date(),
    dateCompleted : '',
    priority : false,
    rate : 0,
    id : JSON.parse(localStorage.state).nextTaskId,
  }
  const newId = getState('nextTaskId');
  writeInStorage(newId, JSON.stringify(taskSample));
  setState('currentTaskId', newId);
  setState('nextTaskId', `${parseInt(newId) + 1}T`);
  taskInput.value = '';
  refreshAll();
}

const writeInStorage = (id, value) => {
  try {
    localStorage.setItem(id, value);
  }
  catch (e) {

  }
}

const setField = (key, value, id) => {
  const fullObj = JSON.parse(localStorage[id]);
  fullObj[key] = value;
  localStorage[id] = JSON.stringify(fullObj);
}
