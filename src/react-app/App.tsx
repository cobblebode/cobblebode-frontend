import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import Store from "@/react-app/pages/Store";
import Shop from "@/react-app/pages/Shop";
import Rules from "@/react-app/pages/Rules";
import Downloads from "@/react-app/pages/Downloads";
import Admin from "@/react-app/pages/Admin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/store" element={<Store />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/loja" element={<Shop />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
