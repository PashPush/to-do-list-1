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
const changeCurrentTaskId = (id) => {
  if (!id) {
    setState('currentTaskId', getOneId());
  } else {
    setState('currentTaskId', id);
  }
}

const getOneId = () => {
  const keysOfStorage = getSortedKeys();
  for (let key of keysOfStorage) {
    const oneTask = getFullObject(key);
    if (!oneTask.dateCompleted) {
      return oneTask.id;
    }
  }
  notesDisable(true);
  return false;
}

const getFullObject = (id) => {
  return JSON.parse(localStorage.getItem(id));
}

const getSortedKeys = () => {
  const keysOfStorage = Object.keys(localStorage).filter((key) => key != 'state');
  return keysOfStorage.sort().reverse();
}

const getField = (field, id) => {
  let obj = getFullObject(id);
  if (obj) {
    return obj[field];
  }
  else {
    changeCurrentTaskId();
    if (getState('currentTaskId')) {
      obj = getFullObject(id);
      return obj[field];
    }
    else {
      return '';
    }
  }
}


const deleteTask = (id) => {
  localStorage.removeItem(id);
  if (id === getState('currentTaskId')) {
    changeCurrentTaskId();
  }
  refreshAll();
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
  const newId = getState('nextTaskId');
  const taskSample = {
    name : taskInput.value,
    note : '',
    dateAdded : new Date(),
    dateCompleted : '',
    priority : false,
    rate : 0,
    id : newId,
  }
  writeInStorage(newId, JSON.stringify(taskSample));
  changeCurrentTaskId(newId);
  setState('nextTaskId', `${parseInt(newId) + 1}T`);
  taskInput.value = '';
  refreshAll();
}


const writeInStorage = (id, value) => {
  try {
    localStorage.setItem(id, value);
  }
  catch (e) {
    throw new Error(`Couldn't write in storage: ${e}`);
  }
}

const setField = (key, value, id) => {
  const fullObj = JSON.parse(localStorage[id]);
  fullObj[key] = value;
  localStorage[id] = JSON.stringify(fullObj);
}
