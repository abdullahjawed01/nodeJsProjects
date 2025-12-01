import axios from "axios"
import dotenv from "dotenv"
import chalk from "chalk"
import rd from "readline-sync"
import figlet from "figlet"
dotenv.config()

let API = process.env.APIKEY

async function api() {
    let cityname = rd.question("Enter city name: ")
    let call =await  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API}`)
    let celsius = Math.floor(-273.15)
    let temperature = chalk.blue(`Temparature is:`,call.data.main.temp-celsius)
    let pressure = chalk.red(`Pressure is:`,call.data.main.pressure)
    let humidity = chalk.yellow(`Humidity is:`,call.data.main.humidity)
    let sea_level = chalk.red(`Temparature is:`,call.data.main.sea_level)

    // let sea_level = chalk.red(`Temparature is:`,call.data.main.sea_level)
    // let newtemp = Math.floor(temperature-273.15)
    console.log(chalk.cyan(
        figlet.textSync("Weather CLI",{
            horizontalLayout: "full"
        })
    ));
    console.log(call.data.name);
    console.log(temperature);
    console.log(pressure);
    console.log(humidity);
    console.log(sea_level);




    // console.log(call.data);

}
api()