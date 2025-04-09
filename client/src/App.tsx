import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Call from './pages/Call';

function App() {
  const [username, setUsername] = useState<string>('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setUsername={setUsername} />} />
        <Route path="/call/:roomId" element={<Call username={username || 'Guest'} />} />
      </Routes>
    </Router>
  );
}

export default App;