import {
  ArrowBendLeftUp,
  ArrowBendRightDown,
  CaretDown,
  Check,
  CloudRain,
  Wind,
} from 'phosphor-react'
import { useEffect, useState } from 'react'
import * as Select from '@radix-ui/react-select'

import {
  CurrentDayForecastProps,
  LocationCountryProps,
  LocationProps,
  NextDaysForecastProps,
} from '../../@types/weather'

import {
  RestCountriesApiResponseMapper,
  WeatherApiResponseMapper,
} from '../../services/mappers'

export function Weather() {
  const [location, setLocation] = useState<LocationProps>({})
  const [currentDayForecast, setCurrentDayForecast] =
    useState<CurrentDayForecastProps>({})
  const [nextDaysForecast, setNextDaysForecastProps] = useState<
    NextDaysForecastProps[]
  >([])
  const [countries, setCountries] = useState<LocationCountryProps[]>([])

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
      }&q=${location?.city ?? 'Campinas'}&days=7&aqi=no&alerts=yes`,
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

  function getCountries() {
    fetch(`https://restcountries.com/v2/all`)
      .then((response) => response.json())
      .then((response) => {
        const tempCountries: LocationCountryProps[] = response.map(
          (country: any) => RestCountriesApiResponseMapper(country),
        )

        setCountries(tempCountries)
      })
  }

  useEffect(() => {
    fetchUserIp()
    fetchForecastData()
    getCountries()
  }, [])

  useEffect(() => {
    fetchForecastData()
  }, [location])

  return (
    <div className="max-w-7xl h-screen min-h-screen flex flex-col md:flex-row justify-center mx-auto p-4 gap-4">
      <div className="w-full md:max-w-xs flex flex-col gap-4">
        <Select.Root>
          <Select.Trigger className="bg-white py-3 px-4 rounded text-sm text-zinc-500 flex items-center justify-between">
            <Select.Value placeholder="Select a country" />
            <Select.Icon>
              <CaretDown size={24} />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="bg-white shadow-md rounded p-2 text-zinc-500 overflow-hidden">
              <Select.Viewport>
                {countries.map((country) => (
                  <Select.SelectItem
                    key={country.countryCode}
                    value={country.name}
                    className="flex items-center rounded p-2 gap-2 text-sm hover:bg-[#f1f2f5] outline-none cursor-pointer"
                  >
                    <Select.SelectItemText>
                      {country.name}
                    </Select.SelectItemText>
                    <Select.SelectItemIndicator>
                      <Check />
                    </Select.SelectItemIndicator>
                  </Select.SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <Select.Root disabled={true}>
          <Select.Trigger className="bg-white py-3 px-4 rounded text-sm text-zinc-500 flex items-center justify-between disabled:cursor-not-allowed">
            <Select.Value placeholder="Select a city" />
            <Select.Icon>
              <CaretDown size={24} />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="bg-white shadow-md rounded p-2 text-zinc-500 overflow-hidden">
              <Select.Viewport>
                {countries.map((country) => (
                  <Select.SelectItem
                    key={country.countryCode}
                    value={country.name}
                    className="flex items-center rounded p-2 gap-2 text-sm hover:bg-[#f1f2f5] outline-none cursor-pointer"
                  >
                    <Select.SelectItemText>
                      {country.name}
                    </Select.SelectItemText>
                    <Select.SelectItemIndicator>
                      <Check />
                    </Select.SelectItemIndicator>
                  </Select.SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
      <div className="w-full md:max-w-2xl flex flex-col gap-4">
        <div className="bg-[#fff] flex flex-col rounded-lg p-5 gap-8">
          <div className="flex justify-between">
            <h3>{location?.city}</h3>
            <div className="flex items-center gap-2">
              <p>{location?.country?.countryCode}</p>
              <img
                className="h-4 rounded-lg"
                src={location?.country?.flag}
                alt={location?.country?.name}
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
                className="w-screen sm:max-w-[250px] sm:w-auto bg-[#fff] flex flex-col rounded-lg p-5 gap-8 shrink-0 snap-center sm:m-0 mb-2"
              >
                <div className="flex justify-between">
                  <p className="text-sm">
                    {new Intl.DateTimeFormat('pt-BR', {
                      weekday: 'long',
                      month: 'numeric',
                      day: 'numeric',
                    }).format(day.date)}
                  </p>
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
                    {day.maxTempInCelsius} &deg;C
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
