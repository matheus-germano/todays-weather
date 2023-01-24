import { useEffect } from 'react'

export function Weather() {
  useEffect(() => {
    fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${
        import.meta.env.VITE_WEATHER_API_KEY
      }&q=Campinas&days=7&aqi=no&alerts=yes`,
    )
      .then((response) => response.json())
      .then((response) => console.log(response))
  }, [])

  return <h1>Weather</h1>
}
