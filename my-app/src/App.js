import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Catalog from './pages/Catalog/catalog';
import Home from './pages/Home/home';
import Admin from './pages/Admin/Admin.js';
import ErrorPage from "./pages/ErrorPage/errorPage";
import Cart from "./pages/Cart/Cart"
import "./css/index.css";
import "./css/fonts.css";

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />}/>
          <Route path="/catalog" element={<Catalog/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element = {<ErrorPage />} />
        </Routes>
      </Router>
    );
}

export default App;