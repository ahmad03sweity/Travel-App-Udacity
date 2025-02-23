import axios from "axios";
const formElement = document.querySelector("form");
const cityInput = document.querySelector("#city");
const dateInput = document.querySelector("#flightDate");

const cityError = document.querySelector("#city_error");
const dateError = document.querySelector("#date_error");

const handleSubmit = async (e) => {
  e.preventDefault();

  //checking if the function is working fine
  console.log("I am working fine");

  // validate formElement on the front-end side which is utterly important before calling the apis for better performance
  if(!validate_inputs()){
    return;
  };

  //get the locationData first and make sure call is successful
  const locationData = await getCityLoc();
  //failing call to locationData
  if (locationData && locationData.error) {
    //handling the error coming from the server-side
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${locationData.message}`;
    cityError.style.display = "block";
    return
  } else if (locationData && !locationData.error) {
    //extract longitude and latitude
    const { lng, lat, name } = await locationData;

    //get the date of the flight
    const date = dateInput.value;

    //user didn't input the date
    if (!date) {
      console.log("please enter the date");
      dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
      dateError.style.display = "block";
      return;
    }


    if (lng && lat) {
      // get remaining days before the flight
      //i need to calcualte remaining days
      const remainingDays = getRdays(date);

      //get the weather data and consider sending the remaining days to know when
      //exactly should i get my data back.

      const weather = await getWeather(lng, lat, remainingDays);
      if(weather && weather.error) {
        dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>${weather.message}`;
        dateError.style.display = "block";
        return;
      }
      //get the picture of the place
      const pic = await getCityPic(name);
      updateUI(remainingDays, name, pic, weather);
    }
  }
};

const validate_inputs = () => {
  cityError.style.display = "none";
  dateError.style.display = "none";
  if(!cityInput.value){
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>You need to enter the city`;
    cityError.style.display = "block";
    return;
  }
  if(!dateInput.value){
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Please enter the date`;
    dateError.style.display = "block";
    return;
  }
  if(getRdays(dateInput.value) < 0){
    dateError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i>Date cannot be in the past`;
    dateError.style.display = "block";
    return;
  }
  cityError.style.display = "none";
  dateError.style.display = "none";

  return true
};

const getCityLoc = async () => {
  if (cityInput.value) {
    const { data } = await axios.post("http://localhost:8000/getCity", formElement, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } else {
    cityError.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i> This field cannot be left empty`;
    cityError.style.display = "block";
  }
};

const getWeather = async (lng, lat, remainingDays) => {
  const { data } = await axios.post("http://localhost:8000/getWeather", {
    lng,
    lat,
    remainingDays,
  });

  return data;
};

const getRdays = (date) => {
  // Set the start and end dates
  const startDate = new Date();
  const endDate = new Date(date);

  // Calculate the time difference in milliseconds
  const timeDiff = endDate.getTime() - startDate.getTime();

  // Convert the time difference to days
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  // Output the result
  return daysDiff;
};

//getting the city picture from pixabay
const getCityPic = async (city_name) => {
  const { data } = await axios.post("http://localhost:8000/getCityPic", {
    city_name,
  });
  const { image } = await data;
  return image;
};

const updateUI = (Rdays, city, pic, weather) => {
  document.querySelector("#Rdays").innerHTML = `
  Your trip starts in ${Rdays} days from now
  `;
  document.querySelector(".cityName").innerHTML = `locationData: ${city}`;
  document.querySelector(".weather").innerHTML =
    Rdays > 7
      ? `Weather is: ${weather.description}`
      : `Weather is expected to be: ${weather.description}`;
  document.querySelector(".temp").innerHTML =
    Rdays > 7
      ? `Forecast: ${weather.temp}&degC`
      : `Temperature: ${weather.temp} &deg C`;
  document.querySelector(".max-temp").innerHTML =
    Rdays > 7 ? `Max-Temp: ${weather.app_max_temp}&degC` : "";
  document.querySelector(".min-temp").innerHTML =
    Rdays > 7 ? `Min-Temp: ${weather.app_min_temp}&degC` : "";
  document.querySelector(".cityPic").innerHTML = `
   <image 
   src="${pic}" 
   alt="an image that describes the city nature"
   >
   `;
  document.querySelector(".flight_data").style.display = "block";
};

export { handleSubmit };
