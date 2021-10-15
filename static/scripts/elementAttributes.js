//Experimenting with the idea of having a centralized list of element classes and ids that are referenced throughout the code


//*********MEMO: add the createInput ids, and aria labels from renderForms*************


export const ariaLabels = {

    aria_empUpdateBtn: "Submit button for the employee update form.",
    aria_taskUpdateBtn: "Submit button for the task update form.",
    aria_empCreateBtn: "Create new employee, button.",
    aria_taskCreateBtn: "Create new task, button."
}

export const titles = {

    title_textInput: "2 to 64 characters, must begin with a letter, and may also contain single quotes, as well as spaces.",
    title_emailInput: "8 to 128 characters, and must begin with a letter, and may also contain numbers, as well as periods."
}

export const modals = {

    modalClass_overlay: "modal-overlay",
    modalClass_container: "modal-container",
    modalClass_heading: "modal-heading"
};

export const forms = {

    formID_taskModal: "task-form",
    formID_taskModalTitle: "task-form-title",
    formID_empModal: "emp-form",
    formID_empModalTitle: "emp-form-title",
    formClass_heading: "form-heading",
    formClass_content: "form-content",
    formClass_infoArea: "form-info-div",
    formClass_imagePreview: "form-image-preview",
    formClass_imageContainer: "form-image-div"
}

export const generalID = {

    ID_overlayContainer: "overlay-display",
    ID_taskCancelBtn: "task-cancel-btn",
    ID_empCancelBtn: "emp-cancel-btn",
    ID_taskUpdateBtn: "emp-update-btn",
    ID_empUpdateBtn: "task-update-btn",
    ID_deleteBtn: "delete-btn",
    ID_submitBtn: "submit-btn",
    //taskFormParentID: "submit-task",//no longer used
    //empFormParentID: "submit-emp",//no longer used
    ID_generalMsg: "general-msg",
    ID_loginMsg: "login-msg",
    ID_taskMsg: "task-message",
    ID_fnameMsg: "fname-message",
    ID_lnameMsg: "lname-message",
    ID_emailMsg: "email-message",
    ID_sexMsg: "sex-message",
    ID_taskInput: "task-id",
    ID_fnameInput: "fname-id",
    ID_lnameInput: "lname-id",
    ID_emailInput: "email-id",
    ID_imageInput: "img-upload"
}


//rename the properties

export const tables = {

    tableID: "render-table",
    tableHeaderID: "tableHdr",
    tableBodyID: "tableBody",
    tableHeaderClass: "thead-style",
    tableClass: "table-styling",
    thClass: "th-style",
    thActionClass: "th-action",
    trClass: "tr-style",
    tdClass: "td-style",
    tdActionClass: "td-action"
}

export const buttons = {

    buttonClass: "btn-sizing",
    deleteBtnClass: "btn-sizing btn-red",
    cancelBtnClass: "btn-red float-right"
}

export const styledID = {

    createBtnOptionsID: "create-options",
    searchID: "search",
    renderDataClass: "mock-data",
    dangerZoneClass: "-danger-zone",//this class is used in conbination with the element ID that is passed by the functions
    formContainerClass: "option-border options"//class for the div container that the form resids in
}

export const graphical = {

    noDisplayClass: "no-display",
    messageClass: "message-background",
    confirmedClass: "confirmed-background",
    dataDisplayBGClass: "data-display-background",
    flash: "flash-indication",
    loading: "loading"
}


//will gradually be replaced by the objects defined above

export const loginAreaID = "login-area";
export const createBtnOptionsID = "create-options";
export const searchID = "search";
export const renderDataClass = "mock-data";

export const noDisplayClass = "no-display";
export const messageClass = "message-background";
export const confirmedClass = "confirmed-background";
export const dataDisplayBGClass = "data-display-background";
export const loading = "loading";

//element Titles
export const textInputTitle = "2 to 64 characters, must begin with a letter, and may also contain single quotes, as well as spaces.";
export const emailInputTitle = "8 to 128 characters, and must begin with a letter, and may also contain numbers, as well as periods.";
//export const searchTitle;
//element Aria
export const empUpdateBtnAria = "Submit button for the employee update form.";
export const taskUpdateBtnAria = "Submit button for the task update form.";
export const empCreateBtnAria = "Sreate new employee, button.";
export const taskCreateBtnAria = "Sreate new task, button.";
//export const searchAria;
//element Names

export const modal_containerID = "overlay-display";//change to general id category
export const modal_overlayClass = "modal-overlay";
export const modal_containerClass = "modal-container";
export const modal_headingClass = "modal-heading";

export const buttonClass = "btn-sizing";
export const deleteBtnClass = buttonClass + " btn-red";
export const cancelBtnClass = "btn-red float-right";
export const dangerZoneClass = "-danger-zone";//this class is used in conbination with the element ID that is passed by the functions
export const formContainerClass = "option-border options";//class for the div container that the form resids in

//forms
export const taskFormID = "task-form";
export const taskFormTitleID = "task-form-title";
export const empFormID = "emp-form";
export const empFormTitleID = "emp-form-title";
export const formHeadingClass = "form-heading";
export const formClass = "form-content";
export const formInfoAreaClass = "form-info-div";
export const imageAreaClass = "form-image-div";
export const imagePreviewClass = "form-image-preview";

export const tableID = "render-table";
export const tableClass = "table-styling";
export const tableHeaderID = "tableHdr";
export const tableHeaderClass = "thead-style";
export const tableBodyID = "tableBody";
export const thClass = "th-style";
export const thActionClass = "th-action";
export const trClass = "tr-style";
export const tdClass = "td-style";
export const tdActionClass = "td-action";

export const flash = "flash-indication";

//general ids
export const taskCancelBtnID = "task-cancel-btn";
export const empCancelBtnID = "emp-cancel-btn";
export const empUpdateBtnID = "emp-update-btn";
export const taskUpdateBtnID = "task-update-btn";
export const deleteBtnID = "delete-btn";
export const submitBtnID = "submit-btn";
export const taskFormParentID = "submit-task";
export const empFormParentID = "submit-emp";
export const generalMsgID = "general-msg";
export const loginMsgID = "login-msg";
export const taskMsgID = "task-message";
export const fnameMsgID = "fname-message";
export const lnameMsgID = "lname-message";
export const emailMsgID = "email-message";
export const sexMsgID = "sex-message";
