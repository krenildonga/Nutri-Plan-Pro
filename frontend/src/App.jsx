import { useContext, useEffect, useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import { Diet_Rec } from './components/Diet_Rec/Diet_Rec';
import History from './components/History';
import { AuthContext, authHeaders } from './context/AuthContext';
import Footer from './components/Footer';
import ContactUs from './components/ContactUs';
import Blogs from './components/Blogs';
import BlogPost from './components/BlogPost';
import NotFound from './components/NotFound';
import ReviewPage from './components/ReviewPage';
import CommunityContextOrovider from './context/main';
import Index from './components/pages/Community/index';
import EditProfile from './components/EditProfile';
import ForgotPassword from './components/ForgotPassword';
import UpgradePlan from './components/UpgradePlan';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const ConnString = import.meta.env.PROD
    ? "/api"
    : (import.meta.env.VITE_ConnString || "http://localhost:8000");
  const { isAuthenticate, setIsAuthenticate, setUser } = useContext(AuthContext);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${ConnString}/auth/getuser`, {
          method: "GET",
          credentials: 'include',
          headers: authHeaders()
        });
        
        if (!response.ok) {
          setIsAuthenticate(false);
          setUser({});
          return;
        }

        const json = await response.json();
        if (json.success) {
          setUser(json.user);
          setIsAuthenticate(true);
        } else {
          setIsAuthenticate(false);
          setUser({});
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setIsAuthenticate(false);
        setUser({});
        // We don't toast error here because it happens on every page load/auth check
      }
    }
    fetchUser();
  }, [isAuthenticate])

  useEffect(()=>{
    if(!localStorage.getItem('auth-token')) localStorage.setItem('userData', JSON.stringify({ success: false }));
  },[])
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <CommunityContextOrovider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/get-diet-recommendation' element={<Diet_Rec />} />
          <Route path='/contactUs' element={<ContactUs />} />
          <Route path='/blogs' element={<Blogs />} />
          <Route path='/blog_post/:id' element={<BlogPost />} />
          <Route path='/diet-history' element={<History />} />
          <Route path="/community" element={<Index />}></Route>
          <Route path="/editprofile" element={<EditProfile />}></Route>
          <Route path="/review" element={<ReviewPage />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/upgrade-plan" element={<UpgradePlan />} />
          <Route path='/*' element={<NotFound />} />
        </Routes>
      </CommunityContextOrovider>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
