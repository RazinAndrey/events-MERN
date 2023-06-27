import React from 'react';
// router
import { Routes, Route } from 'react-router-dom';
// my components
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import ScrollToTop from './components/common/ScrollToTop/ScrollToTop';
import PostsPage from './components/Posts/PostsPage';
import FullPostPage from './components/FullPost/FullPostPage';
import LoginPage from './components/Auth/LoginPage';
import RegisterPage from './components/Auth/RegisterPage';
import AddPostPage from './components/AddPost/AddPostPage';
import EditPostPage from './components/EditPost/EditPostPage';
import ProfilePage from './components/Profile/ProfilePage';
import MyPostsPage from './components/MyPosts/MyPostsPage';
// error - component - для отображения ошибки
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// hooks
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
// функция из slice для auth
import { getMe } from './redux/slices/auth-slice.js';

function App() {
  // проверка auth
  const dispatch = useDispatch();
  useEffect(()=> {
    dispatch(getMe())
  }, [dispatch]);
  return (
    <div className="wrapper">
      <Header />
      <Routes>
        <Route path="/" element={<PostsPage />} />
        {/* <Route path="/posts" element={<PostsPage />} /> */}
        <Route path="/post/:id" element={<FullPostPage/> } />
        <Route path="/add-post" element={<AddPostPage/> } />
        <Route path="/edit-post/:id" element={<EditPostPage/> } />
        <Route path="/my-posts" element={<MyPostsPage/> } />
        <Route path="/user/:id" element={<ProfilePage/> } />
        <Route path="/auth/login" element={<LoginPage/> } />
        <Route path="/auth/register" element={<RegisterPage/> } />
        <Route path="*" element={
          <h2 className="not_found">Ресурс не найден.</h2> 
        } />
      </Routes>
      <Footer />
      <ScrollToTop />
      <ToastContainer />
    </div>
  );
}

export default App;
