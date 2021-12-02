const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const db = require("./dataBase.js");
const pAuth = require("./pass-authenticator.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validator = require("./serverValidation.js")

passport.use(pAuth.getStrategy());
app.use(passport.initialize());

app.use(cors());
app.use(express.json({ limit: '1mb' }));//this is needed since bodyParser is depreciated
app.use('/static', express.static('static'));
app.use(express.urlencoded({ extended: false }));//this is necessary for my form submissions

const emp_route = "/api/employees";//optional name as param
const emp_paging = emp_route + "/page/";
const emp_find = emp_route + "/find";
const emp_register = emp_route + "/register";
const emp_update = emp_route + "/update";//id as param
const emp_delete = emp_route + "/delete";//id as param

const task_route = "/api/tasks";//optional name as param
const task_paging = task_route + "/page/";
const task_find = task_route + "/find";
const task_add = task_route + "/add";
const task_update = task_route + "/update";//id as param
const task_delete = task_route + "/delete";//id as param

let dbImages;
let defaultImage;

const numberOfResults = 10;
const collectionData = { numOfDocuments: 0, pages: 0, currentPage: 0, data: [] };

const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {

    db.connect()
        .then(() => {

            db.getDefaultImages()
                .then((images) => {

                    dbImages = images;
                    defaultImage = images[2].image;
                })
                .catch((err) => {
                    console.log("Server: default images could not be retrieved from database", err);
                });
        });

    console.log("Server: Express http server listening on: " + HTTP_PORT);
}

async function loadTotals(collectionName) {

    collectionData.numOfDocuments = await db.countDocuments(collectionName).then((total) => {

        collectionData.numOfDocuments = total;
        collectionData.pages = numOfPages(total, numberOfResults);
    });
}

//Returns the amount of pages based on the number of items displayed per page.
function numOfPages(total, numPerPage) {

    const pages = Math.ceil(total / numPerPage);

    return pages;
}

function updateCurrentPage(paramPage) {

    if (paramPage > -1) {

        if (paramPage >= collectionData.pages) {

            if (collectionData.pages <= 0) {

                collectionData.currentPage = 0;
            }
            else {

                collectionData.currentPage = collectionData.pages - 1;
            }
        }
        else {

            collectionData.currentPage = paramPage;
        }
    }
    else {

        collectionData.currentPage = 0;
    }
}


/***************************************************************
                       API ROUTES                          
***************************************************************/

//Login
/**************************************************************/

app.post("/api/login", (req, res) => {

    const data = req.body;
    const validResult = validateLogin(data);

    if (validResult.status === "error") {

        res.status(422).json(validResult);
        console.log("Server validation: " + validResult.message);
    }
    else {

        db.login(data)
            .then((data) => {

                var token = jwt.sign(data, pAuth.jwtOptions().secretOrKey);

                res.json({ message: "You are signed in", token: token, status: "success" });
                console.log("Server: login sucessful");

            })
            .catch((err) => {

                res.status(422).json({ message: err, status: "error" });
                console.log("Server: message from DB - " + err);
            })
    }
})

//Pages
/**************************************************************/

//home page
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "/views/home.html"));

    return 0;
});

//Paging

app.get(emp_route + "/getPaging", (req, res) => {

    loadTotals("employee_data");
    res.json(collectionData.pages);

    return 0;
})

app.get(task_route + "/getPaging", (req, res) => {

    loadTotals("task_data");
    res.json(collectionData.pages);

    return 0;
})

//CREATE
/**************************************************************/

app.post(emp_register, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in" }); }

        const data = req.body;
        const validResult = validateEmployee(data);

        if (validResult.status === "error") {

            res.status(422).json(validResult);
            console.log("Server validation: " + validResult.message);
        }
        else {

            if (data.image === "" || data.image === undefined) {

                data.image = defaultImage;
            }

            db.createEmployee(data)
                .then((msg) => {

                    res.json({ message: msg, status: "success" });
                    console.log("Server: message from DB - " + msg);
                })
                .catch((err) => {

                    res.status(422).json({ message: err, status: "error" });
                    console.log("Server: message from DB - " + err);
                });
        }

    })(req, res, next);
})

app.post(task_add, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in", status: "error" }); }

        const data = req.body;
        const validResult = validateTask(data);

        if (validResult.status === "error") {

            res.status(422).json(validResult);
            console.log("Server validation: " + validResult.message);
        }
        else {

            db.createTask(data)
                .then((msg) => {

                    res.json({ message: msg, status: "success" });
                    console.log("Server: message from DB - " + msg);
                })
                .catch((err) => {

                    res.status(422).json({ message: err, status: "error" });
                    console.log("Server: message from DB - " + err);
                });
        }
    })(req, res, next);
})

//READ
/**************************************************************/

