// Documentation: https://openweathermap.org/current
import axios from "axios";
import { Weather } from "../models/weather";

/**
 * Fetch the weather information from the Open Weather Map API
 * @param zipCode
 */
export const getWeatherInformation = async (zipCode: string) =>
  axios
    .get<Weather>("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        zip: zipCode,
        appid: process.env.OPEN_WEATHER_MAP_API_KEY ?? "",
      },
    })
    .then((response) => response.data);
