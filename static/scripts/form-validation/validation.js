//password reg based on one found here
//https://techearl.com/regular-expressions/regex-password-strength-validation

const searchPattern = /^[^\d!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~]*?$/gi;
const textPattern = /^[a-zA-Z][a-zA-Z'\s]{0,}$/g;
const textNumbersPattern = /^[a-zA-Z0-9][a-zA-Z0-9'\s]{0,}$/g;
const usernamePattern = /^[a-zA-Z][a-zA-Z0-9.]{0,}$/g;
const passwordPattern = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~])[a-zA-Z0-9!"#\$%&'\(\)\*\+,-\.\/:;<=>\?@[\]\^_`\{\|}~]{0,}$/g;
const emailPattern = /^[A-Z][A-Z0-9.]+@[A-Z0-9.]+\.[A-Z]{0,}$/gi; //roughly based on google email rules

//Search field validation that allows for letters, dashes, and quotes
export const validateSearch = (str, max, fieldName, elementId) => {

  //User can enter nothing.
  if (str.length === 0) {

    return { message: "", status: "success", elementId: elementId }
  }

  let res = testInput(str, searchPattern, 0, max, fieldName, elementId);

  if (res.status == "error" && res.message == "") {

    res.message = "The " + fieldName + " may only contain letters, single quotes, and spaces";
  }

  return res;
}

//Name validation that allows for letters, dashes, and quotes
export const validateText = (str, min, max, fieldName, elementId) => {

  let res = testInput(str, textPattern, min, max, fieldName, elementId);

  if (res.status == "error" && res.message == "") {

    res.message = "The " + fieldName + " must begin with a letter, and may also contain single quotes, as well as spaces";
  }

  return res;
}

export const validateTextAndNumbers = (str, min, max, fieldName, elementId) => {

  let res = testInput(str, textNumbersPattern, min, max, fieldName, elementId);

  if (res.status == "error" && res.message == "") {

    res.message = "The " + fieldName + " must begin with a letter or number, and may also contain single quotes, as well as spaces";
  }

  return res;
}

//Name validation that allows for letters, dashes, and quotes
export const validateUsername = (str, min, max, fieldName, elementId) => {

  let res = testInput(str, usernamePattern, min, max, fieldName, elementId);

  if (res.status == "error" && res.message == "") {

    res.message = "The " + fieldName + " must begin with a letter, and may also contain numbers, as well as periods";
  }

  return res;
}

//Email validation with some special characters allowed
export const validateEmail = (str, min, max, fieldName, elementId) => {

  let res = testInput(str, emailPattern, min, max, fieldName, elementId);

  if (res.status == "error" && res.message == "") {

    res.message = "The " + fieldName + " must begin with a letter, and may also contain numbers, as well as periods";
  }

  return res;
}

export const validatePassword = (str, min, max, fieldName, elementId) => {

  let res = testInput(str, passwordPattern, min, max, fieldName, elementId);

  if (res.status == "error" && res.message == "") {

    res.message = "The " + fieldName + " must be " + min + " or more characters, and should contain a mix of upper case letters, lower case letters, numbers, as well as special symbols";
  }

  return res;
}

const testInput = (str, pattern, min, max, fieldName, elmtId) => {

  let result = { message: "", status: undefined, elementId: elmtId };

  if (str == "") {

    return result;
  }
  else {

    if (str.length < min || str.length > max) {

      result.message = "Sorry " + fieldName + " must be " + min + " to " + max + " characters long";
      result.status = "error";
      return result;
    }
  }

  if (str.match(pattern) == null) {

    result.status = "error";
    return result;
  }

  result.message = str;
  result.status = "success";
  return result;
}