import axios from "axios";

export const weatherTemp = (lo, la, Rdays, key) => {
    if (Rdays < 0) {
        return Promise.resolve({
            message: "Date cannot be in the past",
            error: true
        });
    }

    const url = Rdays > 7
        ? `https://api.weatherbit.io/v2.0/forecast/daily?lat=${la}&lon=${lo}&units=M&days=${Rdays}&key=${key}`
        : `https://api.weatherbit.io/v2.0/current?lat=${la}&lon=${lo}&units=M&key=${key}`;

    return axios.get(url)
        .then((response) => {
            console.log("******************************************************");
            const data = response.data.data;
            const lastData = data[data.length - 1];

            const { weather, temp, app_max_temp, app_min_temp } = lastData;
            const { description } = weather;

            const weather_data = Rdays > 7 
                ? { description, temp, app_max_temp, app_min_temp }
                : { description, temp };

            console.log(weather_data);
            console.log("******************************************************");
            return weather_data;
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            return {
                message: "Failed to fetch weather data",
                error: true
            };
        });
};
