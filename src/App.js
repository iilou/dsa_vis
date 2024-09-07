import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Tree from './pages/Tree/Tree';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/tree" element={<Tree />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
