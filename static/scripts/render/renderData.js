import { createTableHeader, renderRow } from './renderTable.js';
import { elementDisplay, clearElement} from './renderTools.js';

//This function passes data to relevant functions that will configure the table
//and render data in the table body. You must pass the ID (or Class) of the table
//body you want to add the data to.
export function renderData(data, tableBodyId, token) {

    if (!document.getElementById(tableBodyId)) {

        return;
    }

    if (token && !document.getElementById("create-options").style.display) {

        elementDisplay("#create-options");
    }

    document.getElementById("raw-data").innerHTML = JSON.stringify(data, null, '\t');

    if (data[0] != undefined) {

        clearElement("#tableHdr");
        clearElement("#tableBody");

        if (data[0].first_name) {

            createTableHeader(["Image", "Name", "Email", "Action"], "tableHdr")
        }
        else {

            createTableHeader(["Task", "Action"], "tableHdr")
        }

        data.map((obj, index) => {

            renderRow(obj, index, tableBodyId);
        })
    }
}