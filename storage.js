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
  // here I use FOR because of RETURN that must abort the function
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
  return JSON.parse(readFromStorage(id));
}

const getSortedKeys = () => {
  const keysOfStorage = Object.keys(localStorage).filter((key) => key != 'state');
  return keysOfStorage.sort((a, b) => {return parseInt(b) - parseInt(a)});
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
  if (!confirm('Do you really want to delete this task?')) {
    return;
  }
  localStorage.removeItem(id);
  if (id === getState('currentTaskId')) {
    changeCurrentTaskId();
  }
  refreshAll();
}

const editTaskName = (event) => {
  const parentLi = event.target.parentNode.parentElement;
  const oldName = parentLi.childNodes[0].data;

  parentLi.innerHTML = `<input type='text' value='${oldName}' class='editInput' />
  <p class='okCancel'><button class="editBtn okBtn">OK</button>
  <button class="editBtn" onclick='refreshAll()'>Cancel</button></p>`;
}

const getEditListener = () => {
  const editableTask = document.querySelector('.editable');
  if(editableTask) {
    editableTask.addEventListener('click', (event) => {
      editTaskName(event);  

      const thisEditInput = document.querySelector('.editInput');
      const end = thisEditInput.value.length;
      thisEditInput.setSelectionRange(end, end);
      thisEditInput.focus();

      thisEditInput.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') {
          return;
        }
        setField(getState('currentTaskId'), 'name', thisEditInput.value);
        refreshAll();
      })

      const okBtn = document.querySelector('.okBtn');
      okBtn.addEventListener('click', () => {
        setField(getState('currentTaskId'), 'name', thisEditInput.value);
        refreshAll();
      } )
    });
  }  
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

const readFromStorage = (id) => {
  try {
    return localStorage.getItem(id);
  }
  catch (e) {
    throw new Error(`Couldn't read from storage: ${e}`);
  }
}

const setField = (id, key, value) => {
  const fullObj = JSON.parse(localStorage[id]);
  fullObj[key] = value;
  localStorage[id] = JSON.stringify(fullObj);
}

const setPriorityState = (value) => {
  setField('state', 'priorityOrder', value);
}