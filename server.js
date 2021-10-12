const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const db = require("./dataBase.js");
const pAuth = require("./pass-authenticator.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");

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
                    console.log("default images could not be retrieved from database");
                });
        });

    console.log("Express http server listening on: " + HTTP_PORT);
}

/***************************************************************
                       API ROUTES                          
***************************************************************/

//Login
/**************************************************************/

app.post("/api/login", (req, res) => {

    db.login(req.body)
        .then((data) => {

            var token = jwt.sign(data, pAuth.jwtOptions().secretOrKey);

            res.json({ "message": "You are signed in", "token": token, status: "success" });

        })
        .catch((err) => {

            res.status(422).json({ "message": err, status: "error" });
        })
})

//Pages
/**************************************************************/

//home page
app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "/views/home.html"));

    return 0;
});

//login page
app.get("/login", (req, res) => {

    res.sendFile(path.join(__dirname, "/views/login.html"));

    return 0;
});

//CREATE
/**************************************************************/

app.post(emp_register, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        let newEmployee = req.body;

        //TODO:server side validataion

        if (newEmployee.first_name === "" || newEmployee.last_name === "" ||
            newEmployee.email === "" || newEmployee.sex === "") {

            res.status(422).json({ "message": "Fields can not be left empty", status: "error" });
        }
        else {

            if (newEmployee.image === "" || newEmployee.image === undefined) {

                newEmployee.image = defaultImage;
            }

            db.createEmployee(newEmployee)
                .then((msg) => {

                    res.json({ "message": msg, status: "success" });
                })
                .catch((err) => {

                    res.status(422).json({ "message": err, status: "error" });
                });
        }
    })(req, res, next);
})

app.post(task_add, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in", status: "error" }); }

        //TODO:server side validation

        if (req.body.task === "") {

            res.status(422).json({ "message": "Fields can not be left empty", status: "error" });
        }
        else {

            db.createTask(req.body)
                .then((msg) => {

                    res.json({ "message": msg, status: "success" });
                })
                .catch((err) => {

                    res.status(422).json({ "message": err, status: "error" });
                });
        }
    })(req, res, next);
})

//READ
/**************************************************************/

//Find all items
app.get(emp_route, (req, res, next) => {

    db.getAllEmployees().then((data) => {

        res.json(data);
    })
        .catch((err) => {

            res.status(500).json({ "message": err, status: "error" }).end();
        });
});

app.get(task_route, (req, res, next) => {

    db.getAllTask().then((data) => {

        res.json(data);
    })
        .catch(() => {

            res.status(500).json({ "message": err, status: "error" }).end();
        });
});

//Find one or some
app.get(emp_find + "/:empID", (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in", status: "error" }); }

        let id = req.query.empID + "";

        db.findEmployee(id).then((data) => {

            res.json(data);
        })
            .catch((err) => {

                res.status(500).json({ "message": err, status: "error" }).end();
            });


    })(req, res, next);
});

app.get(task_find + "/:taskID", (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in", status: "error" }); }

        let id = req.query.taskID + "";

        db.findTask(id).then((data) => {

            res.json(data);
        })
            .catch((err) => {

                res.status(500).json({ "message": err, status: "error" }).end();
            });


    })(req, res, next);
});

//UPDATE
/**************************************************************/

app.put(emp_update, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in", status: "error" }); }



        //TODO: server side validation

        let updateEmployee = req.body;

        if (updateEmployee.first_name === "" || updateEmployee.last_name === "" ||
            updateEmployee.email === "" || updateEmployee.sex === "") {

            res.status(422).json({ "message": "Fields can not be left empty", status: "error" });
        }
        else {

            let id = req.query.empID + "";

            if (updateEmployee.image === "" || updateEmployee.image === undefined) {

                updateEmployee.image = defaultImage;
            }

            db.updateEmployee(id, req.body)
                .then((msg) => {

                    res.status(200).json({ "message": msg, status: "success" });
                })
                .catch((err) => {

                    res.json({ "message": err, status: "error" });
                });
        }

    })(req, res, next);
})

app.put(task_update, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in", status: "error" }); }

        //TODO: server side validation

        if (req.body.task === "") {

            res.status(422).json({ "message": "Fields can not be left empty", status: "error" });
        }
        else {

            let id = req.query.taskID + "";

            db.updateTask(id, req.body)
                .then((msg) => {

                    res.status(200).json({ "message": msg, status: "success" });
                })
                .catch((err) => {

                    res.json({ "message": err, status: "error" });
                });
        }
    })(req, res, next);
})

//DELETE
/**************************************************************/

app.delete(emp_delete, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in", status: "error" }); }

        let id = req.query.empID + "";

        db.deleteEmployee(id)
            .then((msg) => {

                res.status(200).json({ "message": msg, status: "success" });
            })
            .catch((err) => {

                res.json({ "message": msg, status: "error" });
            });
    })(req, res, next);
});


app.delete(task_delete, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in", status: "error" }); }

        let id = req.query.taskID + "";

        db.deleteTask(id)
            .then((msg) => {

                res.status(200).json({ "message": msg, status: "success" });
            })
            .catch((err) => {

                res.json({ "message": err, status: "error" });
            });
    })(req, res, next);
});


/***************************************************************
                       END OF ROUTES                         
***************************************************************/


app.use((req, res) => {
    res.status(404).end();
});

app.listen(HTTP_PORT, onHttpStart);
