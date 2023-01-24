import { ArrowBendLeftUp, ArrowBendRightDown, Wind } from 'phosphor-react'
import { useEffect, useState } from 'react'

interface LocationCountryProps {
  name: string
  flag: string
  countryCode: string
}

interface LocationProps {
  city: string
  state: string
  country: LocationCountryProps
}

interface DayForecastConditionProps {
  icon: string
  text: string
}

interface NextDaysForecastProps {
  date: Date
  condition: DayForecastConditionProps
  chanceOfRain: number
  maxTempInCelsius: number
  minTempInCelsius: number
}

interface CurrentDayForecastProps {
  date: Date
  condition: DayForecastConditionProps
  chanceOfRain: number
  currentTemperature: number
  maxTemperatureInCelsius: number
  minTemperatureInCelsius: number
  windKilometersPerHour: number
}

export function Weather() {
  const [location, setLocation] = useState<LocationProps>()
  const [currentDayForecast, setCurrentDayForecast] =
    useState<CurrentDayForecastProps>({})
  const [nextDaysForecast, setNextDaysForecastProps] = useState<
    NextDaysForecastProps[]
  >([])

  function fetchUserIp() {
    fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${import.meta.env.VITE_IP_GEOLOCATION_KEY
      }`,
    )
      .then((response) => response.json())
      .then((response) => {
        const tempLocation: LocationProps = {
          city: response.city,
          state: response.state_prov,
          country: {
            name: response.country_name,
            flag: response.country_flag,
            countryCode: response.country_code3,
          },
        }

        setLocation(tempLocation)
      })
  }

  function fetchForecastData() {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${import.meta.env.VITE_WEATHER_API_KEY
      }&q=Campinas&days=7&aqi=no&alerts=yes`,
    )
      .then((response) => response.json())
      .then((response) => {
        const tempCurrentDayForecast: CurrentDayForecastProps = {
          date: new Date(),
          condition: {
            icon: response.current.condition.icon,
            text: response.current.condition.text,
          },
          chanceOfRain:
            response.forecast.forecastday[0].day.daily_chance_of_rain,
          currentTemperature: response.current.temp_c,
          maxTemperatureInCelsius:
            response.forecast.forecastday[0].day.maxtemp_c,
          minTemperatureInCelsius:
            response.forecast.forecastday[0].day.mintemp_c,
          windKilometersPerHour: response.current.wind_kph,
        }

        const tempNextDaysForecast: NextDaysForecastProps[] =
          response.forecast?.forecastday?.map((day: any) => {
            return {
              date: new Date(day.date),
              condition: {
                icon: day.day.condition.icon,
                text: day.day.condition.text,
              },
              chanceOfRain: day.day.daily_chance_of_rain,
              maxTempInCelsius: day.day.maxtemp_c,
              minTempInCelsius: day.day.mintemp_c,
            } as NextDaysForecastProps
          })

        setCurrentDayForecast(tempCurrentDayForecast)
        setNextDaysForecastProps(tempNextDaysForecast)
      })
  }

  useEffect(() => {
    fetchUserIp()
    fetchForecastData()
  }, [])

  return (
    <div>
      <div>
        <h3>{location?.city}</h3>
        <div>
          <p>{location?.country.countryCode}</p>
          <img src={location?.country.flag} alt={location?.country.name} />
        </div>
      </div>
      <div>
        <p>{currentDayForecast?.condition?.text}</p>
        <div>
          <h2>{currentDayForecast?.currentTemperature} &deg;C</h2>
          <img src={currentDayForecast?.condition?.icon} alt="" />
        </div>
      </div>
      <div>
        <p>
          <span>
            <ArrowBendRightDown size={32} />
          </span>{' '}
          {currentDayForecast?.minTemperatureInCelsius} &deg;C
        </p>
        <p>
          <span>
            <ArrowBendLeftUp size={32} />
          </span>{' '}
          {currentDayForecast?.maxTemperatureInCelsius} &deg;C
        </p>
        <p>
          <span>
            <Wind size={32} />
          </span>
          {currentDayForecast?.windKilometersPerHour} K/h
        </p>
      </div>
    </div>
  )
}
