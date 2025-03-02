import axios from "axios";

const formElement = document.querySelector("form");
const cityInput = document.querySelector("#destination");
const dateInput = document.querySelector("#travelDate");

const cityError = document.querySelector("#destination_error");
const dateError = document.querySelector("#date_error_msg");

const handleSubmit = async (e) => {
  e.preventDefault();

  // Checking if the function is working fine
  console.log("I am working fine");

  // Validate formElement on the front-end side which is utterly important before calling the APIs for better performance
  if (!validate_inputs()) {
    return;
  }

  try {
    // Get the locationData first and make sure call is successful
    const locationData = await getCityLoc();
    if (locationData && locationData.error) {
      // Handling the error coming from the server-side
      cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${locationData.message}`;
      cityError.style.display = "block";
      return;
    } else if (locationData && !locationData.error) {
      // Extract longitude and latitude
      const { lng, lat, name } = locationData;

      // Get the date of the flight
      const date = dateInput.value;

      // User didn't input the date
      if (!date) {
        console.log("Please enter the date");
        dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
        dateError.style.display = "block";
        return;
      }

      if (lng && lat) {
        // Get remaining days before the flight
        const remainingDays = getRdays(date);

        // Get the weather data
        const weather = await getWeather(lng, lat, remainingDays);
        if (weather && weather.error) {
          dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${weather.message}`;
          dateError.style.display = "block";
          return;
        }

        // Get the picture of the place
        const pic = await getCityPic(name);
        updateUI(remainingDays, name, pic, weather);
      }
    }
  } catch (error) {
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Network Error: ${error.message}`;
    dateError.style.display = "block";
  }
};

const validate_inputs = () => {
  cityError.style.display = "none";
  dateError.style.display = "none";
  if (!cityInput.value) {
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>You need to enter the city`;
    cityError.style.display = "block";
    return false;
  }
  if (!dateInput.value) {
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
    dateError.style.display = "block";
    return false;
  }
  if (getRdays(dateInput.value) < 0) {
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Date cannot be in the past`;
    dateError.style.display = "block";
    return false;
  }
  return true;
};

const getCityLoc = async () => {
  if (cityInput.value) {
    try {
      const formData = new FormData(formElement);
      const jsonData = Object.fromEntries(formData.entries());
      const { data } = await axios.post("http://localhost:8000/getCity", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return data;
    } catch (error) {
      dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Network Error: ${error.message}`;
      dateError.style.display = "block";
    }
  }
};

const getWeather = async (lng, lat, remainingDays) => {
  try {
    const { data } = await axios.post("http://localhost:8000/getWeather", {
      lng,
      lat,
      remainingDays,
    });
    return data;
  } catch (error) {
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Network Error: ${error.message}`;
    dateError.style.display = "block";
  }
};

const getRdays = (date) => {
  const startDate = new Date();
  const endDate = new Date(date);
  const timeDiff = endDate - startDate;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

const getCityPic = async (city_name) => {
  try {
    const { data } = await axios.post("http://localhost:8000/getCityPic", {
      city_name,
    });
    return data.image;
  } catch (error) {
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Network Error: ${error.message}`;
    dateError.style.display = "block";
  }
};

const updateUI = (Rdays, city, pic, weather) => {
  document.querySelector("#remaining_days").innerHTML = `Your trip starts in ${Rdays} days from now`;
  document.querySelector(".locationName").innerHTML = `Location: ${city}`;
  document.querySelector(".weather_condition").innerHTML =
    Rdays > 7 ? `Weather is: ${weather.description}` : `Weather is expected to be: ${weather.description}`;
  document.querySelector(".temperature").innerHTML =
    Rdays > 7 ? `Forecast: ${weather.temp}&degC` : `Temperature: ${weather.temp} &deg C`;
  document.querySelector(".max-temperature").innerHTML =
    Rdays > 7 ? `Max-Temp: ${weather.app_max_temp}&degC` : "";
  document.querySelector(".min-temperature").innerHTML =
    Rdays > 7 ? `Min-Temp: ${weather.app_min_temp}&degC` : "";
  document.querySelector(".locationPic").innerHTML = `
    <img src="${pic}" alt="An image that describes the city nature">
  `;
  document.querySelector(".travel_data").style.display = "block";
};

export { handleSubmit };