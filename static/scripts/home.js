import { getAllEmployees, getAllTasks, login, searchData, toggleDataStyle } from './routes.js';
import { validateLoginForm } from './form-validation/validateLoginForm.js';
import { clearElement } from './render/renderTools.js';
import { createHamburger } from './render/renderInputs.js';
import { advancedSearchForm } from './menuEvents.js';

const loginForm = document.getElementById('login-form');
const userNameInput = loginForm.elements[0];
const passwordInput = loginForm.elements[1];
const loginBtn = document.getElementById("login-button");
const getEmpBtn = document.getElementById("get-emp-btn");
const getTaskBtn = document.getElementById("get-task-btn");
const loginMessageID = "login-msg";
const searchInput = document.getElementById('search-input');
const toggleStyleBtn = document.getElementById("toggle-style-btn");
const advancedSearch = document.getElementById("advanced-search");

const DataSetType = () => {

    let isEemployees = false;

    const getDataSetType = () => isEemployees;
    const setDataSetType = (answer) => {

        isEemployees = answer;
    }

    return {

        setDataSetType, getDataSetType
    }
}

const dSetType = DataSetType();

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
    dSetType.setDataSetType(true);
});
getTaskBtn.addEventListener('click', () => {

    getAllTasks();
    dSetType.setDataSetType(false);
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

toggleStyleBtn.addEventListener('click', () => {

    toggleDataStyle();
})

advancedSearch.addEventListener('click', () => {

    advancedSearchForm(dSetType.getDataSetType());
})
