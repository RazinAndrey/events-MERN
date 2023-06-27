import s from './Header.module.css';
import React, { useState } from 'react';
// маршрутизация
import { NavLink } from 'react-router-dom';
import { FaBars, FaTimes} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
// import { checkIsAuth, logout } from '../../redux/slices/auth-slice';
import { toast } from 'react-toastify';
import { checkIsAuth, logout } from '../../../redux/slices/auth-slice';

function Header() {
  // текущая страница
  const setActive = ({ isActive }) => (isActive ? s.active_link : "");

  // aвторизован - ?
  const isAuth = useSelector(checkIsAuth);

  // выход
  const dispatch = useDispatch();
  const onClickLogout = () =>{
    if(window.confirm("Вы действительно хотите выйти?")){
      dispatch(logout());
      // удаляем токен
      window.localStorage.removeItem('token');
      toast.info('Вы вышли из системы', {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  };

  // переключение меню 
  const [Mobile, setMobile] = useState(false);

  const { user } = useSelector((state) => state.auth);
  
  return (
    <div className={s.header}>
      <div className={s.logo}>Events</div>
      <div className={Mobile ? s.navbar_mobile : s.navbar_pc} onClick={() => setMobile (false)}>
        <div className={s.links}>
        <NavLink to="/" className={setActive}>Мероприятия</NavLink>
        {isAuth ? ( 
          user.roles[0] === "STUDENT" ?
          <>
            <NavLink to={`/user/${user._id}`} className={setActive}>Профиль</NavLink>
            <NavLink onClick={onClickLogout}>Выход</NavLink>
          </> :
          <>
            <NavLink to="/add-post" className={setActive}>Создать</NavLink>
            <NavLink to="/my-posts" className={setActive}>Мои</NavLink>
            <NavLink to={`/user/${user._id}`} className={setActive}>Профиль</NavLink>
            <NavLink onClick={onClickLogout}>Выход</NavLink>
          </>
          )
          : (
          <>
            <NavLink to="/auth/login" className={setActive}>Войти</NavLink>
            <NavLink to="/auth/register" className={setActive}>Регистрация</NavLink>
          </>)
        }
        </div>
      </div>
      <div className={s.navbar_btns} onClick={() => setMobile (!Mobile)}>
        {Mobile ? <FaTimes className={s.btn_close} /> : <FaBars className={s.btn_open}/>}
      </div>
    </div>
  );
}

export default Header;