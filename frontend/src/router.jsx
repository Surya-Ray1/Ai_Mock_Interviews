import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import InterviewSetup from './pages/InterviewSetup';
import InterviewRoom from './pages/InterviewRoom';
import Results from './pages/Results';
import History from './pages/History';
import ProtectedRoute from './components/ProtectedRoute';

export default function Router(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route element={<ProtectedRoute/>}>
        <Route path="/setup" element={<InterviewSetup/>} />
        <Route path="/interview/:id" element={<InterviewRoom/>} />
        <Route path="/results/:id" element={<Results/>} />
        <Route path="/history" element={<History/>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace/>} />
    </Routes>
  );
}