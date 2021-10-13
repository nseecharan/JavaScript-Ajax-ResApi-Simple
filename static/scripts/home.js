import { getAllEmployees, getAllTasks, login, searchData } from './routes.js';
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
const loginMessageID = "login-msg";
const searchInput = document.getElementById('search-input');


['keyup', 'blur', 'focus'].forEach((action) => {

    userNameInput.addEventListener(action, (e) => {

        if (e.key !== "Enter" || e.keyCode !== 13) {

            validateLoginForm(loginForm, true, loginMessageID);
        }
    });

    passwordInput.addEventListener(action, (e) => {

        if (e.key !== "Enter" || e.keyCode !== 13) {

            validateLoginForm(loginForm, false, loginMessageID);
        }
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

function showHamburger() {

    const parentElm = document.getElementById("dropdown");

    if (parentElm.children.length === 0) {

        createHamburger("dropdown", "menu-bar");
    }
}

['load', 'resize'].forEach((action) => {

    window.addEventListener(action, (e) => {

        const width = e.currentTarget.innerWidth;
        const height = e.currentTarget.innerHeight;
        const titleElm = document.getElementById("menu-bar");

        if (width <= 900 || height <= 510) {

            titleElm.className = "title-slim";
            showHamburger();
        }
        else {

            titleElm.className = "";
            clearElement("#dropdown");
        }
    })
})
