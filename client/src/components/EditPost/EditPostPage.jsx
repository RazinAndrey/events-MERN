import React, { useState, useRef, useCallback, useEffect }from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { checkIsAuth } from "../../redux/slices/auth-slice";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import ru from 'date-fns/locale/ru';
import "react-datepicker/dist/react-datepicker.css";
import { FiDelete } from "react-icons/fi";
import axios from '../../api/api';
import { updatePost } from "../../redux/slices/posts-slice";

const EditPostPage = () => {
    // react-hook-form
    const { handleSubmit } = useForm();

    // inputs
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [oldImage, setOldImage] = useState('');
    const [newImage, setNewImage] = useState('');
    const [addressUrl, setAddressUrl] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [type, setType] = useState('');

    // загрузка файла
    const inputFileRef = useRef(null);
    // отправка на сервер
    const dispatch = useDispatch();
    // навигация 
    const navigate = useNavigate();
    // параметры
    const params = useParams();

    // загружаем наш пост
    const fetchPost = useCallback(async () => {
        const { data } = await axios.get(`/posts/${params.id}`);
        setTitle(data.title);
        setText(data.text);
        setOldImage(data.imgUrl);
        setAddressUrl(data.addressUrl);
        setType(data.type);
        setDateEnd(new Date(data.dateEnd));
    }, [params.id]);

    // обновляем пост
    const onSubmit = () => {
        try {
            const updatedPost = new FormData();
            updatedPost.append('id', params.id)
            updatedPost.append('title', title);
            updatedPost.append('text', text);
            updatedPost.append('image', newImage);
            updatedPost.append('type', type);
            updatedPost.append('addressUrl', addressUrl);
            updatedPost.append('dateEnd', dateEnd);
            dispatch(updatePost(updatedPost));
            navigate('/');
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    // очистка формы
    const clearFormHandler = () => {
        setText('');
        setTitle('');
        setAddressUrl('');
        setType('Вузовская');
        setDateEnd(new Date());
    }
    const onClickRemoveOldImage = () => {
        setOldImage('');
    }
    const onClickRemoveNewImage = () => {
        setNewImage('');
    }

    // состояние формы
    useEffect(() => {
        fetchPost()
    }, [fetchPost]);

    // проверка auth
    const isAuth = useSelector(checkIsAuth);
    if(!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/"/>
    }

    return (
        
        <div className="create">
            <form className="form-custom" onSubmit={handleSubmit(onSubmit)}> 
                <h3 className="title">Обновление статьи</h3>
                <div className="item">
                    <label className="form-lable">Заголовок</label>
                    <input className="create-input" type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title} />
                </div>
                {/* defaultValue="default"> */}
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
                        onChange={(e) => setText(e.target.value)}
                        value={text} />
                </div>
                <div className="item">
                    <label className="form-lable">URL</label>
                    <input className="create-input" type="text"
                        onChange={(e) => setAddressUrl(e.target.value)}
                        value={addressUrl} />
                </div>
                <div className="item">
                    <label className="form-lable">Изображение</label>
                    <button className="btn-upload" type="button"
                        onClick={() => inputFileRef.current.click()}>Прикрепить изображение:</button>
                    <input type="file" hidden accept="image/*"
                        onChange={(e) => setNewImage(e.target.files[0])}  
                        ref={inputFileRef} />
                    <div className="img-and-btn">
                        {oldImage &&
                            <>
                                <img src={`https://events-mern-server-h337jz25i-razinandrey.vercel.app/${oldImage}`} alt="" />
                                <button type="button" className="btn-delete" onClick={onClickRemoveOldImage}>Удалить</button>
                            </>
                        }
                        {newImage &&
                            <>
                                <img src={URL.createObjectURL(newImage)} alt="" />
                                <button type="button" className="btn-delete" onClick={onClickRemoveNewImage}>Удалить</button>
                            </>
                        }
                        {oldImage && newImage && onClickRemoveOldImage()}
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
                    <button className="btn-edit" type="submit">Обновить</button>
                    <button className="btn-cancel" type="button" onClick={clearFormHandler}>
                        <FiDelete className="icon"/>    
                    </button>
                </div>
            </form>    
        </div>
    );
}

export default EditPostPage;
