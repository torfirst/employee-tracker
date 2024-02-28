const inquirer = require('inquirer');
const db = require('./db/connection');


const init = () => {
    console.log('Welcome to the employee tracker!');
    mainMenu()
}

const mainMenu = () => {
    inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View Department',
                'View Role',
                'View Employee',
                'Add Department',
                'Add Role',
                'Add Employee',
                'Update Employee Role',
                'Quit',
            ]
        }
    ])
        .then(answers => {
            console.log(answers);
            switch (answers.choice) {
                case 'View Department':
                    viewDepartment()
                    break
                case 'View Role':
                    viewRole()
                    break
                case 'View Employee':
                    viewEmployee()
                    break
                case 'Add Department':
                    addDept()
                    break
                case 'Add Role':
                    addRole()
                    break
                case 'Add Employee':
                    addEmpl()
                    break
                case 'Update Employee Role':
                    updateEmplRole()
                    break
                case 'Quit':
                    quit();
                default:
                    throw new Error('Case does not match choices.')
            }
        })
}

const viewDepartment = async () => {
    //    db.query('SELECT * FROM department;', function(err, result) {
    //        console.table(result);
    //    })
    const [result] = await db.promise().query("SELECT * FROM department;")
    console.table(result)
    setTimeout(mainMenu, 3000)
}

const viewRole = async () => {
    const [result] = await db.promise().query("SELECT role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.id = department.id;")
    console.table(result)
    setTimeout(mainMenu, 3000)
}

const viewEmployee = async () => {
    const [result] = await db.promise().query("SELECT employee.first_name, employee.last_name, role.title AS role, employee.manager_id AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id;")
    console.table(result)
    setTimeout(mainMenu, 3000)
}

const addDept = async () => {
    try {
        const answers = await inquirer.prompt([
            {
                name: 'departmentName',
                type: 'input',
                message: 'What would you like to name the department?',
            }
        ]);
        const { departmentName } = answers;
        const [result] = await db.promise().query("INSERT INTO department (name) VALUES (?);", [departmentName]);
        console.log('Department added to database.');
        setTimeout(mainMenu, 3000)
    } catch(err) {
        console.log(err);
    }
};

const addRole = async () => {
    const [departments] = await db.promise().query("SELECT * FROM department;");

    const depChoices = departments.map(dep=>({ name: dep.name, value: dep.id}))

    try {
        const answers = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the name of your role?',
            }, {
                name: 'salary',
                type: 'input',
                message: 'What is your salary?',
            }, {
                name: 'department_id',
                type: 'list',
                message: 'What department does this role belong to?',
                choices: depChoices,
            }
        ]);
        const { departmentName } = answers;
        const [result] = await db.promise().query("INSERT INTO role SET ?;", [answers]);
        console.log('Role added to database.');
        setTimeout(mainMenu, 3000)
    } catch(err) {
        console.log(err);
    }
}

const addEmpl = async () => {
    const [roles] = await db.promise().query("SELECT * FROM role;");

    const roleChoices = roles.map(role=>({ name: role.title, value: role.id}));

    const [employees] = await db.promise().query("SELECT * FROM employee;");

    const empChoices = employees.map(employee=>({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id}));
    empChoices.shift({name:"No Manager", value: null});
    
    try {
        const answers = await inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'What is the first name?',
            }, {
                name: 'last_name',
                type: 'input',
                message: 'What is the last name?',
            }, {
                name: 'role_id',
                type: 'list',
                message: 'What role does this employee have?',
                choices: roleChoices,
            }, {
                name: 'manager_id',
                type: 'list',
                message: 'Who is the manager for this employee?',
                choices: empChoices.length ? empChoices : [{name:"No Employees to select from", value: null}],
            }
        ]);
        const [result] = await db.promise().query("INSERT INTO employee SET ?;", [answers]);
        console.log('Employee added to database.');
        setTimeout(mainMenu, 3000)
    } catch(err) {
        console.log(err);
    }
}

const updateEmplRole = async () => {
    const [roles] = await db.promise().query("SELECT * FROM role;");

    const roleChoices = roles.map(role=>({ name: role.title, value: role.id}));
    
    const [employees] = await db.promise().query("SELECT * FROM employee;");

    const empChoices = employees.map(employee=>({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id}));

    try {
        const {employee_id, role_id} = await inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Which employee are you updating?',
                choices: empChoices,
            }, {
                name: 'role_id',
                type: 'list',
                message: 'What is their new role?',
                choices: roleChoices.length ? roleChoices : [{name:"No Roles to select from", value: null}],
            }
        ]);
        const [result] = await db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?;", [role_id, employee_id]);
        console.log('Employee role updated.');
        setTimeout(mainMenu, 3000)
    } catch(err) {
        console.log(err);
    }
}

const quit = () => {
    process.exit;
}

init();

// const obj = {
// name:"bob",
// age: 75
// }

// const { age, name } = obj

// const arr = [1,2,3]
// const [_,cat, dog] = arr