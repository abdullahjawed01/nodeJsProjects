import rd from "readline-sync"
import dotenv from "dotenv"
import figlet from "figlet"
import chalk from "chalk"
dotenv.config()
import { v4 as uuid } from "uuid"

import bcrypt from "bcrypt"
import { readDB, writeDB } from "./helper.js"




async function register() {
    let DB = await readDB()
    let name = rd.question(chalk.red("Enter your name: "))
    let email = rd.questionEMail(chalk.blue("Enter your email: "))
    let phone = rd.question(chalk.grey("Enter your Phone: "))
    let password = rd.question(chalk.yellow("Enter your password: "), { hideEchoBack: true })
    let haspass = await bcrypt.hash(password, 10)
    let newuser = {
        name,
        email,
        phone,
        password: haspass,
        task: [],
        createdAT: new Date().toISOString()

    }
    DB.push(newuser)
    await writeDB(DB)
    chalk.cyan(console.log("You have registered Successfully"))
}
// register()

async function login() {
    let DB = await readDB()
    let email = rd.questionEMail(chalk.red("Enter your email: "))
    let password = rd.question(chalk.blue("Enter your password: "))

    let user = DB.find(x => x.email == email)
    if (!user) {
        chalk.yellow(console.log("User not found Please Login."))
    }

    let pass = await bcrypt.compare(password, user.password)
    if (pass) {
        console.log("You successfully logged in")
    }

}
// login()

async function addtask() {
    let DB = await readDB()
    let email = rd.questionEMail(chalk.cyan("Enter your email: "))
    let task = rd.question(chalk.green("Enter you task: "))
    let description = rd.question(chalk.red("Enter your task description: "))
    let user = DB.find(x => x.email == email)
    let newtask = {
        uid: uuid(),
        task,
        description,
        createdAT: new Date().toISOString()

    }
    user.task.push(newtask)
    await writeDB(DB)
    console.log("Task added succesfully")
}

// addtask()

async function alltask() {
    let DB = await readDB()
    let email = rd.questionEMail(chalk.red("Enter your email: "))
    let user = DB.find(x => x.email == email).task
    console.log(user)

}

async function deletetaskuid() {
    let users = await readDB();
    let taskId = rd.question(chalk.yellow("Enter your task UID: "))


    let userIndex = users.findIndex(u => u.task?.some(t => t.uid === taskId));

    if (userIndex === -1) {
        return res.status(404).json({ msg: "Task not found" });
    }


    users[userIndex].task = users[userIndex].task.filter(t => t.uid !== taskId);


    await writeDB(users);
    console.log("Task deleted successfully")

}
// deletetask()


async function updatetask() {
    let DB = await readDB()
    let email = rd.question(chalk.blue("Enter your Email: "))
    let taskId = rd.question(chalk.red("Enter your task UID: "))
    let user = DB.find(x => x.email == email)
    let uptask = user.task.find(x => x.uid == taskId)
    let taskupdate = rd.question(chalk.grey(" What do you want to update name/desc/both: "))
    if (taskupdate == "name") {
        let newname = rd.question(chalk.cyan(" enter your new task name "))
        uptask.task = newname
        await writeDB(DB)
        console.log("Task name updated")
    }
    if (taskupdate == "description") {
        let newdesc = rd.question(chalk.red(" Enter your new desc: "))
        uptask.description = newdesc
        await writeDB(DB)
        console.log("Task description updated")
    }
    if (taskupdate == "both") {
        let newname = rd.question(chalk.red(" Enter your new task name "))
        let newdesc = rd.question(chalk.green(" Enter your new desc"))
        uptask.task = newname
        userIndex.description = newdesc
        await writeDB(DB)
        console.log("Task name & description updated")
    }

}
// updatetask()

async function deletealltask() {
    let DB = await readDB()
    let email = rd.question(chalk.grey("Enter your Email: "))
    let user = DB.find(x => x.email == email)
    // let task = user.task


    user.task = []
    await writeDB(DB)

    console.log("All task deleted successfully")
}
// deletealltask()

// updateuser
async function updateuser() {
    try {
        let DB = await readDB()
        let email = rd.question(chalk.yellow("Enter your email"))
        let user = DB.find(x => x.email == email)
        let update = rd.question(chalk.cyan("What do you want to update \n Name/Email/password/phone/All"))
        if (update == "Name" || update == "name") {
            let name = rd.question(chalk.red("Enter new name: "))
            user.name = name
            console.log("Name Updated successfully")
            await writeDB(DB)
        }
        if (update == "Email" || update == "email") {
            let email = rd.question(chalk.yellow("Enter new email: "))
            user.email = email
            console.log(chalk.red("Email Updated successfully"))
            await writeDB(DB)

        } if (update == "password" || update == "password") {
            let password = rd.question(chalk.yellow("Enter new password: "))
            let pass = await bcrypt.hash(password, 10);
            user.password = pass
            console.log(chalk.red("password Updated successfully"))
            await writeDB(DB)
        }

        if (update == "phone" || update == "phone") {
            let phone = rd.question(chalk.blue("Enter new phone: "))
            user.phone = phone
            console.log(chalk.red("phone Updated successfully"))
            await writeDB(DB)
        }
        if (update == "All" || update == "all") {
            let name = rd.question(chalk.red("Enter new name: "))
            user.name = name
            let email = rd.question(chalk.grey("Enter new email: "))
            user.email = email
            let passwords = rd.question(chalk.blue("Enter new password: "))
            let pass = await bcrypt.hash(passwords, 10);
            user.password = pass
            let phone = rd.question(chalk.yellow("Enter new phone: "))
            user.phone = phone
            console.log("Everything update successfully");
            await writeDB(DB)

        }

    } catch (error) {
        console.log(error);
    }
}
// updateuser()

async function deleteuser() {
    try {
        let DB = await readDB()
        let email = rd.questionEMail(chalk.red("Enter your email: "))
        // let user = DB.find(x=>x.email == email)
        let filter = DB.filter(x => x.email !== email)
        await writeDB(filter)
        console.log(chalk.yellow("User deleted successfully"))
    } catch (error) {
        console.log(error);
    }
}
// deleteuser()




while (true) {

    console.log(chalk.cyan(figlet.textSync("TO Do Task CLI", { horizontalLayout: "full" })));
    let req = rd.question(' \n 0:Register \n 1:login \n 2:Add task \n 3:delete task by uid \n 4:update task \n 5:delete all task \n 6:update user\n 7:delete user \n 8:All task \n 9:Exit \n Please Enter your request:-  ')
    switch (req) {
        case "0":
            await register()

            break;
        case "1":
            await login()

            break;
        case "2":
            await addtask()

            break;
        case "3":
            await deletetaskuid()

            break;
        case "4":
            await updatetask()

            break;
        case "5":
            await deletealltask()

            break;
        case "6":
            await updateuser()

            break;
        case "7":
            await deleteuser()

            break;
        case "8":
            await alltask()

            break;

        case "9":
            process.exit(0);

        default:
            console.log("Invalid input");
            break;
    }
}