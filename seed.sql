CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department (
  id INTEGER AUTO_INCREMENT,
  name VARCHAR(30),
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

//Join tables

CREATE TABLE join1
  SELECT role.id, title, salary, name
  FROM role
  INNER JOIN department ON role.department_id = department.id;

USE employeeTracker_db;

CREATE TABLE join2
  SELECT employee.id, first_name, last_name, title, name, manager_id
  FROM employee
  INNER JOIN join1 ON employee.role_id = join1.id;

USE employeeTracker_db;

CREATE TABLE allemployees
SELECT DISTINCT manager.*
FROM join2
    inner join join2 manager on join2.manager_id = manager.id







