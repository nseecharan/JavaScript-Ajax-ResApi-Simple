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

let emp_route = "/api/employees";//optional name as param
let emp_find = emp_route + "/search"
let emp_register = emp_route + "/register";
let emp_update = emp_route + "/update";//id as param
let emp_delete = emp_route + "/delete";//id as param

let task_route = "/api/tasks";//optional name as param
let task_find = task_route + "/search";
let task_add = task_route + "/api/tasks/add";
let task_update = task_route + "/update";//id as param
let task_delete = task_route + "/delete";//id as param


const HTTP_PORT = process.env.PORT || 8080;

function onHttpStart() {

    dataService.connect();//For demo purposes; would normally be in every api call
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

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        dataService.getAllEmployees().then((data) => {

            res.json(data);
        })
            .catch((err) => {

                res.status(500).json({ "message": err }).end();
            });

    })(req, res, next);

    console.log("find all")
});

app.get(task_route, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        dataService.getAllTask().then((data) => {

            res.json(data);
        })
            .catch(() => {

                res.status(500).json({ "message": err }).end();
            });

    })(req, res, next);
});

//Find one or some
app.get(emp_find, passport.authenticate('jwt', { session: false }), (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        if (req.query.fname) {

            let fname = req.query.fname + "";
            let lname = req.query.lname + "";

            dataService.findEmployee(fname, lname).then((data) => {

                res.json(data);
            })
                .catch((err) => {

                    res.status(500).json({ "message": err }).end();
                });
        }

    })(req, res, next);
});

app.get(task_find, (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        if (req.query.taskName) {

            dataService.findTask(req.query.taskName.toString()).then((data) => {

                res.json(data);
            })
                .catch((err) => {

                    res.status(500).json({ "message": err }).end();
                });
        }

    })(req, res, next);
});

//UPDATE
/**************************************************************/

app.put(emp_update + "/:empID", (req, res, next) => {

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

app.put(task_update + "/:taskID", (req, res, next) => {

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

app.delete(emp_delete + "/:empID", (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        dataService.deleteEmployee(req.query.empID)
            .then((msg) => {

                res.status(200).json({ "message": msg });
            })
            .catch((err) => {

                res.json({ "message": err });
            });

    })(req, res, next);
});

app.delete(task_delete + "/:taskID", (req, res, next) => {

    passport.authenticate('jwt', { session: false }, (err, success, info) => {

        if (err) { return next(err); }
        if (!success) { return res.status(401).json({ "message": "Please log in" }); }

        dataService.deleteTask(req.query.taskID)
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


/***************************************************************
                 DEMO FUNCTION FOR MAIN ROUTES                       
***************************************************************/

let demo_emp_read = "/api/demo/employees";
let demo_task_read = "/api/demo/tasks";
let demo_emp_update = demo_emp_read + "/update";
let demo_task_update = demo_task_read + "/update";
let demo_emp_create = demo_emp_read + "/create";
let demo_task_create = demo_task_read + "/create";
let demo_emp_delete = demo_emp_read + "/delete";
let demo_task_delete = demo_task_read + "/delete";


//demo_create
app.post(demo_emp_create, (req, res) => {

    let d_emp = {

        first_name: 'Jim',
        last_name: 'Callen',
        email: 'j.callen@_demo.ca',
        gender: 'M',
        image: '',
        status: 'test'
    }

    console.log("server: create employee", d_emp)

    dataService.createEmployee(d_emp)
        .then((msg) => {

            res.json({ "message": msg });
        })
        .catch((err) => {

            res.status(422).json({ "message": err });
        });
})

app.post(demo_task_create, (req, res) => {

    let d_task = {

        task: "Washroom Duty",
        status: "test"
    }

    console.log("server: create task", d_task)

    dataService.createTask(d_task)
        .then((msg) => {

            res.json({ "message": msg });
        })
        .catch((err) => {

            res.status(422).json({ "message": err });
        });
})

//demo_find_all
app.get(demo_emp_read, (req, res) => {

    if (req.query.fname) {

        let fname = req.query.fname + "";
        let lname = req.query.lname + "";

        dataService.findEmployee(fname, lname).then((data) => {

            res.json(data);
        })
            .catch((err) => {

                res.status(500).json({ "message": err }).end();
            });
    }
    else {

        console.log("find all")

        dataService.getAllEmployees().then((data) => {

            res.json(data);
        })
            .catch((err) => {

                res.status(500).json({ "message": err }).end();
            });
    }
});

app.get(demo_task_read, (req, res) => {

    dataService.getAllTask().then((data) => {

        res.json(data);
    })
        .catch((err) => {

            res.status(500).json({ "message": err }).end();
        });
});

//demo_find_some
app.get(demo_emp_read + "/find", (req, res) => {

    if (req.query.fname) {

        let fname = req.query.fname + "";
        let lname = req.query.lname + "";

        dataService.findEmployee(fname, lname).then((data) => {

            res.json(data);
        })
            .catch((err) => {

                res.status(500).json({ "message": err }).end();
            });
    }
});

app.get(demo_task_read + "/find", (req, res) => {

    if (req.query.taskName) {

        dataService.findTask(req.query.taskName.toString()).then((data) => {

            res.json(data);
        })
            .catch((err) => {

                res.status(500).json({ "message": err }).end();
            });
    }
});

//demo_update
app.put(demo_emp_update, (req, res) => {

    console.log("emp update from route", req.query.empID, req.body)

    let id = req.query.empID + "";

    dataService.updateEmployee(id, req.body)
        .then((msg) => {

            res.status(200).json({ "message": msg });
        })
        .catch((err) => {

            res.json({ "message": msg });
        });
})

app.put(demo_task_update, (req, res) => {

    console.log("task update from route", req.query.taskID, req.body)

    let id = req.query.taskID + "";

    dataService.updateTask(id, req.body)
        .then((msg) => {

            res.status(200).json({ "message": msg });
        })
        .catch((err) => {

            res.json({ "message": err });
        });
})

//demo_delete
app.delete(demo_emp_delete, (req, res) => {

    console.log("---server demo delete")

    let id = req.query.empID + "";

    console.log("server delete emp id", id)

    dataService.deleteEmployee(id)
        .then((msg) => {

            res.status(200).json({ "message": msg });
        })
        .catch((err) => {

            res.json({ "message": msg });
        });
});

app.delete(demo_task_delete, (req, res) => {

    let id = req.query.taskID + "";

    dataService.deleteTask(id)
        .then((msg) => {

            res.status(200).json({ "message": msg });
        })
        .catch((err) => {

            res.json({ "message": err });
        });
});






app.use((req, res) => {
    res.status(404).end();
});

app.listen(HTTP_PORT, onHttpStart);
