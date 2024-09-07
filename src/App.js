import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Home from './pages/Home/Home';
import Search from './pages/Search/Search';
import Tree from './pages/Tree/Tree';

function App() {
  return (
    <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/tree" element={<Tree />} />
          <Route path="*" element={<Home />} />
        </Routes>
    </>
  );
}

export default App;
