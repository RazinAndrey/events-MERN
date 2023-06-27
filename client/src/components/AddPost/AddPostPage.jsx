import React, { useState, useRef }from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { checkIsAuth } from "../../redux/slices/auth-slice";
import { Navigate, useNavigate } from "react-router-dom";
import { createPost } from "../../redux/slices/posts-slice";
import DatePicker from "react-datepicker";
import ru from 'date-fns/locale/ru';
import "react-datepicker/dist/react-datepicker.css";
import { FiDelete } from "react-icons/fi";

const Create = () => {
    // react-hook-form
    const { register, handleSubmit, formState: { errors }} = useForm({mode: "onChange"});

    // inputs
    const [title, setTitle] = useState('Заголовок 1');
    const [text, setText] = useState('Текст-Текст-Текст');
    const [image, setImage] = useState('');
    const [addressUrl, setAddressUrl] = useState('https://github.com/RazinAndrey');
    const [dateEnd, setDateEnd] = useState(new Date());
    const [type, setType] = useState('Вузовская');

    // загрузка файла
    const inputFileRef = useRef(null);

    // отправка на сервер
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSubmit = () => {
        try {
            const data = new FormData();
            data.append('title', title);
            data.append('type', type);
            data.append('text', text);
            data.append('image', image);
            data.append('addressUrl', addressUrl);
            data.append('dateEnd', dateEnd);
            dispatch(createPost(data));
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    // очистка формы
    const clearFormHandler = () => {
        setTitle('');
        setText('');
        setAddressUrl('');
        setType('Вузовская');
        setDateEnd(new Date());
    }
    // очистка картинки
    const onClickRemoveImage = () => {
        setImage('');
    }

    // проверка auth
    const isAuth = useSelector(checkIsAuth);
    if(!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/posts"/>
    }

    return (
        
        <div className="create">
            <form className="form-custom" onSubmit={handleSubmit(onSubmit)}> 
                <h3 className="title">Создание статьи</h3>
                <div className="item">
                    <label className="form-lable">Заголовок</label>
                    <input className="create-input" type="text"
                        {...register("title", { required: "Укажите 'Title'" })}
                        onChange={(e) => setTitle(e.target.value)}
                        value={title} />
                    <div className="error">{errors.title && <p className="error-message">{errors.title.message}</p>}</div>
                </div>
                <div className="item">
                    <label className="form-lable">Тип</label>
                    <select className="select-custom" onChange={(e) => setType(e.target.value)} value={type}>  
                        <option value="Вузовская">Вузовская</option>
                        <option value="Региональная">Региональная</option>
                        <option value="Всероссийская">Всероссийская</option>
                        <option value="Международная">Международная</option>
                    </select>
                    <p className="type">{type}</p> 
                </div>
                <div className="item">
                    <label className="form-lable">Текст</label>
                    <textarea className="create-textarea" type="text"
                        {...register("text", { required: "Укажите 'Text'" })} 
                        onChange={(e) => setText(e.target.value)}
                        value={text} />
                    <div className="error">{errors.text && <p className="error-message">{errors.text.message}</p>}</div>
                </div>
                <div className="item">
                    <label className="form-lable">URL</label>
                    <input className="create-input" type="text"
                        {...register("url", { required: "Укажите 'URL'" , pattern:{ value: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))/, message:'Введите корректный адрес' }})} 
                        onChange={(e) => setAddressUrl(e.target.value)}
                        value={addressUrl} />
                    <div className="error">{errors.url && <p className="error-message">{errors.url.message}</p>}</div>
                </div>
                <div className="item">
                    <label className="form-lable">Изображение</label>
                    <button className="btn-upload" type="button"
                        onClick={() => inputFileRef.current.click()}>Прикрепить изображение:</button>
                    <input type="file" hidden accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}  
                        ref={inputFileRef} />
                    <div className="img-and-btn">
                        { image &&
                            <>
                                <img src={URL.createObjectURL(image)} alt="" />
                                <button type="button" className="btn-delete" onClick={onClickRemoveImage}>Удалить</button>
                            </>
                        }
                    </div>
                </div>
                <div className="item">
                    <label className="form-lable">Дата окончания</label>
                    <DatePicker
                        className="create-input" 
                        selected={dateEnd} 
                        onChange={(e) => setDateEnd(e)} 
                        minDate={new Date()}
                        popperPlacement="top-end" 
                        locale={ru}
                        dateFormat="dd/MM/yyyy"
                        required
                        onKeyDown={(e) => {
                            e.preventDefault();
                        }}
                    /> 
                </div>
                <div className="block-buttons">
                    <button className="btn-create" type="submit">Создать</button>
                    <button className="btn-cancel" type="button" onClick={clearFormHandler}>
                        <FiDelete className="icon"/>    
                    </button>
                </div>
            </form>    
        </div>
    );
}

export default Create;
