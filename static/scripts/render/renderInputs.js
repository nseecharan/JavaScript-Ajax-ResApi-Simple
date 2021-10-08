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

//returns a single input field
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

//returns a div with both a label, input, and a contained paragraph element for messages
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