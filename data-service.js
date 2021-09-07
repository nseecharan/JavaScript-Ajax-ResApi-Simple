require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let mongoDBConnectionString = process.env.CONNECTION_STRING;

let employeeSchema = new mongoose.Schema({

    first_name: String,
    last_name: String,
    email: {

        type: String,
        unique: true
    },
    gender: String,
    image: String,
    status: String
    //status flags demo/editable
    //-demo is for protected demo examples that can not be modified or deleted
    //-editable is for newly added data that users can modify or delete
},
    { collection: 'employee_data' }
);

let taskSchema = new mongoose.Schema({

    task: {

        type: String,
        unique: true
    },
    status: String
},
    { collection: 'task_data' }
);

let adminSchema = new mongoose.Schema({

    username: String,
    password: String
},
    { collection: 'admin_data' }
);

let Employee;
let Task;

let Admin;

let db = mongoose.createConnection(mongoDBConnectionString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

module.exports.connect = function () {

    return new Promise(function (resolve, reject) {

        db.on('error', (err) => {
            console.log("error");
            reject("there was an error connecting to database: " + err); // reject the promise with the provided error
        });

        db.once('open', () => {
            console.log("connected");
            Employee = db.model("employee_data", employeeSchema);
            Task = db.model("task_data", taskSchema);

            //admin if schema does not exist
            Admin = db.model("admin_data", adminSchema);

            //reset to default number of employees and tasks

            Employee.deleteMany({ $or: [{ status: "editable" }, { status: "test" }] })
                .exec()
                .then(() => {

                    console.log("removed all new employees");
                })
                .catch((err) => {

                    console.log("There was an error deleting all new employees", err);
                });

            Task.deleteMany({ $or: [{ status: "editable" }, { status: "test" }] })
                .exec()
                .then(() => {

                    console.log("removed all new tasks");
                })
                .catch((err) => {

                    console.log("There was an error deleting all new tasks", err);
                });

            resolve("Connected to database");
        });       
    });
};

/***************************************************************
                       DB CREATE                          
***************************************************************/

//create demo admin with Hashed password
//this function is intended only for development purposes
//a proper create admin funciton will be made in future updates
module.exports.createAdmin = function () {

    return new Promise(function (resolve, reject) {

        bcrypt.hash(process.env.DEMO_ADMIN_PASSWORD, 10).then(hash => {

            let newAdmin = new Admin({username:"Admin",password:hash});
           
            newAdmin.save((err)=>{

                if(err){

                    if(err.code == 11000){

                        reject("User Name taken");
                    }
                    else{

                        reject("Error creating Admin: " + err);
                    }
                }
                else{

                    resolve("added Admin");
                }
            })
        })
    })
}

module.exports.createEmployee = function (empData) {

    return new Promise(function (resolve, reject) {

        let newEmp = new Employee(empData);

        newEmp.save((err, data) => {

            if (err) {

                reject("There was an error creating the employee: " + err);
            }
            else {

                resolve("Employee " + data.first_name + " " + data.last_name + " successfully created");
            }
        });
    });
};

module.exports.createTask = function (taskData) {

    return new Promise(function (resolve, reject) {

        let newTask = new Task(taskData);

        //newTask.status = "editable";//explicitly making it editable

        newTask.save((err, data) => {

            if (err) {

                reject("There was an error creating the task: " + err);
            }
            else {

                resolve("Task " + data.task + " successfully created");
            }
        });
    });
};

/***************************************************************
                       DB READ                          
***************************************************************/

//EMPLOYEES
/**************************************************************/

module.exports.getSetOfEmployees = function (limit) {

    return new Promise(function (resolve, reject) {

        Employee.find({})
            .limit(limit)
            .exec()
            .then((employees) => {

                if (employees.length == 0) {

                    reject("There was an error retrieving the employees");
                }
                else {

                    resolve(employees);
                }
            })
            .catch((err) => {

                reject("Critical error trying to retrieve employees: " + err);
            });
    })
}

module.exports.getAllEmployees = function () {

    return new Promise(function (resolve, reject) {

        Employee.find({}, function (err, data) {

            if (err) {

                reject("There was an error retrieving the employees: " + err);
            }
            else {

                resolve(data)
            }
        });
    });
};

module.exports.findEmployee = function (fname, lname) {


    console.log("data-service find emp", fname, lname)

    return new Promise(function (resolve, reject) {

        //.exec is needed to make this a proper promise if no callback function is passed to the find() after the array arg
        Employee.find({ first_name: fname, last_name: lname })
            //.limit(1)
            .exec()
            .then((employee) => {

                if (employee.length == 0) {

                    reject("Unable to find employee " + employee.first_name);
                }
                else {

                    resolve(employee);
                }
            })
            .catch((err) => {

                reject("Critical error trying to find employee: " + err);
            });
    });
};

//TASKS
/**************************************************************/

module.exports.getSetOfTasks = function (limit) {

    return new Promise(function (resolve, reject) {

        Task.find({})
            .limit(limit)
            .exec()
            .then((tasks) => {

                if (tasks.length == 0) {

                    reject("There was an error retrieving the tasks");
                }
                else {

                    resolve(tasks);
                }
            })
            .catch((err) => {

                reject("Critical error trying to retrieve tasks: " + err);
            });
    })
}

module.exports.getAllTask = function (req, res) {

    return new Promise(function (resolve, reject) {

        Task.find({}, function (err, data) {

            if (err) {

                reject("There was an error retrieving the tasks: " + err);
            }
            else {

                resolve(data)
            }
        });
    });
};

module.exports.findTask = function (task_name) {

    return new Promise(function (resolve, reject) {

        Task.find({ task: task_name })
            .limit(1)
            .exec()
            .then((task) => {

                if (task.length == 0) {

                    reject("Unable to find task " + task.task);
                }
                else {

                    resolve(task);
                }
            })
            .catch((err) => {

                reject("Critical error trying to find task: " + err);
            });
    });
};

/***************************************************************
                       DB UPDATE
***************************************************************/

module.exports.updateEmployee = function (id, employee) {

    //console.log("update emp data from data-service",employee)

    return new Promise(function (resolve, reject) {

        //updateOne args = search query, document fields to change, flag to update multiple matching documents
        Employee.updateOne({ _id: id, $or: [{ status: "editable" }, { status: "test" }] },
            {
                $set: {
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    email: employee.email,
                    gender: employee.gender,
                    image: employee.image
                }
            })
            .exec()
            .then(() => {

                resolve("Employee updated sucessfully");
            })
            .catch((err) => {

                reject("There was an error updating the employee: " + err);
            });
    });
};

module.exports.updateTask = function (id, task) {

    //console.log("update task data from data-service",task)

    return new Promise(function (resolve, reject) {

        Task.updateOne({ _id: id, $or: [{ status: "editable" }, { status: "test" }] }, { $set: { task: task.task } })
            .exec()
            .then(() => {

                resolve("Task updated successfully")
            })
            .catch((err) => {

                reject("There was an error updating the task: " + err);
            });
    });
};

/***************************************************************
                       DB DELETE
***************************************************************/

module.exports.deleteEmployee = function (id) {


    console.log("delete one emp")
    return new Promise(function (resolve, reject) {

        Employee.deleteOne({ _id: id, $or: [{ status: "editable" }, { status: "test" }] })
            .exec()
            .then(() => {


                resolve("Employee removed sucessfully")
            })
            .catch((err) => {

                console.log("There was an error removing the employee", err);
            });
    });
};

module.exports.deleteTask = function (id) {

    return new Promise(function (resolve, reject) {

        Task.deleteOne({ _id: id, $or: [{ status: "editable" }, { status: "test" }] })
            .exec()
            .then(() => {

                resolve("Task removed sucessfully");
            })
            .catch((err) => {

                reject("There was an error removing the task: " + err);
            });
    })
}

module.exports.adminCheck = function (adminData) {

    return new Promise(function (resolve, reject) {

        console.log("data service admin check", adminData.username)

        Admin.find({ username: adminData.username })
            .limit(1)
            .exec()
            .then(((admin) => {

                if (admin.length == 0) {

                    reject("Admin account for " + adminData.username + " not found");
                }
                else {

                    bcrypt.compare(adminData.password, admin[0].password)
                        .then((res) => {

                            if (res === true) {

                                console.log("login sucessful")
                                resolve(admin[0]);
                            }
                            else {

                                console.log("incorrect password")
                                reject("incorrect password for " + adminData.username);
                            }
                        })
                        .catch((err) => {

                            console.log("login error")
                            reject("An error occured: " + err);
                        })
                }
            }))
            .catch((err) => {

                console.log("login account not found")
                reject("Admin account for " + adminData.username + " not found");
            })
    })
}
