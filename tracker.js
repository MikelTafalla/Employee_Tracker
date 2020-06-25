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

//Start app
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
        "Add New Job Position to the Company",
        "Add New Department to the Company",
        "Remove Employee",
        "Update Employee Role",
        "View All Employess By Manager",
        "Update Employee Manager",
        "View budget spent on department",
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

        case "Add New Job Position to the Company":
          addRole();
          break;

        case "Add New Department to the Company":
          addDepartment();
          break;

        case "Remove Employee":
          removeEmployee();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "View All Employess By Manager":
          employeesByManager();
          break;

        case "Update Employee Manager":
          updateManager();
          break;

        case "View budget spent on department":
          viewBudget();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}
///////////////
//Joined table that will display all info
const bonusTable = `SELECT e.id, e.first_name, e.last_name, role.title, role.salary ,d.department, CONCAT(m.first_name,' ',m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id JOIN role JOIN department d on role.department_id = d.id and e.role_id = role.id`
/////////////
const viewEmployees = () => {
  connection.query(bonusTable, (err, res) => {
    if (err) throw err;
    console.table(res);
    runApp();
  })
};
//////////////
const employeesByDepartment = () => {
  //Create choices for inquirer question dynamically
  let dpt = [];
  connection.query(`SELECT * FROM department`, (err, res) => {
    res.forEach(element => {
      dpt.push(element.department);
    });
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What department do you want to see?",
        choices: dpt
      })
      .then(response => {
        connection.query(`${bonusTable}
      WHERE department = "${response.action}"`, (err, res) => {
          console.table(res);
          runApp();
        })
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
  let dpt = [];
  connection.query(`SELECT * FROM department`, (err, res) => {
    res.forEach(element => {
      dpt.push(`${element.id} ${element.department}`);
    });
    let job = [];
    connection.query(`SELECT id, title FROM role`, (err, res) => {
      res.forEach(element => {
        job.push(`${element.id} ${element.title}`);
      });
      let manager = [];
      connection.query(`SELECT id, first_name, last_name FROM employee`, (err, res) => {
        res.forEach(element => {
          manager.push(`${element.id} ${element.first_name} ${element.last_name}`);
        });
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
              choices: dpt
            },
            {
              name: "role",
              type: "list",
              message: "Choose employee's job position",
              choices: job
            },
            {
              name: "manager",
              type: "list",
              message: "Choose the manager of this employee:",
              choices: manager
            }
          ])
          .then(response => {
            //Get id numbers from answers to use them as reference
            let roleCode = parseInt(response.role);
            let managerCode = parseInt(response.manager);
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: roleCode,
                manager_id: managerCode
              }, (err, res) => {
                if (err) throw err;
              }
            )
            connection.query(bonusTable, (err, res) => {
              if (err) throw err;
              console.table(res);
              runApp();
            })
          })
      })
    })
  })
};
/////////////////
const addRole = () => {
  //validation before asking the questions. We want to have the department created before we create a new role.
  inquirer.prompt(
    {
      name: "validation",
      type: "input",
      message: "Please make sure the department for this Role already exists. Have you already added its department? Y/N:"
    }
  ).then(response => {
    const userResp = response.validation.toLowerCase();
    if (userResp === "n" || userResp === "no") {
      runApp();
    } else if (userResp === "y" || userResp === "yes") {
      enterRole();
    };
  })
};
const enterRole = () => {
  let dpt = [];
  connection.query(`SELECT * FROM department`, (err, res) => {
    res.forEach(element => {
      dpt.push(`${element.id} ${element.department}`);
    });
    inquirer
      .prompt([
        {
          name: "role",
          type: "input",
          message: "Enter the title of the new position:"
        },
        {
          name: "depart",
          type: "list",
          message: "Choose the department for this position:",
          choices: dpt
        },
        {
          name: "salary",
          type: "input",
          message: "Enter the salary of the new position:"
        }
      ])
      .then(response => {
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: response.role,
            salary: response.salary,
            department_id: parseInt(response.depart)
          }, (err, res) => {
            if (err) throw err;
            console.log(`Added ${response.role} role`)
          }
        )
        connection.query(`SELECT * FROM role`, (err, res) => {
          if (err) throw err;
          console.table(res);
          runApp();
        })
      })
  })
};
/////////////////
const addDepartment = () => {
  inquirer
    .prompt(
      {
        name: "department",
        type: "input",
        message: "Enter the name of the new department:"
      }
    )
    .then(response => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          department: response.department
        }, (err, res) => {
          if (err) throw err;
          console.log(`Added ${response.department} department`)
        })
      connection.query(`SELECT * FROM department`, (err, res) => {
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
  FROM employee`, (err, res) => {
    res.forEach(element => {
      employees.push(`${element.id} ${element.first_name} ${element.last_name}`);
    });
    let job = [];
    connection.query(`SELECT id, title FROM role`, (err, res) => {
      res.forEach(element => {
        job.push(`${element.id} ${element.title}`);
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
            choices: job
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
          connection.query(bonusTable, (err, res) => {
            if (err) throw err;
            console.table(res);
            runApp();
          })
        })
    })
  })
} //end update function
////////////////
const employeesByManager = () => {
  let manager = [];
  connection.query(`SELECT * FROM (${bonusTable}) AS managerSubTable WHERE manager IS NOT NULL`, (err, res) => {
    res.forEach(element => {
      manager.push(element.manager);
    })
    //delete duplicate managers from arrays
    let nonDuplicate = [...new Set(manager)]
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What manager's employees do you want to see?",
        choices: nonDuplicate
      })
      .then(response => {
        connection.query(`SELECT * FROM (${bonusTable}) AS managerSubTable WHERE manager = "${response.action}"`, (err, res) => {
          console.table(res);
          runApp();
        })
      })
  })
}
////////////
const updateManager = () => {
  let employees = [];
  connection.query(`SELECT id, first_name, last_name
  FROM employee`, (err, res) => {
    res.forEach(element => {
      employees.push(`${element.id} ${element.first_name} ${element.last_name}`);
    });

    inquirer
      .prompt([
        {
          name: "update",
          type: "list",
          message: "Choose the employee whose manager is to be updated:",
          choices: employees
        },
        {
          name: "manager",
          type: "list",
          message: "Choose employee's new manager",
          choices: employees
        }
      ])
      .then(response => {
        let idCode = parseInt(response.update);
        let managerCode = parseInt(response.manager);
        connection.query(
          `UPDATE employee SET manager_id = ${managerCode} WHERE id = ${idCode}`, (err, res) => {
            if (err) throw err;
          }
        )
        connection.query(bonusTable, (err, res) => {
          if (err) throw err;
          console.table(res);
          runApp();
        })
      })
  })
}
//////////
const viewBudget = () => {
  let dpt = [];
  connection.query(`SELECT * FROM department`, (err, res) => {
    res.forEach(element => {
      dpt.push(element.department);
    })
    inquirer
      .prompt(
        {
          name: "budget",
          type: "list",
          message: "Choose which department budget you want to see:",
          choices: dpt
        }
      )
      .then(response => {
        connection.query(`SELECT salary FROM (${bonusTable}) AS managerSubTable WHERE department = "${response.budget}"`, (err, resp) => {
          let sum = 0;
          resp.forEach(element => {
            sum += element.salary;
          })
          connection.query(`SELECT department FROM department WHERE department = "${response.budget}"`, (err, res) => {
            if (err) throw err;
            console.table(res);
            console.log(`budget of $${sum}`)
            runApp();
          })
        })
      })
  })
}/// end function viewbudget
