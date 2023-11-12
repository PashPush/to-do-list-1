'use strict';


const refreshAll = () => {
  getTaskList();
  getNotes();
  getStars();
  getArchiveList();
  setSliderPosition();
}

window.onload = function(){
  refreshAll();
}


//// SHOW Added & Completed dates


const hideBlocks = (...args) => {
  args.forEach((arg) => {
    arg.classList.add('display-none');
  })
}

const showBlocks = (...args) => {
  args.forEach((arg) => {
    arg.classList.remove('display-none');
  })
}

const putIntoHTML = (obj, value) => {
  obj.innerHTML = value;
}

const clearHTML = (obj) => {
  obj.innerHTML = '';
}

const emptyListHandler = () => {
  const activeTasks = TASKS.children.length;
  setState('activeTasks', activeTasks);
  if (activeTasks === 0) {
    putIntoHTML(TASKS, "There are no tasks.<br>The very time to add few :)");
    hideBlocks(ADDED.parentNode, COMPLETED.parentNode);
  } else {
    showBlocks(ADDED.parentNode, COMPLETED.parentNode);
  }
}


const ADDED = document.querySelector('.added');
const COMPLETED = document.querySelector('.completed');

const getAddedAndCompleted = () => {
  if(!getState('currentTaskId')) {
    hideBlocks(ADDED.parentNode, COMPLETED.parentNode);
    return;
  }
  const thisTask = getFullObject(getState('currentTaskId'));
  if (!thisTask) {
    return;
  }
  putIntoHTML(ADDED, getPrettyDate(new Date(thisTask.dateAdded)));
  if (thisTask.dateCompleted) {
    showBlocks(ADDED.parentNode, COMPLETED.parentNode);
    putIntoHTML(COMPLETED, getPrettyDate(new Date(thisTask.dateCompleted)));
  }
  else {
    hideBlocks(COMPLETED.parentNode);
    clearHTML(COMPLETED);
  }
}

const getPrettyDate = (date) => {
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString("ru", { hour12: false })}`;
}

//// NOTES


const COMPLETEBTN = document.querySelector('.completeBtn');
const NOTES = document.querySelector('.notes');

const refreshNotes = (id, value = false) => {
  NOTES.value = getField('note', id);
  if (value === false) {
    return;
  } else {
    NOTES.value = value;
  }
}

const noteWriteHandler = () => {
  const fullObject = getFullObject(getState('currentTaskId'));
  fullObject.note = NOTES.value;
  writeInStorage(getState('currentTaskId'), JSON.stringify(fullObject))
}

const getNotesListeners = () => {
  if (getState('activeTasks') > 0) { 
    notesDisable(false);
    COMPLETEBTN.addEventListener('click', completeTask);
    NOTES.addEventListener('input', noteWriteHandler);
  } else {
    notesDisable(true);
    COMPLETEBTN.removeEventListener('click', completeTask);
    NOTES.removeEventListener('input', noteWriteHandler);
  }
}

const notesDisable = (condition) => {
  if (condition) {
    NOTES.disabled = true;
  }
  else {
    NOTES.disabled = false;
  }
}

const getNotes = () => {
  NOTES.value = '';
  getNotesListeners();
  getAddedAndCompleted();
  const currentId = getState('currentTaskId');
  if (currentId) {
    refreshNotes(currentId, getField('note', currentId));
  }
  else {
    NOTES.value = '';
  }
}


//// TASKS


const getTaskList = () => {      
  clearHTML(TASKS);
  const keysOfStorage = getSortedKeys();
  keysOfStorage.forEach((key) => {
    const oneTask = getFullObject(key);
    if (oneTask.dateCompleted) {
      return;
    };
    const liTask = document.createElement('li');
    if (oneTask.id === getState('currentTaskId')) {
      liTask.classList.add('selected');
    }
    const isActiveStar = (getField('priority', oneTask.id)) ? 'active' : '';
    liTask.dataset.id = oneTask.id;
    putIntoHTML(liTask, 
      `${oneTask.name}<p>
        <span class="star ${isActiveStar}" onclick="changePriority('${oneTask.id}')">★</span>
        <span class="del" onclick="deleteTask('${oneTask.id}')">☒</span></p>`
    );
    TASKS.append(liTask);
  });
  emptyListHandler();
}

//// Archive list sorted by date of complete

const compareDates = (a, b) => {
  const dateA = new Date(a.dateCompleted);
  const dateB = new Date(b.dateCompleted);
  return dateB - dateA;
}

const dateFormatArchive = (date) => {
  const day = ('0' + (date.getDate())).slice(-2);
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  return day + '.' + month;
}

const makeSortedArchiveArray = () => {
  let tasksArr = [];
  const keysOfStorage = Object.keys(localStorage);
  keysOfStorage.forEach((key) => {
    if (key === 'state') {
      return;
    }
    const oneTask = getFullObject(key);
    if (!oneTask.dateCompleted) {
      return;
    }
    tasksArr.push(oneTask);
  });

  return tasksArr.sort(compareDates);
}

const getArchiveList = () => {  
  clearHTML(ARCHIVE);
  const tasksArr = makeSortedArchiveArray();
  tasksArr.forEach((task) => {
    const liTask = document.createElement('li');
    liTask.dataset.id = task.id;
    if (task.id === getState('currentTaskId')) {
      notesDisable(true);
      liTask.classList.add('selected');
    }
    const dateHere = new Date(task.dateCompleted);
    putIntoHTML(liTask, 
      `${task.name}<p><span class="completeDate">${dateFormatArchive(dateHere)}</span>
      <span class="del" onclick="deleteTask('${task.id}')">☒</span></p>`
    );
    ARCHIVE.append(liTask);
  });
}
