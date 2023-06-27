// hooks
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// функции из slice для auth
import { checkIsAuth, registerUser } from '../../redux/slices/auth-slice';
// функция для отображения ошибки
import { toast } from 'react-toastify';

const RegisterPage = () => {
    // react-hook-form
    const { register, handleSubmit, 
        formState: { errors, isValid }} = useForm(
            { defaultValues: { 
                fullName: '', 
                login: '', 
                email: '', 
                password: '' }, mode: "onBlur" });

    // useDispatch
    const dispatch = useDispatch();

    // onSubmit - register user
    const onSubmit = (values) => {
        dispatch(registerUser(values));
    };

    // useSelectors
    const { status } = useSelector((state) => state.auth);
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
        <div className="register">
            {/* 'handleSubmit' проверяет входные данные перед вызовом 'onSubmit' */}
            <form className="form-custom" onSubmit={handleSubmit(onSubmit)}>
                <h3 className="title">Регистрация</h3> 
                <div className="item">
                    <label className="form-lable">ФИО</label>
                    {/* регистрируем ввод fullName в hook, вызывая функцию 'register' */}
                    <input className="form-input" type="text" {...register("fullName",
                        {required: "Укажите 'ФИО'", minLength: { value: 3, message: "Минимум 3 символа"}})} />
                    {/* ошибки будут возвращаться, когда проверка поля не пройдена  */}
                    <div className="error">
                        {errors.fullName && <p className="error-message">{errors.fullName.message}</p>}
                    </div>
                </div>
                <div className="item">
                    <label className="form-lable">Login</label>
                    {/* регистрируем ввод email в hook, вызывая функцию 'register' */}
                    <input className="form-input"  type="text" {...register("login", 
                        {required: "Укажите 'Login'", minLength: {value: 3, message: "Минимум 3 символа"}})} />
                    {/* ошибки будут возвращаться, когда проверка поля не пройдена  */}
                    <div className="error">
                        {errors.login && <p className="error-message">{errors.login.message}</p>}
                    </div>
                </div>
                <div className="item">
                    <label className="form-lable">Email</label>
                    {/* регистрируем ввод password в hook, вызывая функцию 'register' */}
                    <input className="form-input"  type="email"  {...register("email", 
                        {required: "Укажите 'Email'", minLength: {value: 3, message: "Минимум 3 символа"},
                            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Ошибка заполнения" }})} />
                    {/* ошибки будут возвращаться, когда проверка поля не пройдена  */}
                    <div className="error">{errors.email && <p className="error-message">{errors.email.message}</p>}</div>
                </div>
                <div className="item">
                    <label className="form-lable">Password</label>
                    {/* регистрируем ввод в hook, вызывая функцию 'register' */}
                    <input className="form-input"  type="password" {...register("password",
                    {required: "Укажите 'Password'", minLength: { value: 3, message: "Минимум 3 символа"}})} />
                    {/* ошибки будут возвращаться, когда проверка поля не пройдена  */}
                    <div className="error">{errors.password && <p className="error-message">{errors.password.message}</p>}</div>
                </div>
                <input disabled={!isValid} className="btn-register" type="submit" value="Зарегистрироваться"/>
            </form>    
        </div>
    );
}

export default RegisterPage;

