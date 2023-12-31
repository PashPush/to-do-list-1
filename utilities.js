'use strict';

//// TODAY IS

const putCurrentDate = () => {    
  const currentDate = new Date();
  const date = document.querySelector('.date');
  putIntoHTML(date, `${currentDate.toLocaleDateString()}`);
}

putCurrentDate();


//// ARCHIVE SLIDER

const SLIDE = document.querySelector('.archive-slide');

const setSliderPosition = () => {
  const span = SLIDE.querySelector('span');
  if (getState('activeArchive')) {
    putIntoHTML(span, '▼');
    ARCHIVE.classList.add('act');
  } else {
    putIntoHTML(span, '▶');
    if (ARCHIVE.classList.contains('act')) {
      ARCHIVE.classList.remove('act');
    }
  }
}

SLIDE.addEventListener('click', () => {
    ARCHIVE.classList.toggle('act');
    setState('activeArchive', !getState('activeArchive'))
    setSliderPosition();
  });


//// TASKS MANIPULATIONS


const getStars = () => {
  const stars = TASKS.querySelectorAll('.star');
  stars.forEach((star) => {
    star.addEventListener('click', () => {
      star.classList.toggle('active');
    });
  })
}

const refreshPriorityState = (id) => {
  const priorArr = getState('priorityOrder');
  if (priorArr.includes(id)) {
    priorArr.splice(priorArr.indexOf(id), 1);
    setPriorityState(priorArr);
  } 
}


const changePriority = (id) => {
  const fullObj = getFullObject(id);
  fullObj['priority'] = !fullObj['priority'];
  localStorage[id] = JSON.stringify(fullObj);  
  const priorArr = getState('priorityOrder');
  if (fullObj['priority'] && !priorArr.includes(id)){
    priorArr.unshift(id);
  } else {
    priorArr.splice(priorArr.indexOf(id), 1);
  }
  setPriorityState(priorArr);
  refreshAll();
}


//// Task Selector 


const TASKS = document.querySelector('.tasks-list');
const ARCHIVE = document.querySelector('.archive');

const selectHandler = (event) => {
  if (event.target.tagName != "LI") {
    return;
  }
  singleSelect(event.target);
}

TASKS.addEventListener('click', selectHandler);
ARCHIVE.addEventListener('click', selectHandler);
PRIORITY_LIST.addEventListener('click', selectHandler);


const singleSelect = (li) => {
  const selectedTask = (TASKS.querySelector('.selected') || false);
  const selectedArchive = (ARCHIVE.querySelector('.selected') || false);

  if (selectedTask !== selectedArchive) {
    if (selectedTask) {
      selectedTask.classList.remove('selected');
    } else {
      selectedArchive.classList.remove('selected');
    }
  }
  

  li.classList.add('selected');
  const oneTask = getFullObject(li.dataset.id);

  changeCurrentTaskId(li.dataset.id);
  refreshAll(); 
  notesDisable(oneTask.dateCompleted); 
}


//// Clear all


const CLEARALL = document.querySelector('.clearAll');

CLEARALL.onclick = function () {
  if (!confirm('Do you really want to clear all the archive?')) {
    return;
  }
  const keysOfStorage = getSortedKeys();
  keysOfStorage.forEach((key) => {
    const oneTask = getFullObject(key);
    if (!oneTask.dateCompleted) {
      return;
    }
    localStorage.removeItem(oneTask.id);
  })
  changeCurrentTaskId();
  refreshAll();
}


//// Complete task



const completeTask = () => {
  const thisTask = getFullObject(getState('currentTaskId'));
  if (thisTask.dateCompleted) {
    return;
  }
  const now = new Date();
  setField(thisTask.id, 'dateCompleted', now);
  setField(thisTask.id, 'priority', false);
  runAnimation(getState('currentTaskId'));
  changeCurrentTaskId();
  showEncouragement();
  notesDisable(true);
  setTimeout(() => {
    refreshPriorityState(thisTask.id);
    refreshAll();
  }, 1500); 
}  

const runAnimation = (id) => {
  const oneTask = TASKS.querySelector('.selected');
  oneTask.classList.add('animation');
}

const showEncouragement = () => {
  const encouragements = ['Cool!', 'Congruts!', 'Well done!', 'Perfect!', 'Amazing!', 'Good job!'];
  const encouragement = document.querySelector('.encouragement');
  putIntoHTML(encouragement, `${encouragements[Math.floor(Math.random() * 6)]}`);
  setTimeout(() => {clearHTML(encouragement)}, 1500);
}

