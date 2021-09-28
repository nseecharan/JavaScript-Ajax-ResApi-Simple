//This function will clear out all the child nodes for the specified element.
export function clearElement(elementIdentifier) {

    document.querySelector(elementIdentifier).textContent = "";
}

export function elementDisplay(elementIdentifier) {

    let elm = document.querySelector(elementIdentifier);

    if (!elm.style.display || elm.style.display === "none") {

        elm.style.display = "block";
    }
    else {

        elm.style.display = "none";
    }
}

//This function will scroll to the element with the ID specified.
//You can state if you wish to scroll to the first, or last child
//of a parent node using the last two optional boolean parameters.
export function scrollToElement(elementID, delay, isParent = false, toLast = false) {

    let elemID;

    if (isParent) {

        let parentElm = document.getElementById(elementID);

        if (parentElm) {

            elemID = toLast ? parentElm.lastChild.id : parentElm.firstChild.id;
        }
    }
    else {

        elemID = elementID;
    }

    setTimeout(() => {
        document.getElementById(elemID).scrollIntoView();
    }, delay)
}

//Renders an error message in any element that has "error-msg" as it's ID.
export function renderMessage(message, elmID) {

    let error_msg = document.getElementById(elmID);
    error_msg.innerText = "";
    error_msg.className = "no-background";

    if (error_msg) {

        if (message != undefined) {

            error_msg.innerText = message;

            if (message !== "") {

                error_msg.className = "error-background";
            }
        }
    }
}

export function clearMessages(elmIDs, delay) {

    setTimeout(() => {

        elmIDs.map((id) => {

            renderMessage("", id);
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