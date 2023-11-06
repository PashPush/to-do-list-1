'use strict';

//// TODAY IS

const putCurrentDate = () => {    
  let currentDate = new Date();
  let date = document.querySelector('.date');
  date.innerHTML =  `${currentDate.toLocaleDateString()}`;
}

putCurrentDate();


//// ARCHIVE SLIDER

let slide = document.querySelector('.archive-slide');
slide.addEventListener('click', 
  () => archive.classList.toggle('act'));
  slide.addEventListener('click', () => {
  let spans = slide.querySelectorAll('span');
  for (let span of spans) {
    span.classList.toggle('actArrow');
    }
  }
);


//// TASKS MANIPULATIONS

const getStars = () => {
  let stars = tasks.querySelectorAll('.star');
    for (let star of stars) {
      star.addEventListener('click', () => {
      star.classList.toggle('active');
      });
    }
}

const changePriority = (id) => {
  let fullObj = getFullObject(id);
  fullObj['priority'] = !fullObj['priority'];
  localStorage[id] = JSON.stringify(fullObj);  
}


//// Task Selector 


let tasks = document.querySelector('.tasks-list');
let archive = document.querySelector('.archive');

const singleSelect = (li) => {
  let selectedTasks = tasks.querySelectorAll('.selected');
  let selectedArchive = archive.querySelectorAll('.selected');
  for(let elem of selectedTasks) {
    elem.classList.remove('selected');
  }
  for(let elem of selectedArchive) {
    elem.classList.remove('selected');
  }
  li.classList.add('selected');
  let oneTask = getFullObject(li.dataset.id);
  if (oneTask.dateCompleted) {
    notes.disabled = true;
  }
  else {
    notes.disabled = false;
  }
  notes.value = getField('note', li.dataset.id);
  setTimeout(()=> getAddedAndCompleted(), 0);         //// Doesn't refresh immediately
  // getAddedAndCompleted();
  setState('currentTaskId', li.dataset.id)
}

tasks.onclick = function(event) {
  if (event.target.tagName != "LI") return;
    singleSelect(event.target);
}

archive.onclick = function(event) {
  if (event.target.tagName != "LI") return;
    singleSelect(event.target);
}


//// Clear all


let clearAll = document.querySelector('.clearAll');

clearAll.onclick = function () {

  if (!confirm('You really want to clear all the archive?')) return;
  let keysOfStorage = Object.keys(localStorage);
  for (let key of keysOfStorage) {
    if (key === 'state') continue;
    let oneTask = getFullObject(key);
    if (!oneTask.dateCompleted) continue;
    localStorage.removeItem(oneTask.id);
  }
  // location.reload(); // RELOAD
  setState('currentTaskId', getOneId());
  getTaskList();
  getArchiveList();
  getNotes();
}


//// Complete task


let encouragements = ['Cool!', 'Congruts!', 'Well done!', 'Perfect!', 'Amazing!', 'Good job!'];

const completeTask = () => {
  let thisTask = getFullObject(getState('currentTaskId'));
  if (thisTask.dateCompleted) return;
  let now = new Date();
  thisTask.dateCompleted = now;
  completed.innerHTML =  `${now}`;
  localStorage.setItem(getState('currentTaskId'), JSON.stringify(thisTask));
  setState('currentTaskId', getOneId());
  showEncouragement();
  setTimeout(() => {
    getTaskList();
    getArchiveList();
    getNotes();
  }, 1500); 
}  

let encouragement = document.querySelector('.encouragement');

const showEncouragement = () => {
  let phrase = encouragements[Math.floor(Math.random() * 6)];
  encouragement.innerHTML = `${phrase}`;
  setTimeout(() => {encouragement.innerHTML = ''}, 1500);
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