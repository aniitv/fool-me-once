import "./styles/index.css";
import Login from "./components/Login.jsx";
import Logo from "./assets/icons/logo.png";


function App() {
  return (
    <div>
      <img src={Logo} alt="logo" />
      <Login />
    </div>
  );
}
export default App;
