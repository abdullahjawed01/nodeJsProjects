import express from "express";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios"

const app = express();
const PORT = process.env.PORT ;

app.get("/", (req, res) => {
  try {
    res.status(200).json({ msg: "hello this is cfi block code" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});
let API = process.env.APIKEY

app.get("/weather/:city",async(req,res)=>{
    try {
        let cityname = req.params.city
        let call = await  axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${API}`)
        console.log(call);
        let celsius = Math.floor(-273.15)
        let temperature = (`Temparature is:`,call.data.main.temp-celsius)
        let pressure = (`Pressure is:`,call.data.main.pressure)
        let humidity = (`Humidity is:`,call.data.main.humidity)
        let sea_level = (`Temparature is:`,call.data.main.sea_level)

        res.status(200).json({temperature:temperature,pressure:pressure,humidity:humidity,sea_level:sea_level})



    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});