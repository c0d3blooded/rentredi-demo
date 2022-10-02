export interface Weather {
  coord: {
    /** City geo location, longitude */
    lon: number;
    /** City geo location, latitude */
    lat: number;
  };
  weather: [
    {
      /** Weather condition id */
      id: number;
      /** Group of weather parameters (Rain, Snow, Extreme etc.) */
      main: "Rain" | "Snow" | "Extreme";
      /** Weather condition within the group. You can get the output in your language (https://openweathermap.org/current#multi) */
      description: string;
      /** Weather icon id */
      icon: string;
    }
  ];
  /** Internal parameter */
  base: string;
  main: {
    /** Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
    temp: number;
    /** Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
    feels_like: number;
    /** Minimum temperature at the moment. This is minimal currently observed temperature (within large megalopolises and urban areas). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
    temp_min: number;
    /** Maximum temperature at the moment. This is maximal currently observed temperature (within large megalopolises and urban areas). Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit. */
    temp_max: number;
    /** Atmospheric pressure (on the sea level, if there is no sea_level or grnd_level data), hPa */
    pressure: number;
    /** Humidity, % */
    humidity: number;
    /** Atmospheric pressure on the sea level, hPa */
    sea_level: number;
    /** Atmospheric pressure on the ground level, hPa */
    grnd_level: number;
  };
  /** Visibility, meter. The maximum value of the visibility is 10km */
  visibility: number;
  wind: {
    /** Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour. */
    speed: number;
    /** Wind direction, degrees (meteorological) */
    deg: number;
    /** Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour */
    gust: number;
  };
  rain: {
    /** Rain volume for the last 1 hour, mm */
    "1h": number;
    /** Rain volume for the last 3 hours, mm */
    "3h": number;
  };
  snow?: {
    /** Snow volume for the last 1 hour, mm */
    "1h": number;
    /** Snow volume for the last 3 hours, mm */
    "3h": number;
  };
  clouds: {
    /** Cloudiness, % */
    all: number;
  };
  /** Time of data calculation, unix, UTC */
  dt: number;
  sys: {
    /** Internal parameter */
    type: number;
    /** Internal parameter */
    id: number;
    /** Internal parameter */
    message?: string;
    /** Country code (GB, JP etc.) */
    country: string;
    /** Sunrise time, unix, UTC */
    sunrise: number;
    /** Sunrise time, unix, UTC */
    sunset: number;
  };
  /** Shift in seconds from UTC */
  timezone: number;
  /** City ID. Please note that built-in geocoder functionality has been deprecated. (https://openweathermap.org/current#builtin) */
  id: number;
  /** City name. Please note that built-in geocoder functionality has been deprecated. (https://openweathermap.org/current#builtin) */
  name: string;
  /** Internal parameter */
  cod: number;
}
