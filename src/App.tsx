import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TextEffects from './pages/TextEffects'
import TextHoverEffectDetail from './pages/TextHoverEffectDetail'
import Backgrounds from './pages/Backgrounds'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<TextEffects />} />
        <Route path="text-effects/:slug" element={<TextHoverEffectDetail />} />
        <Route path="backgrounds" element={<Backgrounds />} />
      </Route>
    </Routes>
  )
}
