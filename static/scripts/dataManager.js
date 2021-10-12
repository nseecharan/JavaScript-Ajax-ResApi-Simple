//current export causes issues in heroku -- not found

const DataManager = () => {

    let dbResponse;
    let searchResults = [];
    let token;

    const setData = (newData) => {

        dbResponse = newData;
    }
    const getData = () => {

        return dbResponse;
    }
    const addSearchItem = (data) => {

        searchResults.push(data);
    }
    const getSearchResults = () => {

        return searchResults;
    }
    const clearSearchResults = () => {

        searchResults = [];
    }
    const setToken = (data) => {

        token = data;
    }
    const getToken = () => {

        return token;
    }

    return {

        setData,
        getData,
        addSearchItem,
        getSearchResults,
        clearSearchResults,
        setToken,
        getToken,
    }
}

export default DataManager;