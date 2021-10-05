import { createTableHeader, renderRow } from './renderTable.js';
import { clearElement } from './renderTools.js';

//This function passes data to relevant functions that will configure the table
//and render data in the table body. You must pass the ID (or Class) of the table
//body you want to add the data to.
export function renderData(data, tableBodyId) {

    if (!document.getElementById(tableBodyId)) {

        return;
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