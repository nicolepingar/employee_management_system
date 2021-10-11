// required packages for the application
const inquirer = require('inquirer');
const fs = require('fs');
const cTable = require('console.table');
const db = require('./config/config')

const questionMain = [
    {
        type: 'list',
        name: 'new',
        message: "What would you like to do?",
        choices: ["View all employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"]
    }
]

const addDepartmentQ = [
    {
        type: 'input',
        name: 'department name',
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
]
const addRoleQ = [
    {
        type: 'input',
        name: 'role name',
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
        name: 'role salary',
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
        name: 'department role',
        message: "Which department does the role belong to?",
        choices: ["Engineering", "Finance", "Legal", "Sales", "Service"]
    }
]

const addEmployeeQ = [
    {
        type: 'input',
        name: 'first name',
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
        name: 'last name',
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
        name: 'employee role',
        message: "What is the employee's role?",
        choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer", "Customer Service"]
    },
    {
        type: 'list',
        name: 'employee manager',
        message: "Who is the employee's manager?",
        choices: []
    }
]

function init() {
    console.log("Welcome to employee manager");
    inquirer
        .prompt(questionMain)
        .then((response) => {
            if (response.new === "View all employees") {
                viewAllEmp();
            } else if (response.new === "Add Employee") {
                addEmployee();
            } else if (response.new === "Update Employee Role") {

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
function viewAllEmp() {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    })
    init();
}
function addEmployee() {
    inquirer
        .prompt(addEmployeeQ)
        .then((response) => {

        })
}
function viewAllRoles() {
    db.query('SELECT * FROM _role', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    })
    init();

}
function addRole() {
    inquirer
        .prompt(addRoleQ)
        .then((response) => {

        })
}
function viewAllDept() {
    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
    })
    init();
}
function addDepartment() {
    inquirer
        .prompt(addDepartmentQ)
        .then((response) => {

        })
}
function quit() {
    process.exit();
}
init();