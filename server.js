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
const emp_find = emp_route + "/find"
const emp_register = emp_route + "/register";
const emp_update = emp_route + "/update";//id as param
const emp_delete = emp_route + "/delete";//id as param

const task_route = "/api/tasks";//optional name as param
const task_find = task_route + "/find";
const task_add = task_route + "/add";
const task_update = task_route + "/update";//id as param
const task_delete = task_route + "/delete";//id as param

let dbImages;
let defaultImage;
let orderedResults = [];

const numberOfResults = 10;

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

/***************************************************************
                       API ROUTES                          
***************************************************************/

//Login
/**************************************************************/

app.post("/api/login", (req, res) => {

    const data = req.body;
    const validResult = validation(data);

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

    orderedResults = [];

    res.sendFile(path.join(__dirname, "/views/home.html"));

    return 0;
});

//CREATE
/**************************************************************/

app.post(emp_register, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in" }); }

        const data = req.body;
        const validResult = validation(data);

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
        const validResult = validation(data);

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

function empliteList(data) {

    let liteList = [];
    data.map((item) => {

        const smallObject = {

            _id: item._id,
            first_name: item.first_name,
            last_name: item.last_name,
            email: item.email,
            sex: item.sex,
            status: item.status
        }

        liteList.push(smallObject);
    })

    return liteList;
}

function paging(data, numPerPage) {

    let pageArray = data;
    orderedResults = [];
    const pages = Math.ceil(data.length / numPerPage);

    for (let i = 0; i < pages; i++) {

        let quantity = pageArray.splice(0, numPerPage);
        orderedResults.push(quantity);
    }

    return { data: orderedResults[0], pages: pages };
}

//Change the current page of data.
app.get("/api/loaded-data/page/:page", (req, res, next) => {

    try {

        const page = Number(req.params.page);

        if (orderedResults.length) {

            res.status(200).json({ data: orderedResults[page], pages: orderedResults.length })
        }
        else {

            res.status(503).json({ message: "Data needs to be populated before this feature can be used", status: "error" })
        }
    }
    catch (error) {

        res.status(400).json({ message: "Error populating data", status: "error" })
    }
})

//Find all items.
app.get(emp_route, (req, res, next) => {

    db.getAllEmployees().then((data) => {

        //let emplite = empliteList(data);

        res.json(paging(data, numberOfResults));
        console.log("Server: employee data set retrieved");
    })
        .catch((err) => {

            console.log("Server: message from DB - " + err);
            res.status(500).json({ message: err, status: "error" }).end();
        });
});

app.get(task_route, (req, res, next) => {

    db.getAllTasks().then((data) => {

        res.json(paging(data, numberOfResults));
        console.log("Server: task data set retrieved");
    })
        .catch((err) => {

            console.log("Server: message from DB - " + err);
            res.status(500).json({ message: err, status: "error" }).end();
        });
});

//Find by name.
app.get(emp_find + "/name/:name", (req, res, next) => {

    const name = req.params.name;

    //TODO validation when this gets implemented in client side

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
});

app.get(task_find + "/name/:name", (req, res, next) => {

    const name = req.params.name;

    //TODO validation when this gets implemented in client side

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
});

//UPDATE
/**************************************************************/

app.put(emp_update, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ message: "Please log in", status: "error" }); }

        const data = req.body;
        const validResult = validation(data);

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
        const validResult = validation(data);

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


//TODO: Break this function up, then add validation to search routes
function validation(data) {

    if (data.username) {

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
    else {

        if (data.task) {

            if (noData(data.task)) {

                return { message: "Fields can not be left empty", status: "error" }
            }

            const taskNameValid = validator.validateTextAndNumbers(data.task, 2, 128, "Task Name", "");

            if (taskNameValid.status === "success") {

                return { message: "", status: "success" };
            }

            return { message: "Data not submitted: the task name entered had errors", status: "error" };
        }
        else {

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
    }
}

app.use((req, res) => {
    res.status(404).end();
});

app.listen(HTTP_PORT, onHttpStart);
