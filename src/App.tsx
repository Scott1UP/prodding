import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TextEffects from './pages/TextEffects'
import TextHoverEffectDetail from './pages/TextHoverEffectDetail'
import WritingTextDetail from './pages/WritingTextDetail'
import Backgrounds from './pages/Backgrounds'
import LottieFiles from './pages/LottieFiles'
import BloomingEthFlowerDetail from './pages/BloomingEthFlowerDetail'
import Experiments from './pages/Experiments'
import ScrollingNarrativeDetail from './pages/ScrollingNarrativeDetail'
import WalletPassDesignerDetail from './pages/WalletPassDesignerDetail'

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
        <Route path="experiments" element={<Experiments />} />
        <Route path="experiments/scrolling-narrative-block" element={<ScrollingNarrativeDetail />} />
        <Route path="experiments/wallet-pass-designer" element={<WalletPassDesignerDetail />} />
      </Route>
    </Routes>
  )
}
