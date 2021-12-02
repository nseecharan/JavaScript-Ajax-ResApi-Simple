export const DataManager = () => {

    let dbResponse = { message: "", status: "" };
    let dataSet = [];
    let searchResults = [];
    let token;
    let currentPage = 0;
    let lastPage = 0;
    let renderPretty = true;

    const getResponse = () => dbResponse;
    const getSearchResults = () => searchResults;
    const getToken = () => token;
    const getData = () => dataSet;
    const getCurrentPage = () => currentPage;
    const getLastPage = () => lastPage;
    const getRenderStyle = () => renderPretty;

    const setResponse = (newData) => {

        dbResponse = newData;
    }
    const addSearchItem = (data) => {

        searchResults.push(data);
    }
    const clearSearchResults = () => {

        searchResults = [];
    }
    const setToken = (data) => {

        token = data;
    }
    const setData = (data) => {

        dataSet = [...data];
    }
    const setCurrentPage = (current) => {

        currentPage = current;
    }
    const incrementPage = () => {

        if (currentPage < lastPage) {

            currentPage++;
        }
    }
    const decrementPage = () => {

        if (currentPage > 0) {

            currentPage--;
        }
    }
    const setLastPage = (last) => {

        lastPage = last;
    }
    const toggleRenderStyle = () => {

        if (renderPretty === true) {

            renderPretty = false;
        }
        else {

            renderPretty = true;
        }
    }

    return {

        setResponse, getResponse,
        addSearchItem, getSearchResults, clearSearchResults,
        setToken, getToken,
        setData, getData,
        setCurrentPage, getCurrentPage,
        incrementPage, decrementPage,
        setLastPage, getLastPage,
        toggleRenderStyle, getRenderStyle
    }
}