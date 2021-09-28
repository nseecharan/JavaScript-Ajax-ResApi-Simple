import { openEmpForm, openTaskForm } from './events.js';
import { login, getAllEmployees, getAllTasks, searchData } from './dataManager.js';


let mainButtons = document.getElementsByTagName('button');

let loginBtn = mainButtons[0];
let getEmpBtn = mainButtons[1];
let getTaskBtn = mainButtons[2];
let newEmpBtn = mainButtons[3];
let newTaskBtn = mainButtons[4];
let searchInput = document.getElementById('search-input');
//let loginError = document.getElementById('login-error-msg');
//let generalError = document.getElementById('error-msg');

loginBtn.addEventListener('click', () => {

    login();
});
getEmpBtn.addEventListener('click', () => {

    getAllEmployees();
});
getTaskBtn.addEventListener('click', () => {

    getAllTasks();
});
newEmpBtn.addEventListener('click', () => {

    openEmpForm();
});
newTaskBtn.addEventListener('click', () => {

    openTaskForm();
});
searchInput.addEventListener('click', (e) => {

    searchData(e);
});
searchInput.addEventListener('keyup', (e) => {

    searchData(e);
});

//testing out basic implementaion of ovserver to track changes in http elements

/*
const targetNode = document.getElementById('error-msg');

const config = { attributes: true, childList: true, subtree: true };

const callback = function (mutationsList, observer) {

    console.log(mutationsList)
}

const observer = new MutationObserver(callback);

observer.observe(targetNode, config);

//observer.disconnect();
*/