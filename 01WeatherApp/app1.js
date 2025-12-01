import axios from "axios";
import readlineSync from "readline-sync";


const apiKey = "4ba9b130a39c4ab6b70161239252911";

const city = readlineSync.question("Enter city name: ");

axios.get(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
  .then(res => {console.log(`Temperature in ${city}: ${res.data.current.temp_c}°C`); })
  .catch(err => {  console.log("Error:", err.response?.data?.error?.message || err.message);});
