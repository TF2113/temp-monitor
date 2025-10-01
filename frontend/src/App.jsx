import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import About from "./About";
import Projects from "./Projects";
import Reading from "./Reading"
//import Blog from "./Blog";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<About />} />      {/* default page */}
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/reading" element={<Reading />} />
        {/* <Route path="/blog" element={<Blog />} /> */}
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
