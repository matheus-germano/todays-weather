import {
  ArrowBendLeftUp,
  ArrowBendRightDown,
  CloudRain,
  Wind,
} from 'phosphor-react'
import { useEffect, useState } from 'react'

import {
  CurrentDayForecastProps,
  LocationProps,
  NextDaysForecastProps,
} from '../../@types/weather'

import { WeatherApiResponseMapper } from '../../services/mappers'

export function Weather() {
  const [location, setLocation] = useState<LocationProps>()
  const [currentDayForecast, setCurrentDayForecast] =
    useState<CurrentDayForecastProps>({})
  const [nextDaysForecast, setNextDaysForecastProps] = useState<
    NextDaysForecastProps[]
  >([])

  function fetchUserIp() {
    fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${
        import.meta.env.VITE_IP_GEOLOCATION_KEY
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
      `https://api.weatherapi.com/v1/forecast.json?key=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&q=${location?.city ?? 'Sao_Paulo'}&days=7&aqi=no&alerts=yes`,
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
          response.forecast?.forecastday?.map((day: any) =>
            WeatherApiResponseMapper(day),
          )

        tempNextDaysForecast.splice(0, 1)

        setCurrentDayForecast(tempCurrentDayForecast)
        setNextDaysForecastProps(tempNextDaysForecast)
      })
  }

  useEffect(() => {
    fetchUserIp()
    fetchForecastData()
  }, [])

  return (
    <div className="w-screen h-screen min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl flex flex-col gap-4 p-4">
        <div className="bg-[#fff] flex flex-col rounded-lg p-5 gap-8">
          <div className="flex justify-between">
            <h3>{location?.city}</h3>
            <div className="flex gap-2">
              <p>{location?.country.countryCode}</p>
              <img
                className="h-4 rounded-lg"
                src={location?.country.flag}
                alt={location?.country.name}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center">
            <h2 className="font-black text-5xl">
              <span className="text-8xl">
                {currentDayForecast?.currentTemperature}
              </span>{' '}
              &deg;C
            </h2>
            <div className="flex gap-2 justify-center items-center">
              <span>
                <img src={currentDayForecast?.condition?.icon} alt="" />
              </span>
              <p>{currentDayForecast?.condition?.text}</p>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-sm sm:text-base">
            <p className="flex gap-2 items-center">
              <span>
                <ArrowBendRightDown size={24} />
              </span>{' '}
              {currentDayForecast?.minTemperatureInCelsius} &deg;C
            </p>
            <p className="flex gap-2 items-center">
              <span>
                <ArrowBendLeftUp size={24} />
              </span>{' '}
              {currentDayForecast?.maxTemperatureInCelsius} &deg;C
            </p>
            <p className="flex gap-2 items-center">
              <span>
                <Wind size={24} />
              </span>
              {currentDayForecast?.windKilometersPerHour} K/h
            </p>
          </div>
        </div>
        <div className="w-full max-w-full sm:max-w-none flex grid-cols-none sm:grid sm:grid-cols-3 gap-4 overflow-x-auto snap-mandatory snap-x">
          {nextDaysForecast.length > 0 ? (
            nextDaysForecast.map((day) => (
              <div
                key={String(day.date)}
                className="max-w-[250px] bg-[#fff] flex flex-col rounded-lg p-5 gap-8 shrink-0 snap-center sm:m-0 mb-2"
              >
                <div className="flex justify-between">
                  <p>{new Intl.DateTimeFormat().format(day.date)}</p>
                  <img
                    className="h-6 rounded-lg"
                    src={day.condition.icon}
                    alt={day.condition.text}
                    title={day.condition.text}
                  />
                </div>
                <div className="flex flex-col gap-4 justify-center items-center">
                  <h1 className="flex gap-2 items-center">
                    <span>
                      <ArrowBendRightDown size={24} />
                    </span>{' '}
                    {day.minTempInCelsius} &deg;C
                  </h1>
                  <h1 className="flex gap-2 items-center">
                    <span>
                      <ArrowBendLeftUp size={24} />
                    </span>{' '}
                    {day.minTempInCelsius} &deg;C
                  </h1>
                </div>
                <div className="flex justify-center gap-4">
                  <p className="flex gap-2 items-center text-sm">
                    <span>
                      <ArrowBendLeftUp size={14} />
                    </span>{' '}
                    {day.minTempInCelsius} &deg;C
                  </p>
                  <p className="flex gap-2 items-center text-sm">
                    <span>
                      <CloudRain size={14} />
                    </span>
                    {day.chanceOfRain} %
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>There is no next days forecast!</p>
          )}
        </div>
      </div>
    </div>
  )
}
