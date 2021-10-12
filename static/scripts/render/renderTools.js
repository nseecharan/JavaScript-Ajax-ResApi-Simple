import * as s from '../elementAttributes.js';

//Will clear out all the child nodes for the specified element.
export const clearElement = (elementIdentifier) => {

    document.querySelector(elementIdentifier).textContent = "";
}

//Each time this function is called, it will swap one class for another
//for a specified element, or do so only once.
export const classToggle = (elementIdentifier, toggleOnce, initialClass = "no-class", newClass = "no-class") => {

    const elm = document.getElementById(elementIdentifier);

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

    const errorMsg = document.getElementById(elmID);
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

            renderMessage("", id, s.noDisplayClass, s.messageClass);
        })
    }, delay)
}

//Will highlight the element passed in the first argument, if 
//the if the second argument equals < error >, and also display
//a status message.
export const highlightField = (element, validationMsg) => {

    renderMessage("", validationMsg.elementId, s.noDisplayClass, s.messageClass);

    element.style.borderColor = "transparent";

    if (validationMsg.status === "error") {

        renderMessage(validationMsg.message, validationMsg.elementId, s.noDisplayClass, s.messageClass);

        if (element.value !== "") {

            element.style.border = "2px solid red";
            element.style.outline = "none";
        }
    }
    else { }
}

//This function will attempt to load an image into memory for file upload.
export const readImage = (image) => {

    const reader = new FileReader();

    reader.readAsDataURL(image);
    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            resolve(e.target.result);
        }
    })
}

//This will scroll to the last child of the element with the ID indicated in the 
//first argument.
export const scrollToElement = (listElmID, delay) => {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            const listElm = document.getElementById(listElmID);
            const scrollToElm = listElm.lastChild;
            scrollToElm.scrollIntoView();
            resolve();
        }, delay)
    })
}

//This is a unique function that will apply an animation to element being scrolled to, after
//scrolling has finished.
export const scrollEndAnimation = (scrollToElm, scrollWindowID, animationClass, originalClass) => {

    const scrollWindow = document.getElementById(scrollWindowID);
    scrollWindow.addEventListener('scroll', function scroll() {

        const hOffset = Math.ceil(scrollWindow.offsetHeight);
        const top = Math.ceil(scrollWindow.scrollTop);
        const height = Math.ceil(scrollWindow.scrollHeight);

        if (hOffset + top >= height) {

            applyTemporaryAnimation(scrollToElm, animationClass, originalClass)
            scrollWindow.removeEventListener('scroll', scroll);
        }
    });
}

//This will temporarily add a css animation class to an elment, and then remove it
//once the animation is done.
export const applyTemporaryAnimation = (element, animationClass, currentClasses) => {

    element.className = currentClasses + " " + animationClass;
    element.addEventListener('animationend', function addAnimation() {

        element.className = currentClasses;
        element.removeEventListener('animationend', addAnimation);
    })
}

export const loading = (parentID) => {

    const overlay = document.createElement('div');
    overlay.className = s.modal_overlayClass;
    const loadingGraphic = document.createElement('div');
    loadingGraphic.className = s.loading;
    loadingGraphic.textContent = "Please wait while we retrieve the data...";

    overlay.appendChild(loadingGraphic);

    document.getElementById(parentID).append(overlay);
}