import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TextEffects from './pages/TextEffects'
import TextHoverEffectDetail from './pages/TextHoverEffectDetail'
import WritingTextDetail from './pages/WritingTextDetail'
import Backgrounds from './pages/Backgrounds'
import LottieFiles from './pages/LottieFiles'
import BloomingEthFlowerDetail from './pages/BloomingEthFlowerDetail'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<TextEffects />} />
        <Route path="text-effects/text-hover-effect" element={<TextHoverEffectDetail />} />
        <Route path="text-effects/writing-text" element={<WritingTextDetail />} />
        <Route path="backgrounds" element={<Backgrounds />} />
        <Route path="lottie-files" element={<LottieFiles />} />
        <Route path="lottie-files/blooming-eth-flower" element={<BloomingEthFlowerDetail />} />
      </Route>
    </Routes>
  )
}
