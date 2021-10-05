//This function will clear out all the child nodes for the specified element.
export function clearElement(elementIdentifier) {

    document.querySelector(elementIdentifier).textContent = "";
}

export function elementDisplay(elementIdentifier, hideClass) {

    let elm = document.querySelector(elementIdentifier);

    if (elm.className !== hideClass) {

        elm.className = hideClass;
    }
    else {

        elm.className = "display";
    }
}

//This function will scroll to the element with the ID specified.
//You can state if you wish to scroll to the first, or last child
//of a parent node using the last two optional boolean parameters.
export function scrollToElement(elementID, delay, isParent = false, toLast = false) {

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

//Renders an error message in any element that has "error-msg" as it's ID.
export function renderMessage(message, elmID, hideClass, displayClass) {

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

export function clearMessages(elmIDs, delay) {

    setTimeout(() => {

        elmIDs.map((id) => {

            renderMessage("", id, "no-display", "error-background");
        })
    }, delay)
}

//This function will attempt to load an image into memory for file upload.
export function readImage(image) {

    let reader = new FileReader();

    reader.readAsDataURL(image);
    return new Promise((resolve, reject) => {
        reader.onload = function (e) {
            resolve(e.target.result);
        }
    })
}