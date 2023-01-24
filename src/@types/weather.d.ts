export interface LocationCountryProps {
  name: string
  flag: string
  countryCode: string
}

export interface LocationProps {
  city: string
  state: string
  country: LocationCountryProps
}

export interface DayForecastConditionProps {
  icon: string
  text: string
}

export interface NextDaysForecastProps {
  date: Date
  condition: DayForecastConditionProps
  chanceOfRain: number
  maxTempInCelsius: number
  minTempInCelsius: number
}

export interface CurrentDayForecastProps {
  date: Date
  condition: DayForecastConditionProps
  chanceOfRain: number
  currentTemperature: number
  maxTemperatureInCelsius: number
  minTemperatureInCelsius: number
  windKilometersPerHour: number
}
