const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const dataService = require("./data-service.js");
const pAuth = require("./pass-authenticator.js");
const jwt = require("jsonwebtoken");
const passport = require("passport");

passport.use(pAuth.getStrategy());
app.use(passport.initialize());


app.use(cors());
app.use(express.json());//this is needed since bodyParser is depreciated
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


const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {

    dataService.connect();
    console.log("Express http server listening on: " + HTTP_PORT);
}

/***************************************************************
                       API ROUTES                          
***************************************************************/

//Admin Login
/**************************************************************/
app.post("/api/login", (req, res) => {

    dataService.adminCheck(req.body)
        .then((data) => {

            var payload = {

                _id: data._id,
                username: data.username
            }

            var token = jwt.sign(payload, pAuth.jwtOptions().secretOrKey);

            res.json({ "message": "login sucessful", "token": token });

        })
        .catch((err) => {

            res.status(422).json({ "message": err });
        })
})

//CREATE
/**************************************************************/

app.post(emp_register, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        dataService.createEmployee(req.body)
            .then((msg) => {

                res.json({ "message": msg });
            })
            .catch((err) => {

                res.status(422).json({ "message": err });
            });

    })(req, res, next);
})

app.post(task_add, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        dataService.createTask(req.body)
            .then((msg) => {

                res.json({ "message": msg });
            })
            .catch((err) => {

                res.status(422).json({ "message": err });
            });

    })(req, res, next);
})

//READ
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

//Find all items

app.get(emp_route, (req, res, next) => {

    dataService.getAllEmployees().then((data) => {

        res.json(data);
    })
        .catch((err) => {

            res.status(500).json({ "message": err }).end();
        });
});

app.get(task_route, (req, res, next) => {

    dataService.getAllTask().then((data) => {

        res.json(data);
    })
        .catch(() => {

            res.status(500).json({ "message": err }).end();
        });
});

//Find one or some
app.get(emp_find + "/:empID", (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        let id = req.query.empID + "";

        dataService.findEmployee(id).then((data) => {

            res.json(data);
        })
            .catch((err) => {

                res.status(500).json({ "message": err }).end();
            });


    })(req, res, next);
});

app.get(task_find + "/:taskID", (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        let id = req.query.taskID + "";

        dataService.findTask(id).then((data) => {

            res.json(data);
        })
            .catch((err) => {

                res.status(500).json({ "message": err }).end();
            });


    })(req, res, next);
});

//UPDATE
/**************************************************************/

app.put(emp_update, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        let id = req.query.empID + "";

        dataService.updateEmployee(id, req.body)
            .then((msg) => {

                res.status(200).json({ "message": msg });
            })
            .catch((err) => {

                res.json({ "message": err });
            });

    })(req, res, next);
})

app.put(task_update, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        let id = req.query.taskID + "";

        dataService.updateTask(id, req.body)
            .then((msg) => {

                res.status(200).json({ "message": msg });
            })
            .catch((err) => {

                res.json({ "message": err });
            });

    })(req, res, next);
})

//DELETE
/**************************************************************/

app.delete(emp_delete, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        let id = req.query.empID + "";

        dataService.deleteEmployee(id)
            .then((msg) => {

                res.status(200).json({ "message": msg });
            })
            .catch((err) => {

                res.json({ "message": msg });
            });
    })(req, res, next);
});


app.delete(task_delete, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        let id = req.query.taskID + "";

        dataService.deleteTask(id)
            .then((msg) => {

                res.status(200).json({ "message": msg });
            })
            .catch((err) => {

                res.json({ "message": err });
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
