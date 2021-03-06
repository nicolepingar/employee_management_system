INSERT INTO
    department (department_name)
VALUES
    ("Engineering"),
    ("Finance"),
    ("Legal"),
    ("Sales"),
    ("Service");

INSERT INTO
    _role (title, salary, department_id)
VALUES
    ("Lead Engineer", 80000, 1),
    ("Accountant", 70000, 2),
    ("Lawyer", 80000, 3),
    ("Sales Lead", 80000, 4),
    ("Customer Service", 80000, 5);

INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Nene", "Leakes", 1, null),
    ("Kyle", "Richards", 2, 5),
    ("Sonja", "Morgan", 3, null),
    ("Karen", "Huger", 4, null),
    ("Teresa", "Guidice", 5, null);
