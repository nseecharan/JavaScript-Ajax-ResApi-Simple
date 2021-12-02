import { getPage, nextPage, prevPage } from "../routes.js";
import { createButton, createInput } from "./renderInputs.js";

const currentPage = document.createElement('span');
currentPage.id = "current-page";
const lastPage = document.createElement('span');
lastPage.id = "max-page";

//Renders the navigation buttons for the list of data.
export const pageNavigation = async (parentID, maxPages, page) => {

    const parent = document.getElementById(parentID);
    const prevBtn = createButton("prev-btn", "arrow-left-btn", "", "button", "Button to go back one page worth of the data.", "", "Go back one page.");
    const nextBtn = createButton("next-btn", "arrow-right-btn", "", "button", "Button to advance one page worth of data.", "", "Go forward one page.");
    const goToBtn = createButton("go-to-btn", "btn-sizing", "Go", "button", "Click this button after specifying the page you wish to load.", "", "Go to the specified page.");
    const pageInput = createInput("goto-page", "", "number", "", "0", "1000", "Enter a page number here to go to a specific page.")
    const pageNumContainer = document.createElement('div');

    pageNumContainer.id = "page-indicator";
    pageInput.min = 1;
    pageInput.max = maxPages;
    const current = page;
    pageInput.value = current;
    currentPage.textContent = current;
    lastPage.textContent = maxPages + "";

    pageNumContainer.append(currentPage, "/", lastPage);
    parent.replaceChildren(prevBtn, pageNumContainer, nextBtn, pageInput, goToBtn);

    navigationFunctions(parentID, maxPages);
}

//Binds the necessary functions to the navication buttons.
export const navigationFunctions = (parentID, maxPages) => {

    const parent = document.getElementById(parentID);
    const buttons = parent.getElementsByTagName('button');
    const goToInput = parent.getElementsByTagName('input');
    const pageNumbers = parent.getElementsByTagName('span');

    buttons[0].addEventListener('click', function prev() {

        const current = prevPage();
        updatePageIndicator(current, maxPages, pageNumbers[0].id);
    })

    buttons[1].addEventListener('click', function next() {

        const current = nextPage();
        updatePageIndicator(current, maxPages, pageNumbers[0].id);
    })

    buttons[2].addEventListener('click', async function goTo() {

        const page = document.getElementById(goToInput[0].id).value;
        const current = await getPage(page - 1);
        updatePageIndicator(current, maxPages, pageNumbers[0].id);
    })
}

//Will update the numbers for the navigation page indicators.
const updatePageIndicator = (current, maxPages, elementID) => {

    if (current >= 0 && current <= maxPages) {

        document.getElementById(elementID).textContent = (current + 1);
    }
}