import { openEmpForm, openTaskForm } from './menuEvents.js';
import { getAllEmployees, getAllTasks, login, searchData } from './dataManager.js';
import { validateLoginForm } from './form-validation/validateLoginForm.js';
import { clearElement } from './render/renderTools.js';
import { createHamburger } from './render/renderInputs.js';

const mainButtons = document.getElementsByTagName('button');
const loginForm = document.getElementById('login-form');
const userNameInput = loginForm.elements[0];
const passwordInput = loginForm.elements[1];
const loginBtn = mainButtons[0];
const getEmpBtn = mainButtons[1];
const getTaskBtn = mainButtons[2];
const newEmpBtn = mainButtons[3];
const newTaskBtn = mainButtons[4];
const loginMessageID = "login-msg";
const searchInput = document.getElementById('search-input');

['keyup', 'blur', 'focus'].forEach((action) => {

    userNameInput.addEventListener(action, (e) => {

        validateLoginForm(loginForm, true, loginMessageID);
    });

    passwordInput.addEventListener(action, (e) => {

        validateLoginForm(loginForm, false, loginMessageID);
    });
})

searchInput.addEventListener('keyup', (e) => {

    searchData(e);
});

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

function showHamburger() {

    const parentElm = document.getElementById("dropdown");

    if (parentElm.children.length === 0) {

        createHamburger("dropdown", "title-div");
    }
}

['load', 'resize'].forEach((action) => {

    window.addEventListener(action, (e) => {


        const width = e.currentTarget.innerWidth;
        const height = e.currentTarget.innerHeight;
        const titleElm = document.getElementById("title-div");
        if (width < 900) {

            titleElm.className = "title-slim";
            showHamburger();

        }
        else {

            titleElm.className = "titles";
            clearElement("#dropdown");
        }
    })
})
