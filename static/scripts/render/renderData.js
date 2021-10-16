import { createTable, renderRow } from './renderTable.js';
import { clearElement } from './renderTools.js';

//This function renders a table within the parent element,
//and configure it to match the data set. The last argument 
//dictates if this function should render a triditional table,
//or a mock json like presentation.
export const renderData = (data, parentID, pretty = true) => {

    clearElement("#" + parentID);

    if (data[0] != undefined) {

        if (pretty) {

            if (data[0].first_name) {

                createTable([], parentID);
            }
            else {

                createTable([], parentID);
            }

            const tbodyID = document.getElementById(parentID).lastChild.lastChild.id;

            data.map((obj, index) => {

                renderRow(obj, tbodyID);
            })
        }
        else {

            renderRawData(data, parentID);
        }
    }
}

//This renders the data in a json presentation.
const renderRawData = (data, parentID) => {

    const pre = document.createElement('pre');
    pre.className = "dos-screen";
    pre.textContent = JSON.stringify(data, null, '\t');
    document.getElementById(parentID).appendChild(pre);
}