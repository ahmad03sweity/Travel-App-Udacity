import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getCityLoc } from "./getCityLoc.js";
import { weatherTemp } from "./weatherTemp.js";
import { getCityPic } from "./getCityPic.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());

const port = 8080;

// Extract environment variables
const { USERNAME, USERNUMBER, WEATHER_KEY, pixabay_key } = process.env;
const username = `${USERNAME}${USERNUMBER}`;

// Root route
app.get("/", (req, res) => {
  console.log(req.headers);
  res.render("index.html");
});

// API routes
app.post("/getCity", (req, res) => {
  const city = req.body.city;
  getCityLoc(city, username)
    .then((location) => res.send(location))
    .catch((error) => res.status(500).send({ error: error.message }));
});

app.post("/getWeather", (req, res) => {
  const { lng, lat, remainingDays } = req.body;
  weatherTemp(lng, lat, remainingDays, WEATHER_KEY)
    .then((weather) => res.send(weather))
    .catch((error) => res.status(500).send({ error: error.message }));
});

app.post("/getCityPic", (req, res) => {
  const { city_name } = req.body;
  getCityPic(city_name, pixabay_key)
    .then((pic) => res.send(pic))
    .catch((error) => res.status(500).send({ error: error.message }));
});

// Start server
app.listen(8000, () => console.log(`Server is listening on port ${port}`));
