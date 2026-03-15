import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import BackgroundVideo from './components/BackgroundVideo'
import Home from './pages/Home'
import Blog from './pages/Blog'
import WorkDetail from './pages/WorkDetail'

function App() {
  return (
    <BrowserRouter>
      <BackgroundVideo />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
