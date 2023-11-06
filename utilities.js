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
  let selectedTask = (tasks.querySelector('.selected') || false);
  let selectedArchive = (archive.querySelector('.selected') || false);

  if (selectedTask !== selectedArchive) {
    if (selectedTask) {
      selectedTask.classList.remove('selected');
    } else {
      selectedArchive.classList.remove('selected');
    }
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
  setState('currentTaskId', li.dataset.id)
  refreshAll();
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
  setState('currentTaskId', getOneId());
  refreshAll();
}


//// Complete task


let encouragements = ['Cool!', 'Congruts!', 'Well done!', 'Perfect!', 'Amazing!', 'Good job!'];

const completeTask = () => {
  let thisTask = getFullObject(getState('currentTaskId'));
  if (thisTask.dateCompleted) return;
  let now = new Date();
  thisTask.dateCompleted = now;
  completed.innerHTML =  `${now}`;
  runAnimation(getState('currentTaskId'));
  localStorage.setItem(getState('currentTaskId'), JSON.stringify(thisTask));
  setState('currentTaskId', getOneId());
  showEncouragement();
  setTimeout(() => {
    refreshAll();
  }, 1500); 
}  

const runAnimation = (id) => {
  let oneTask = tasks.querySelector('.selected');
  oneTask.classList.add('animation');
}

let encouragement = document.querySelector('.encouragement');

const showEncouragement = () => {
  let phrase = encouragements[Math.floor(Math.random() * 6)];
  encouragement.innerHTML = `${phrase}`;
  setTimeout(() => {encouragement.innerHTML = ''}, 1500);
}

