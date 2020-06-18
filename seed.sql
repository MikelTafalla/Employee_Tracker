CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
  id INTEGER AUTO_INCREMENT,
  department VARCHAR(30),
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INTEGER AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER,
  manager_id INTEGER,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
//to give values to role_id, manager_id
UPDATE employee SET role_id = 1 WHERE id = 3;
// INSERT valuesUSE employeeTracker_db;
INSERT INTO role (title, salary, department_id) 
values
('software engineer', 150000, 4),
('accountant', 150000, 2),
('lawyer', 175000, 1),
('lead engineer', 200000, 4),
('legal team lead', 185000, 1),
('sales lead', 100000, 3),
('sales person', 75000, 3);

//Join tables
USE employeeTracker_db;

SELECT employee.*, title, department, salary
FROM employee
INNER JOIN role
ON employee.role_id = role.id
INNER JOIN department
ON role.department_id = department.id