//Find set
app.get(emp_paging + ":page", async (req, res, next) => {

    await loadTotals("employee_data");
    updateCurrentPage(Number(req.params.page));

    db.getSetOfEmployees(collectionData.currentPage * numberOfResults, numberOfResults).then((data) => {

        collectionData.data = data;
        res.json(collectionData)
        console.log("Server: employees, page " + (collectionData.currentPage + 1) + " of " + collectionData.pages + " retrieved");
    })
        .catch((err) => {

            console.log("Server: message from DB - " + err);
            res.status(500).json({ message: err, status: "error" }).end();
        });
});

app.get(task_paging + ":page", async (req, res, next) => {

    await loadTotals("task_data");
    updateCurrentPage(Number(req.params.page));

    db.getSetOfTasks(collectionData.currentPage * numberOfResults, numberOfResults).then((data) => {

        collectionData.data = data;
        res.json(collectionData)
        console.log("Server: tasks, page " + (collectionData.currentPage + 1) + " of " + collectionData.pages + " retrieved");
    })
        .catch((err) => {

            console.log("Server: message from DB - " + err);
            res.status(500).json({ message: err, status: "error" }).end();
        });
});

//Find by name
app.get(emp_find + "/name/:name", (req, res, next) => {

    const name = req.params.name;
    const validResult = validateSearch(true, name);

    if (validResult.status === "error") {

        res.status(422).json(validResult);
        console.log("Server validation: " + validResult.message);
    }
    else {

        db.getAllEmployees().then((data) => {

            let searchRes = [];
            data.map((emp) => {

                if (String(emp.first_name + " " + emp.last_name).toLocaleLowerCase().includes(name.toLocaleLowerCase())) {

                    searchRes.push(emp);
                }
            })

            res.json(paging(searchRes, numberOfResults));
            console.log("Server: employee search results retrieved");
        })
            .catch((err) => {

                console.log("Server: message from DB - " + err);
                res.status(500).json({ message: err, status: "error" }).end();
            });
    }
});

app.get(task_find + "/name/:name", (req, res, next) => {

    const name = req.params.name;
    const validResult = validateSearch(false, name);

    if (validResult.status === "error") {

        res.status(422).json(validResult);
        console.log("Server validation: " + validResult.message);
    }
    else {

        db.getAllTasks().then((data) => {

            let searchRes = [];
            data.map((task) => {

                if (String(task.task).toLocaleLowerCase().includes(name.toLocaleLowerCase())) {

                    searchRes.push(task);
                }
            })

            res.json(paging(searchRes, numberOfResults));
            console.log("Server: task search results retrieved");
        })
            .catch((err) => {

                console.log("Server: message from DB - " + err);
                res.status(500).json({ message: err, status: "error" }).end();
            });
    }
});

//Find all items.
//The find all functions have been replaced by the find set functions.
//These functions will remain for testing purposes, and not intended
//to be used in the demo.
app.get(emp_route, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in", status: "error" }); }

        db.getAllEmployees().then((data) => {

            res.json(data);
            console.log("Server: employee data set retrieved");
        })
            .catch((err) => {

                console.log("Server: message from DB - " + err);
                res.status(500).json({ message: err, status: "error" }).end();
            });

    })(req, res, next);
});

app.get(task_route, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in", status: "error" }); }

        db.getAllTasks().then((data) => {

            res.json(data);
            console.log("Server: task data set retrieved");
        })
            .catch((err) => {

                console.log("Server: message from DB - " + err);
                res.status(500).json({ message: err, status: "error" }).end();
            });

    })(req, res, next);

});

//UPDATE
/**************************************************************/

app.put(emp_update, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in", status: "error" }); }

        const data = req.body;
        const validResult = validateEmployee(data);

        if (validResult.status === "error") {

            res.status(422).json(validResult);
            console.log("Server validation: " + validResult.message);
        }
        else {

            let id = req.query.empID + "";

            if (data.image === "" || data.image === undefined) {

                data.image = defaultImage;
            }

            db.updateEmployee(id, data)
                .then((msg) => {

                    res.status(200).json({ message: msg, status: "success" });
                    console.log("Server: message from DB - " + msg);
                })
                .catch((err) => {

                    res.json({ message: err, status: "error" });
                    console.log("Server: message from DB - " + err);
                });
        }

    })(req, res, next);
})

app.put(task_update, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in", status: "error" }); }

        const data = req.body;
        const validResult = validateTask(data);

        if (validResult.status === "error") {

            res.status(422).json(validResult);
            console.log("Server validation: " + validResult.message);
        }
        else {

            let id = req.query.taskID + "";

            db.updateTask(id, data)
                .then((msg) => {

                    res.status(200).json({ message: msg, status: "success" });
                    console.log("Server: message from DB - " + msg);
                })
                .catch((err) => {

                    res.json({ message: err, status: "error" });
                    console.log("Server: message from DB - " + err);
                });
        }
    })(req, res, next);
})

