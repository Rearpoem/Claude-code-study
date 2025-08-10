import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ToolBox from './components/ToolBox'
import FeimiAnalyzer from './components/FeimiAnalyzer'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ToolBox />} />
          <Route path="/feimi-analyzer" element={<FeimiAnalyzer />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
