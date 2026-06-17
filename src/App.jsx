import Navbar from "./components/Navbar/Navbar";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />

      <header className="app-header">
        <h1>QuestLog</h1>
        <p>Discover, explore, and track your next favorite game.</p>
      </header>

      <AppRoutes />
    </div>
  );
}

export default App;