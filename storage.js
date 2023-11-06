'use strict';


if (!localStorage.getItem('state')) {
  const primalState = { 'nextTaskId' : '0T', 'activeTasks' : 0 };
  localStorage.setItem('state', JSON.stringify(primalState));
}

const setState = (key, value) => {
  let fullObj = JSON.parse(localStorage.state);
  fullObj[key] = value;
  localStorage.state = JSON.stringify(fullObj);
}
const getState = (key) => {
  let fullObj = JSON.parse(localStorage.state);
  return fullObj[key];
}

let addNew = document.querySelector('.add');
addNew.addEventListener('submit', (event) => {
  event.preventDefault();
  addNewTask(event)});

let task = document.querySelector('.task');

const addNewTask = (event) => {
  if (!task.value) {
    event.preventDefault(); 
    return;
  }
  let taskSample = {
    name : task.value,
    note : '',
    dateAdded : new Date(),
    dateCompleted : '',
    priority : false,
    rate : 0,
    id : JSON.parse(localStorage.state).nextTaskId,
  }
  let newId = getState('nextTaskId');
  localStorage.setItem(newId, JSON.stringify(taskSample));
  setState('currentTaskId', newId);
  setState('nextTaskId', `${parseInt(newId) + 1}T`);
  location.reload(); // RELOAD
}


///// not necessary
// const setField = (key, value, id) => {
//   let fullObj = JSON.parse(localStorage[id]);
//   fullObj[key] = value;
//   localStorage[id] = JSON.stringify(fullObj);
// }
