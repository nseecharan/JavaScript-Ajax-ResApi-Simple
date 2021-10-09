import { classToggle } from "./renderTools.js";

export const createButton = (id, classes, buttonText, type, ariaLabel = "", name = "", title = "") => {

    let newButton = document.createElement('button');

    newButton.type = type;
    newButton.textContent = buttonText;

    if (id) {

        newButton.id = id;
    }
    if (classes) {

        newButton.className = classes;
    }
    if (ariaLabel) {

        newButton.ariaLabel = ariaLabel;
    }
    if (name) {

        newButton.name = name;
    }
    if (title) {

        newButton.title = title;
    }

    return newButton;
}

export const createSelect = (selectId, selClass, optionsObject, ariaLabel = "", name = "", title = "", required = false) => {

    let selectElement = document.createElement('select');

    selectElement.required = required;

    if (selectId) {

        selectElement.id = selectId;
    }
    if (selClass) {

        selectElement.className = selClass;
    }
    if (ariaLabel) {

        selectElement.ariaLabel = ariaLabel;
    }
    if (name) {

        selectElement.name = selClass;
    }
    if (title) {

        selectElement.title = ariaLabel;
    }

    optionsObject.map((option, index) => {

        let opt = document.createElement('option');
        if (index === 0) {

            opt.selected = true;
        }
        opt.value = option.value;
        opt.text = option.text;
        selectElement.appendChild(opt);
    })

    return selectElement;
}

export const createInput = (inputId, inputClass, inputType, placeholder, min, max, ariaLabel = "", name = "", title = "", required = false) => {

    let newInput = document.createElement('input');

    newInput.type = inputType;
    newInput.required = required;

    if (inputId) {

        newInput.id = inputId;
    }
    if (inputClass) {

        newInput.className = inputClass;
    }
    if (placeholder) {

        newInput.placeholder = placeholder;
    }
    if (min) {

        newInput.minLength = min;
    }
    if (max) {

        newInput.maxLength = max;
    }
    if (ariaLabel) {

        newInput.ariaLabel = ariaLabel;
    }
    if (name) {

        newInput.name = name;
    }
    if (title) {

        newInput.title = title;
    }

    return newInput;
}

//Returns a div with both a label, input, and a contained paragraph element for messages.
export const createField = (labelName, element, messageID, messageClass = "") => {

    let label = document.createElement('label');
    let message = document.createElement('p');
    let container = document.createElement('div');
    label.textContent = labelName;
    message.id = messageID;
    message.className = messageClass;
    container.append(label, element, message);

    return container;
}

//Creates a custom hamburger icon with all the necessary css styling and functionality.
//The target element ID is for the element you would want this button to control.
export const createHamburger = (parentID, targetElementID) => {

    const parentElm = document.getElementById(parentID);
    const button = document.createElement('button');
    button.setAttribute("style", "background:none; border:none;margin-right:1vw;");
    button.className = "hamburger-btn";
    button.ariaLabel = "Click here to open the menu on mobile screens";
    button.title = "Click here to open the menu on mobile screens";

    button.addEventListener('click', () => {

        classToggle(targetElementID, false, "title-slim title-reveal", "title-slim title-collapse")
    })

    const container = document.createElement('div');
    container.setAttribute("style", "height: 20px;width: 20px;display: table;");

    for (let i = 0; i < 3; i++) {
        const bar = document.createElement('span');
        bar.setAttribute("style",
            ` width: inherit;
                border: 1px solid white;
                background: white;
                display: block;
                margin: 4px auto;
            `);

        container.append(bar);
    }

    button.append(container)

    parentElm.appendChild(button);
}