import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import About from "./About";
import Projects from "./Projects";
import Reading from "./Reading";
import Blog from "./Blog";
import BlogPost from "./BlogPost";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/reading" element={<Reading />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
