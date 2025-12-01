import axios from "axios"
import rd from "readline-sync"
import chalk from "chalk"
import figlet from "figlet"

async function githubCall() {
    let username = rd.question("Enter your username: ")

    let URL = `https://api.github.com/users/${username}`

    let output = await axios.get(URL)
      console.log(chalk.cyan(
        figlet.textSync("Github CLI",{
            horizontalLayout: "full"
        })
    ));
    console.log(chalk.red("The username is:",output.data.login));
    console.log(chalk.yellow("Name:",output.data.name));
    console.log(chalk.blue("Company: ",output.data.company));
    console.log(chalk.cyan("Location",output.data.location));
    console.log(chalk.yellow("Bio: ",output.data.bio));
    console.log(chalk.blue("Public Repos: ",output.data.public_repos));
    console.log(chalk.cyan("Public Gists: ",output.data.public_gists));


}

githubCall()