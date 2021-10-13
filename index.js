// required packages for the application
const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');
const db = require('./config/config')
console.log("Welcome to employee manager.");
// initial function runs after node index.js
function init() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'new',
                message: "What would you like to do?",
                choices: ["View all employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
            }
        ])
        .then((response) => {
            if (response.new === "View all employees") {
                viewAllEmp();
            } else if (response.new === "Add Employee") {
                addEmployee();
            } else if (response.new === "Update Employee Role") {
                updateRole();
            } else if (response.new === "View All Roles") {
                viewAllRoles();
            } else if (response.new === "Add Role") {
                addRole();
            } else if (response.new === "View All Departments") {
                viewAllDept();
            } else if (response.new === "Add Department") {
                addDepartment();
            } else {
                quit();
            }
        })
}
// table of employee information 
function viewAllEmp() {
    const joinEmp = `
    SELECT employee.first_name, employee.last_name, _role.title, department.department_name, _role.salary, CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee 
    INNER JOIN _role ON employee.role_id = _role.id
    INNER JOIN department ON _role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id;`
    db.query(joinEmp, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log("--------------------------------------------------------------------------------");
        console.table(results);
        console.log("--------------------------------------------------------------------------------");
        init();
    })
}
// function to add an employee
function addEmployee() {
    const joinEmp = `
    SELECT _role.title, _role.id, manager.id AS manager_id, CONCAT (manager.first_name, " ", manager.last_name) AS manager
    FROM employee
    JOIN _role ON employee.role_id = _role.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    LEFT JOIN employee manager_id ON employee.manager_id = manager_id.id;`
    db.query(joinEmp, function (err, results) {
        if (err) {
            console.log(err);
        }
        const managerArr = results.map(({ manager, manager_id }) => ({ name: manager, value: manager_id })); // manager array of manager names and ids
        const filtered = (arr) => { //array is filtered so null values are removed
            const required = arr.filter(el => {
                return el.name;
            })
            return required;
        }
        const newArr = filtered(managerArr)
        const duplicates = [...new Map(newArr.map(item => [JSON.stringify(item), item])).values()] // removes duplicate manager names from array
        duplicates.push("N/A") // N/A option is pushed onto array
        const roleArr = results.map(({ title, id }) => ({ name: title, value: id })); // creates roles array
        const duplicates2 = [...new Map(roleArr.map(item => [JSON.stringify(item), item])).values()] // removed duplicated
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: "What is the employee's first name?",
                    validate: input => {
                        if (input) {
                            return true;
                        } else {
                            console.log("Please enter a name.");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: "What is the employee's last name?",
                    validate: input => {
                        if (input) {
                            return true;
                        } else {
                            console.log("Please enter a name.");
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'employee_role',
                    message: "What is the employee's role?",
                    choices: duplicates2
                },
                {
                    type: 'list',
                    name: 'employee_manager',
                    message: "Who is the employee's manager?",
                    choices: duplicates
                }
            ])
            .then((response) => {
                db.query(`
            INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ("${response.first_name}", "${response.last_name}", ${response.employee_role}, ${response.employee_manager}); 
            `, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("--------------------------------------------------------------------------------");
                    console.log(`${response.first_name} ${response.last_name} was added to the database.`);
                    console.log("--------------------------------------------------------------------------------");
                    init();
                }
                )
            })
    })
}
// function to update employee role
function updateRole() {
    db.query(`SELECT employee.first_name, employee.last_name, _role.title, _role.id
     FROM employee INNER JOIN _role ON employee.role_id = _role.id`, function (err, results) {
        if (err) {
            console.log(err);
        }
        const employeeArr = results.map(({ first_name, last_name }) => ({ name: first_name + " " + last_name })); // employee array 
        const roleArr = results.map(({ title, id }) => ({ name: title, value: id })); // role array
        const duplicates = [...new Map(roleArr.map(item => [JSON.stringify(item), item])).values()] // role array filtered of duplicates
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'update_name',
                    message: "Which employee's role do you want to update?",
                    choices: employeeArr
                },
                {
                    type: 'list',
                    name: 'update_role',
                    message: "Which role do you want to assign the selected employee?",
                    choices: duplicates
                },
            ])
            .then((response) => {
                const split = response.update_name.split(" "); // splits names on space
                const lastName = split[1]; // returns employee's last name
                db.query(`
            UPDATE employee
            SET role_id = ${response.update_role}
            WHERE last_name = "${lastName}";
            `, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("--------------------------------------------------------------------------------");
                    console.log(`${response.update_name}'s role was updated.`);
                    console.log("--------------------------------------------------------------------------------");
                    init();
                }
                )
            })
    })
}
// function to view all roles
function viewAllRoles() {
    const joinRole = `
    SELECT _role.id, _role.title, department.department_name, _role.salary
    FROM _role
    INNER JOIN department ON _role.department_id = department.id
    `
    db.query(joinRole, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log("--------------------------------------------------------------------------------");
        console.table(results);
        console.log("--------------------------------------------------------------------------------");
        init();
    })
}
// function to add a role
function addRole() {
    db.query(`SELECT * FROM department`, function (err, results) {
        if (err) {
            console.log(err);
        }
        const departmentArr = results.map(({ department_name, id }) => ({ name: department_name, value: id })); // department array
        const duplicates = [...new Map(departmentArr.map(item => [JSON.stringify(item), item])).values()] // removes duplicates from department array
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role_name',
                    message: "What is the name of the role?",
                    validate: input => {
                        if (input) {
                            return true;
                        } else {
                            console.log("Please enter a role.");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'role_salary',
                    message: "What is the salary of the role?",
                    validate: input => {
                        if (input) {
                            return true;
                        } else {
                            console.log("Please enter a salary.");
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department_role',
                    message: "Which department does the role belong to?",
                    choices: duplicates
                }
            ])
            .then((response) => {
                db.query(`
            INSERT INTO _role (title, salary, department_id)
            VALUES ("${response.role_name}", ${response.role_salary}, ${response.department_role});
            `, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("--------------------------------------------------------------------------------");
                    console.log(`${response.role_name} was added to the database.`);
                    console.log("--------------------------------------------------------------------------------");
                    init();
                })
            })
    })
}
// function to view all departments
function viewAllDept() {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.log("--------------------------------------------------------------------------------");
        console.table(results);
        console.log("--------------------------------------------------------------------------------");
        init();
    })
}
// function to add a department 
function addDepartment() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department_name',
                message: "What is the name of the department?",
                validate: input => {
                    if (input) {
                        return true;
                    } else {
                        console.log("Please enter a name.");
                        return false;
                    }
                }
            }
        ])
        .then((response) => {
            db.query(`INSERT INTO department (department_name) VALUES ("${response.department_name}");`, function (err, results) {
                if (err) {
                    console.log(err);
                }
                console.log("--------------------------------------------------------------------------------");
                console.log(`Added ${response.department_name} to the database.`);
                console.log("--------------------------------------------------------------------------------");
                init();
            })
        })
}
// function to exit application
function quit() {
    process.exit();
}
init();