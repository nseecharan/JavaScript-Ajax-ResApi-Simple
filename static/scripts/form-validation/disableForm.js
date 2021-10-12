//This will disable or enable all elements for the form element that is passed to this funciton
export const disableForm = (form, disable) => {

    for (let i = 0; i < form.elements.length; i++) {

        form.elements[i].disabled = disable;
    }
}