const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const viewEmployees = require("public/allemployees.js")
const employeesByDepartment;
const employeesByManager;
const addEmployee;
const removeEmployee;
const updateRole;
const updateManager;
// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Port
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeTracker_db"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  runApp();
});
// 
function runApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View All Employess By Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Exit"
      ]
    })
    .then(function(response) {
      switch (response.action) {
      case "View All Employees":
        viewEmployees;
        break;

      case "View All Employees By Department":
        employeesByDepartment;
        break;

      case "View All Employess By Manager":
        employeesByManager;
        break;

      case "Add Employee":
        addEmployee;
        break;

      case "Remove Employee":
        removeEmployee;
        break;
        
      case "Update Employee Role":
        updateRole;
        break;
        
      case "Update Employee Manager":
        updateManager;
        break;
      
      case "Exit":
        connection.end();
        break;
      }
    });
}