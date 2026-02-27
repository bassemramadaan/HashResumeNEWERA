import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EditorPage from './pages/EditorPage';
import HashHuntPage from './pages/HashHuntPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/hash-hunt" element={<HashHuntPage />} />
      </Routes>
    </BrowserRouter>
  );
}
