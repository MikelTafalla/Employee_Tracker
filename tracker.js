const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");

// // create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Port
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "R.sociedad789",
  database: "employeeTracker_db"
});

//connect to the mysql server and sql database
connection.connect(err => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  runApp();
});


function runApp() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View All Employees By Department",
        "View Company Departments",
        "View Company Job Positions",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "View All Employess By Manager",
        "Update Employee Manager",
        "Exit"
      ]
    })
    .then(response => {
      switch (response.action) {
        case "View All Employees":
          viewEmployees();
          break;

        case "View All Employees By Department":
          employeesByDepartment();
          break;

        case "View Company Departments":
          viewDepartments();
          break;
        
        case "View Company Job Positions":
          viewRoles();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;
        
        case "View All Employess By Manager":
          employeesByManager;
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
///////////////
const tableMain = (`SELECT employee.id, first_name, last_name, title, department, salary, manager_id
FROM employee
INNER JOIN role
ON employee.role_id = role.id
INNER JOIN department
ON role.department_id = department.id`);
/////////
const viewEmployees = () => {
  connection.query(tableMain, (err, res) => {
    if (err) throw err;
    console.table(res);
    runApp();
  })
};
//////////////
const employeesByDepartment = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What department do you want to see?",
      choices: [
        "Engineering",
        "Sales",
        "Finance",
        "Legal"
      ]
    })
    .then(response => {
      connection.query(`${tableMain}
      WHERE department = "${response.action}"`, (err, res) => {
      console.table(res);
      runApp();
      })
    })    
};
/////////////////
const viewDepartments = () => {
  connection.query(`SELECT * FROM department`, (err, res) => {
    console.table(res);
    runApp();
  })
}//end function viewDepartments
////////////////
const viewRoles = () => {
  connection.query(`SELECT * FROM role`, (err, res) => {
    console.table(res);
    runApp();
  })
}
////////////////
const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Enter employee's first name:"
      },
      {
        name: "lastName",
        type: "input",
        message: "Enter employee's last name:"
      },
      {
        name: "department",
        type: "list",
        message: "Choose employee's department",
        choices: [
          "1 Legal",
          "2 Finance",
          "3 Sales",
          "4 Engineering"
        ]
      },
      {
        name: "role",
        type: "list",
        message: "Choose employee's job position",
        choices: [
          "1 Software Engineer",
          "2 Accountant",
          "3 Lawyer",
          "4 Lead Engineer",
          "5 Legal Team Lead",
          "6 Sales Lead",
          "7 Sales Person"
        ]
      }
    ])
    .then(response => {
      let roleCode = parseInt(response.role);
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: response.firstName,
          last_name: response.lastName,
          role_id: roleCode
        }, (err, res) => {
          if (err) throw err;
        }
      )
      connection.query(tableMain, (err, res) => {
        if (err) throw err;
        console.table(res);
        runApp();
      })   
    })
};
/////////////////
const removeEmployee = () => {
  //Create a variable that holds all of the current employees so dynamically the choices of inquirer are updated.
  let activeEmployees = [];
  connection.query(`SELECT id, first_name, last_name
  FROM employee`, (err, res) => {
    res.forEach(element => {
      activeEmployees.push(`${element.id} ${element.first_name} ${element.last_name}`);
    });
    inquirer
    .prompt({
      name: "remove",
      type: "list",
      message: "What employee would you like to remove?",
      choices: activeEmployees
    })
    .then(response => {
      //Do a global search for digits in the response
      let employeeID = parseInt(response.remove)

      connection.query(`DELETE FROM employee WHERE id = ${employeeID}`, (err, res) => {
      console.table(response);
      runApp();
      })
    }) 
  });
 
}/// end remove employee function

/////////////
const updateRole = () => {
  let employees = [];
  connection.query(`SELECT id, first_name, last_name
  FROM employee AND role`, (err, res) => {
    res.forEach(element => {
      employees.push(`${element.id} ${element.first_name} ${element.last_name}`);
    });
  inquirer
    .prompt([
      {
        name: "update",
        type: "list",
        message: "Choose the employee whose role is to be updated:",
        choices: employees
      },
      {
        name: "role",
        type: "list",
        message: "Choose employee's job position",
        choices: [
          "1 Software Engineer",
          "2 Accountant",
          "3 Lawyer",
          "4 Lead Engineer",
          "5 Legal Team Lead",
          "6 Sales Lead",
          "7 Sales Person"
        ]
      }
    ])
    .then(response => {
      let idCode = parseInt(response.update);
      let roleCode = parseInt(response.role);
      connection.query(
        `UPDATE employee SET role_id = ${roleCode} WHERE id = ${idCode}`, (err, res) => {
          if (err) throw err;
        }
      )
      connection.query(tableMain, (err, res) => {
        if (err) throw err;
        console.table(res);
        runApp();
      })   
    })
  });
} //end update function