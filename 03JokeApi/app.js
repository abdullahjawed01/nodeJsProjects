import axios from "axios";

let response = await axios.get("https://v2.jokeapi.dev/joke/Any")
console.log(response.data.joke);