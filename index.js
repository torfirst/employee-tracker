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
    const [result] = await db.promise().query("SELECT * FROM role;")
    console.table(result)
    setTimeout(mainMenu, 3000)
}

const viewEmployee = async () => {
    const [result] = await db.promise().query("SELECT * FROM employee;")
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
    }
}

const addRole = async () => {

}

const addEmpl = async () => {

}

const updateEmplRole = async () => {

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