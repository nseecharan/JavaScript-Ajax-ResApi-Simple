import { createTable, renderRow } from './renderTable.js';

//This function passes data to relevant functions that will configure the table
//and render data in the table body. You must pass the ID (or Class) of the table
//body you want to add the data to.
export const renderData = (data, parentID) => {

    if (data[0] != undefined) {

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
}

//This renders the raw json data properly.
export const renderRawData = (data) => {

    document.getElementById("raw-data").textContent = JSON.stringify(data, null, '\t');
}