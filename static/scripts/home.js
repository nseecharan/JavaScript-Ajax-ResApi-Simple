import { openEmpForm, openTaskForm } from './menuEvents.js';
import { getAllEmployees, getAllTasks, login, searchData } from './dataManager.js';
import { validateLoginForm } from './form-validation/loginForm.js';

const mainButtons = document.getElementsByTagName('button');
const loginForm = document.getElementById('login-form').elements;
const userNameInput = loginForm[0];
const passwordInput = loginForm[1];

const loginBtn = mainButtons[0];
const getEmpBtn = mainButtons[1];
const getTaskBtn = mainButtons[2];
const newEmpBtn = mainButtons[3];
const newTaskBtn = mainButtons[4];
const searchInput = document.getElementById('search-input');

['keyup', 'blur', 'focus'].forEach((action) => {

    userNameInput.addEventListener(action, (e) => {

        validateLoginForm(true, "login-msg");
    });

    passwordInput.addEventListener(action, (e) => {

        validateLoginForm(false, "login-msg");
    });

    searchInput.addEventListener(action, (e) => {

        searchData(e);
    });
})

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