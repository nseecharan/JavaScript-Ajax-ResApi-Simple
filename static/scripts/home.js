import { createEmpForm, createTaskForm } from './events.js';
import { login, getAllEmployees, getAllTasks, searchData } from './requests.js';


let mainButtons = document.getElementsByTagName('button');
let mainInputs = document.getElementsByTagName('input');

let loginBtn = mainButtons[0];
let getEmpBtn = mainButtons[1];
let getTaskBtn = mainButtons[2];
let newEmpBtn = mainButtons[3];
let newTaskBtn = mainButtons[4];
let userNameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
let searchInput = document.getElementById('search-input');

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

    createEmpForm();
});
newTaskBtn.addEventListener('click', () => {

    createTaskForm();
});
searchInput.addEventListener('click', (e) => {

    searchData(e);
});
searchInput.addEventListener('keyup', (e) => {

    searchData(e);
});

//closeTaskForm()
//closeEmpForm()
//submit-emp
//submit-task
//tableBody