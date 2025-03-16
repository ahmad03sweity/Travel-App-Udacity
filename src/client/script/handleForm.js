import axios from "axios";

const formElement = document.querySelector("form");
const cityInput = document.querySelector("#destination");
const dateInput = document.querySelector("#travelDate");

const cityError = document.querySelector("#destination_error");
const dateError = document.querySelector("#date_error_msg");

const handleSubmit = (e) => {
  e.preventDefault();

  // Checking if the function is working fine
  console.log("I am working fine");

  // Validate formElement on the front-end side which is utterly important before calling the APIs for better performance
  if (!validate_inputs()) {
    return;
  }

  // Get the locationData first and make sure call is successful
  getCityLoc()
    .then((locationData) => {
      if (locationData && locationData.error) {
        cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${locationData.message}`;
        cityError.style.display = "block";
        return Promise.reject(); // الخروج من السلسلة مبكرًا عند وجود خطأ
      }

      // Extract longitude and latitude
      const { lng, lat, name } = locationData;

      // Get the date of the flight
      const date = dateInput.value;

      // User didn't input the date
      if (!date) {
        console.log("Please enter the date");
        dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
        dateError.style.display = "block";
        return Promise.reject(); // الخروج من السلسلة
      }

      if (lng && lat) {
        // Get remaining days before the flight
        const remainingDays = getRdays(date);

        // Get the weather data
        return getWeather(lng, lat, remainingDays).then((weather) => {
          if (weather && weather.error) {
            dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${weather.message}`;
            dateError.style.display = "block";
            return Promise.reject();
          }

          // Get the picture of the place
          return getCityPic(name).then((pic) => {
            updateUI(remainingDays, name, pic, weather);
          });
        });
      }
    })
    .catch((error) => {
      if (error) {
        dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Network Error: ${error.message}`;
        dateError.style.display = "block";
      }
    });
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

const getCityLoc = () => {
  if (cityInput.value) {
    const formData = new FormData(formElement);
    const jsonData = Object.fromEntries(formData.entries());

    return axios
      .post("http://localhost:8000/getCity", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Network Error: ${error.message}`;
        dateError.style.display = "block";
      });
  }
};

const getWeather = (lng, lat, remainingDays) => {
  return axios
    .post("http://localhost:8000/getWeather", { lng, lat, remainingDays })
    .then((response) => response.data)
    .catch((error) => {
      dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Network Error: ${error.message}`;
      dateError.style.display = "block";
    });
};

const getRdays = (date) => {
  const startDate = new Date();
  const endDate = new Date(date);
  const timeDiff = endDate - startDate;
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysDiff;
};

const getCityPic = (city_name) => {
  return axios
    .post("http://localhost:8000/getCityPic", { city_name })
    .then((response) => response.data.image)
    .catch((error) => {
      dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Network Error: ${error.message}`;
      dateError.style.display = "block";
    });
};

const updateUI = (Rdays, city, pic, weather) => {
  const elements = {
    remainingDays: document.querySelector("#remaining_days"),
    locationName: document.querySelector(".locationName"),
    weatherCondition: document.querySelector(".weather_condition"),
    temperature: document.querySelector(".temperature"),
    maxTemperature: document.querySelector(".max-temperature"),
    minTemperature: document.querySelector(".min-temperature"),
    locationPic: document.querySelector(".locationPic"),
    travelData: document.querySelector(".travel_data"),
  };

  elements.remainingDays.innerHTML = `Your trip starts in ${Rdays} days from now`;
  elements.locationName.innerHTML = `Location: ${city}`;

  const weatherText = Rdays > 7 ? "Weather is" : "Weather is expected to be";
  elements.weatherCondition.innerHTML = `${weatherText}: ${weather.description}`;

  const temperatureText = Rdays > 7 ? "Forecast" : "Temperature";
  elements.temperature.innerHTML = `${temperatureText}: ${weather.temp}&degC`;

  elements.maxTemperature.innerHTML = Rdays > 7 ? `Max-Temp: ${weather.app_max_temp}&degC` : "";
  elements.minTemperature.innerHTML = Rdays > 7 ? `Min-Temp: ${weather.app_min_temp}&degC` : "";

  elements.locationPic.innerHTML = `<img src="${pic}" alt="An image that describes the city nature">`;

  elements.travelData.style.display = "block";
};

export { handleSubmit };