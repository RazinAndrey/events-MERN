// hooks
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// функции из slice для auth
import { checkIsAuth, loginUser } from '../../redux/slices/auth-slice';
// функция для отображения ошибки
import { toast } from 'react-toastify';

const LoginPage = () => {
    // react-hook-form
    const { register, handleSubmit, 
        formState: { errors, isValid }} = useForm({
            defaultValues: { login: '', password: ''}, mode: "onBlur"});
    
    // useDispatch
    const dispatch = useDispatch();
    
    // onSubmit
    const onSubmit = (values) => {
        dispatch(loginUser(values));
    };

    // useSelector
    const { status } = useSelector ((state) => state.auth);
    const isAuth = useSelector(checkIsAuth);

    // useNavigate
    const navigate = useNavigate();
    
    // useEffect
    useEffect(() => {
        if (status){
            toast.info(status, {
                position: toast.POSITION.BOTTOM_LEFT
            });
        }
        if (isAuth) {
            navigate('/');
        }
    }, [status, isAuth, navigate]);

    return (
        <div className="login">
            {/* 'handleSubmit' проверяет входные данные перед вызовом 'onSubmit' */}
            <form className="form-custom" onSubmit={handleSubmit(onSubmit)}>
                <h3 className="title">Вход</h3>
                <div className="item">
                    <label className="form-lable">Login</label>
                    {/* регистрируем ввод email в хук, вызвав функцию 'register' */}
                    <input className='form-input' type="text" 
                    {...register("login", { required: "Укажите 'Login'" })} />
                    {/* ошибки будут возвращаться, когда проверка поля не пройдена  */}
                    <div className="error">
                        {errors.login && <p className="error-message">{errors.login.message}</p>}
                    </div>
                </div>
                <div className="item">
                    <label className="form-lable">Password</label>
                    {/* регистрируем свой ввод в хук, вызвав функцию 'register' */}
                    <input className='form-input' type="password" {...register("password", { required: "Укажите 'Password'" })} />
                    {/* ошибки будут возвращаться, когда проверка поля не пройдена  */}
                    <div className="error">{errors.password && <p className="error-message">{errors.password.message}</p>}</div>
                </div>
                <input disabled={!isValid} className="btn-login" type="submit" value="Войти"/>
            </form>    
        </div>
    )
}

export default LoginPage;