//DELETE
/**************************************************************/

app.delete(emp_delete, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in", status: "error" }); }

        let id = req.query.empID + "";

        db.deleteEmployee(id)
            .then((msg) => {

                res.status(200).json({ message: msg, status: "success" });
                console.log("Server: message from DB - " + msg);
            })
            .catch((err) => {

                res.json({ message: err, status: "error" });
                console.log("Server: message from DB - " + err);
            });
    })(req, res, next);
});


app.delete(task_delete, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in", status: "error" }); }

        let id = req.query.taskID + "";

        db.deleteTask(id)
            .then((msg) => {

                res.status(200).json({ message: msg, status: "success" });
                console.log("Server: message from DB - " + msg);
            })
            .catch((err) => {

                res.json({ message: err, status: "error" });
                console.log("Server: message from DB - " + err);
            });
    })(req, res, next);
});


/***************************************************************
                       END OF ROUTES                         
***************************************************************/

function noData(value) {

    if (value === "" || value === null || value === undefined) {

        return true;
    }

    return false;
}

/***************************************************************
                       VALIDATION                         
***************************************************************/

function validateLogin(data) {

    if (noData(data.username) && noData(data.password)) {

        return { message: "Fields can not be left empty", status: "error" }
    }

    const unameValid = validator.validateUsername(data.username, 4, 64, "User Name", "");
    const passValid = validator.validatePassword(data.password, 8, 64, "Password", "");

    if (passValid.status === "success" && unameValid.status === "success") {

        return { message: "", status: "success" };
    }

    const unameErr = unameValid.status === "error" ? " 'Username'" : "";
    const passErr = passValid.status === "error" ? " 'Password'" : "";
    const addAnd = (unameErr !== "" && passErr !== "") ? " and" : "";
    const message = "Data not submitted: the" + unameErr + addAnd + passErr + " had errors";

    return { message: message, status: "error" };
}

function validateSearch(isEmp, data) {

    if (noData(data)) {

        return { message: "Fields can not be left empty", status: "error" }
    }

    if (isEmp) {

        const fieldValid = validator.validateText(data, 2, 128, "Employee Name", "");

        if (fieldValid.status === "success") {

            return { message: "", status: "success" };
        }
        else {

            return { message: "Data not submitted: the Employee Name entered had errors", status: "error" };
        }
    }
    else {

        const fieldValid = validator.validateTextAndNumbers(data, 2, 128, "Task Name", "");

        if (fieldValid.status === "success") {

            return { message: "", status: "success" };
        }
        else {

            return { message: "Data not submitted: the Task Name entered had errors", status: "error" };
        }
    }

}

function validateTask(data) {

    if (noData(data.task)) {

        return { message: "Fields can not be left empty", status: "error" }
    }

    const taskNameValid = validator.validateTextAndNumbers(data.task, 2, 128, "Task Name", "");

    if (taskNameValid.status === "success") {

        return { message: "", status: "success" };
    }

    return { message: "Data not submitted: the Task Name entered had errors", status: "error" };
}

function validateEmployee(data) {

    if (noData(data.first_name) && noData(data.last_name)
        && noData(data.email) && noData(data.sex)) {

        return { message: "Fields can not be left empty", status: "error" }
    }

    const fnameValid = validator.validateText(data.first_name, 2, 64, "First Name", "");
    const lnameValid = validator.validateText(data.last_name, 2, 64, "Last Name", "");
    const emailValid = validator.validateEmail(data.email, 8, 128, "Email", "");
    const sexValid = {
        message: (!data.sex) ? "A sex must be selected" : "",
        status: (!data.sex) ? "error" : "success",
        elementId: ""
    }

    if (fnameValid.status === "success" && lnameValid.status === "success" &&
        emailValid.status === "success" && sexValid.status === "success") {

        return { message: "", status: "success" };
    }

    const fnameErr = fnameValid.status === "error" ? " 'First Name'," : "";
    const lnameErr = lnameValid.status === "error" ? " 'Last Name'," : "";
    const emailErr = emailValid.status === "error" ? " 'Email'," : "";
    const sexErr = sexValid.status === "error" ? " 'Sex'," : "";
    const addAnd = (fnameErr !== "" || lnameErr !== "" || emailErr !== "") && sexErr !== "" ? " and" : "";
    const message = "Data not submitted: the" + fnameErr + lnameErr + emailErr + addAnd + sexErr + " had errors";

    return { message: message, status: "error" };
}





app.use((req, res) => {
    res.status(404).end();
});

app.listen(HTTP_PORT, onHttpStart);
