import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Blog from './pages/Blog'
import WorkDetail from './pages/WorkDetail'
import ClaudeTest from './pages/ClaudeTest'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/work/:slug" element={<WorkDetail />} />
        <Route path="/claude-test" element={<ClaudeTest />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
