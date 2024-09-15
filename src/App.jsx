import AuthProvider from "./context/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Cv from "./pages/Cv";
import CourseWork from "./pages/CourseWork";
import BlogPosts from "./pages/BlogPosts";
import Portfolio from "./pages/Portfolio";
import ProjectPage from "./pages/ProjectPage";

const App = () => (
  <Router>
    <AuthProvider>
      <Layout>
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/coursework" element={ <CourseWork />} />
        <Route path="/cv" element={ <Cv />}/>
        <Route path="/blog-posts" element={ <BlogPosts /> }/>
        <Route path="/portfolio" element={ <Portfolio /> } />
        <Route path="/portfolio/:id" element={<ProjectPage />} />
      </Routes>
      </Layout>
    </AuthProvider>
  </Router>
);


export default App;
