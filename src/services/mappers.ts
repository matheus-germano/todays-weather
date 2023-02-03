import { LocationCountryProps, NextDaysForecastProps } from '../@types/weather'

export function WeatherApiResponseMapper(data: any): NextDaysForecastProps {
  return {
    date: new Date(data.date),
    condition: {
      icon: data.day.condition.icon,
      text: data.day.condition.text,
    },
    chanceOfRain: data.day.daily_chance_of_rain,
    maxTempInCelsius: data.day.maxtemp_c,
    minTempInCelsius: data.day.mintemp_c,
  }
}

export function RestCountriesApiResponseMapper(
  data: any,
): LocationCountryProps {
  return {
    name: data.name,
    flag: data.flag,
    countryCode: data.alpha2Code,
  }
}
