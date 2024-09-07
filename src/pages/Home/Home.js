import {Link} from 'react-router-dom';

import Header from '../Header.js';

function Home() {
  return (
    <div style={{width: "100vw", height: "100vh", backgroundColor: "#222222"}}>
      <Header title="Data Structures and Algorithms Visualizer" />
    </div>
  );
}

export default Home;