import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddCardForm from "./pages/AddCardForm";
import Buckets from "./pages/Buckets";
import EditCard from "./pages/EditCard";
import History from "./pages/History";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navbar />} />
          <Route path="/addCard" element={<AddCardForm />} />
          <Route path="/buckets" element={<Buckets />} />
          <Route path="/buckets/edit/:id/:bucket" element={<EditCard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
