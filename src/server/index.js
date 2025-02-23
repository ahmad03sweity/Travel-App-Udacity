const express = require("express")
const app = express();
const cors = require("cors");

//read the json files coming to you
app.use(express.json())
app.use(express.static('dist'))

//require dotenv
require("dotenv").config()

//get the city function which get location from geoNames
const  {getCityLoc} = require("./getCityLoc")
const {weatherTemp} = require("./weatherTemp")
const {getCityPic} = require("./getCityPic")

//using cors
app.use(cors())

port = 8000

//I had to fix an issue with the env file that it doesn't want to get the integers in my username so i made
// a separate const for them
const userstring = process.env.USERNAME
const usernumber = process.env.USERNUMBER
const WEATHER_KEY = process.env.WEATHER_KEY
const pixabay_key = process.env.pixabay_key
const username = userstring.concat(usernumber)


app.get("/", (req, res) => {
  res.render("index.html")
})

app.post("/getCity", async (req,res) => {
    const city = req.body.city;
    const Location= await getCityLoc(city, username)
    return res.send(Location)
   
})

app.post("/getWeather", async (req,res) => {
   const {lng, lat, remainingDays} = req.body
   const getWeather = await weatherTemp(lng, lat, remainingDays, WEATHER_KEY)
   return res.send(getWeather)
})

app.post("/getCityPic", async (req,res) => {
  const {city_name} = req.body
  const getPic = await getCityPic(city_name, pixabay_key)
  return res.send(getPic)
})

app.listen(8000, () => console.log(`server is listening on port ${port}`))