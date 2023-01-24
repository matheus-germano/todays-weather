import { Routes, Route } from 'react-router-dom'

import { Weather } from './pages/Weather'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Weather />} />
    </Routes>
  )
}
