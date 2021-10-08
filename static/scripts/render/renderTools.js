import * as s from '../elementAttributes.js';

//Will clear out all the child nodes for the specified element.
export const clearElement = (elementIdentifier) => {

    document.querySelector(elementIdentifier).textContent = "";
}

//Each time this function is called, it will swap one class for another
//for a specified element, or do so only once.
export const classToggle = (elementIdentifier, toggleOnce, initialClass = "no-class", newClass = "no-class") => {

    let elm = document.getElementById(elementIdentifier);

    if (toggleOnce) {

        elm.className = initialClass;
    }
    else {

        if (elm.className !== initialClass) {

            elm.className = initialClass;
        }
        else {

            elm.className = newClass;
        }
    }
}

//Renders the message data from the first argument, into the element with 
//the id indicated by the second argument.
//The classes stored in the last two arguments, will be applied depending 
//on if the message has any data or not.
export const renderMessage = (message, elmID, hideClass, displayClass) => {

    let errorMsg = document.getElementById(elmID);
    errorMsg.textContent = "";
    errorMsg.className = hideClass;

    if (errorMsg) {

        if (message != undefined) {

            errorMsg.textContent = message;
            errorMsg.ariaLabel = message;

            if (message !== "") {

                errorMsg.className = displayClass;
            }
        }
    }
}

//Clears error messages for a series of element IDs, after a delay.
export const clearMessages = (elmIDs, delay) => {

    setTimeout(() => {

        elmIDs.map((id) => {

            renderMessage("", id, s.noDisplayClass, s.errorClass);
        })
    }, delay)
}

//Will highlight the element passed in the first argument, if 
//the if the second argument equals < error >.
export const highlightField = (element, validationMsg) => {

    renderMessage("", validationMsg.elementId, s.noDisplayClass, s.errorClass);

    element.style.border = "none";

    if (validationMsg.status === "error") {

        renderMessage(validationMsg.message, validationMsg.elementId, s.noDisplayClass, s.errorClass);

        if (element.value !== "") {

            element.style.border = "2px solid red";
            element.style.outline = "none";
        }
    }
}

//This function will scroll to the element with the ID specified.
//You can state if you wish to scroll to the first, or last child
//of a parent node using the last two optional boolean parameters.
export const scrollToElement = (elementID, delay, isParent = false, toLast = false) => {

    let elemID;

    setTimeout(() => {

        if (isParent) {

            let parentElm = document.getElementById(elementID);

            if (parentElm) {

                elemID = toLast ? parentElm.lastChild.id : parentElm.firstChild.id;
            }
        }
        else {

            elemID = elementID;
        }

        document.getElementById(elemID).scrollIntoView();
    }, delay)
}

//This function will attempt to load an image into memory for file upload.
export const readImage = (image) => {

    let reader = new FileReader();

    reader.readAsDataURL(image);
    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            resolve(e.target.result);
        }
    })
}