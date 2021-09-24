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