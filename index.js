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
]
const addRoleQ = [
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
        name: 'department role',
        message: "Which department does the role belong to?",
        choices: ["Engineering", "Finance", "Legal", "Sales", "Service"]
    }
]
const addEmployeeQ = [
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
        choices: ["Sales Lead", "Salesperson", "Lead Engineer", "Software Engineer", "Account Manager", "Accountant", "Legal Team Lead", "Lawyer", "Customer Service"]
    },
    {
        type: 'list',
        name: 'employee_manager',
        message: "Who is the employee's manager?",
        choices: []
    }
]
console.log("Welcome to employee manager");
function init() {
    inquirer
        .prompt(questionMain)
        .then((response) => {
            if (response.new === "View all employees") {
                viewAllEmp();
            }
            else if (response.new === "Add Employee") {
                addEmployee();
            } //else if (response.new === "Update Employee Role") {

            // } 
            else if (response.new === "View All Roles") {
                viewAllRoles();
            }
            //else if (response.new === "Add Role") {
            //     addRole();
            //} 
            else if (response.new === "View All Departments") {
                viewAllDept();
            } else if (response.new === "Add Department") {
                addDepartment();
            }
            else {
                quit();
            }
        })
}
function viewAllEmp() {
    const joinEmp = `
    SELECT employee.first_name, employee.last_name, _role.title, department.department_name, _role.salary 
    FROM employee 
    INNER JOIN _role ON employee.role_id = _role.id 
    INNER JOIN department ON _role.department_id = department.id`
    db.query(joinEmp, function (err, results) {
        if (err) {
            console.log(err);
        }
        console.table(results);
        init();
    })
}
function addEmployee() {
    inquirer
        .prompt(addEmployeeQ)
        .then((response) => {
            db.query(`
            INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES (${response.first_name}, ${response.last_name}, ${response.employee_role}, ${response.employee_manager}, ); 
            `, function (err, results) {
                if (err) {
                    console.log(err);
                }
                // console.table(results);
                init();


            }
            )
        })
}
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
        console.table(results);
        init();
    })


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
        init();
    })

}
function addDepartment() {
    inquirer
        .prompt(addDepartmentQ)
        .then((response) => {
            db.query(`INSERT INTO department (department_name) VALUES ("${response.department_name}");`, function (err, results) {
                if (err) {
                    console.log(err);
                }
                console.log(`Added ${response.department_name} to the database.`);
                init();
            })
        })
}
function quit() {
    process.exit();
}
init();