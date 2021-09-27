export function createButton(id, classes, name, type) {
    
    let newButton = document.createElement('button');
    newButton.id = id;
    newButton.className = classes;
    newButton.type = type;
    newButton.innerText = name;

    return newButton;
}

export function createSelect(selectId, selClass, optionsObject) {

    let selectElement = document.createElement('select');
    selectElement.id = selectId;
    selectElement.className = selClass;

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

export function createInput(inputId, inputClass, inputType, placeholder) {

    let newInput = document.createElement('input');
    newInput.id = inputId;
    newInput.className = inputClass;
    newInput.type = inputType;
    newInput.placeholder = placeholder;

    return newInput;
}