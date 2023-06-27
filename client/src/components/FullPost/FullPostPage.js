import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/api';
import Loading from '../common/Loading/Loading';
import s from './Post.module.css';
import s2 from './Post_Comment.module.css';

import Moment from 'react-moment';
import { useDispatch, useSelector } from 'react-redux';
import { AiFillEye, AiOutlineMessage, AiOutlineRollback, AiTwotoneEdit, AiFillDelete } from 'react-icons/ai';
import { removePost } from '../../redux/slices/posts-slice';
import { toast } from 'react-toastify';
import { createComment, getPostComments } from '../../redux/slices/comments-slice';
import ItemsComment from '../ItemsComment/ItemsComment';
import { checkIsAuth } from '../../redux/slices/auth-slice';

const FullPost = () => {

    const isAuth = useSelector(checkIsAuth);

    // состояние поста
    const [post, setPost] = useState(null);
    // состояние загрузки
    const [isLoading, setLoading] = useState(true);
    // состояние поля ввода коментариев
    const [comment, setComment] = useState('');

    // данные, навигаця, параметры, dispatch
    const { user } = useSelector((state) => state.auth);
    const { comments } = useSelector((state) => state.comments);
    const navigate = useNavigate();
    const { id } = useParams();
    const dispatch = useDispatch();

    // кнопка - удаления мероприятия
    const removePostHandler = () => {
        try {
            if (window.confirm("Вы действительно хотите удалить запись?")) {
                dispatch(removePost(id));
                navigate('/');
                toast.info('Мероприятие было удалено.', {
                    position: toast.POSITION.BOTTOM_LEFT
                });
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
        }
    }

    // кнопка - создание коментария
    const handleSubmit = () => {
        try {
            const postId = id;
            dispatch(createComment({ postId, comment}));
            setComment('');
        } catch (error) {
            console.log(error);
        }
    }

    // получаем пост
    const fetchPost = useCallback(async () => {
        try {
            const { data } = await axios.get(`/posts/${id}`);
            setPost(data);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }, [id]);

    // получаем комментариев
    const fetchComments = useCallback(async () => {
        try {
            dispatch(getPostComments(id));
        } catch (error) {
            console.log(error);
        }
    }, [id, dispatch]);

    // выводим пост
    useEffect(() => {
        fetchPost();
    }, [fetchPost]);

    // выводим коментарии
    useEffect(() => {
        fetchComments();
    }, [fetchComments]);


    if (isLoading) {
        return <Loading isLoading={true} />
    }
    var date1 = new Date(post.dateEnd);
    var date2 = new Date();
    return (
        <div className={s.full_post}>
            {/* мероприяте*/}
            <h3 className={s.title_full_post}>{post.title}</h3>
            <div className={s.blocks}>
                <div className={s.block_type_and_back}>
                    <div className={s.block_back}>
                        <AiOutlineRollback className={s.icon} />
                        <Link className={s.back_link} to={'/'}>Назад</Link>
                    </div>
                    <p className={s.type}>{post.type}</p>
                </div>
                <div className={s.text_block}>{post.text}</div>
                <div className={post.imgUrl ? s.block_img : s.block_img_none}>
                    {post.imgUrl && (
                        <img className={s.image} src={`${process.env.REACT_APP_API_URL}/${post.imgUrl}`} alt="" ></img>)}
                </div>
                <div className={s.block_author_and_date}>
                    <div className={s.block_author}>
                        <p className={s.author_title}>Автор статьи: </p>
                        <p>{post.author.fullName}</p> 
                    </div>
                    <div className={s.block_date}>
                        <p>Опубликовано: <Moment date={post.createdAt} format='DD/MM/YYYY' /></p>
                        <div>
                            {date1.toLocaleDateString().split('.').reverse() > date2.toLocaleDateString().split('.').reverse() && <p className={s.date_green}>Актуально до: <Moment date={post.dateEnd} format='DD/MM/YYYY' /></p>}
                            {date1.toLocaleDateString() === date2.toLocaleDateString() && <p className={s.date_yellow}>Актуально до: <Moment date={post.dateEnd} format='DD/MM/YYYY' /></p>}
                            {date1.toLocaleDateString().split('.').reverse() < date2.toLocaleDateString().split('.').reverse() && <p className={s.date_red}>Не актуально: <Moment date={post.dateEnd} format='DD/MM/YYYY' /></p>}
                        </div>
                    </div>
                </div>
                <div className={s.block_c_v_link_date}>
                    <div className={s.block_link}>
                        <p className={s.link_title}>Ссылка на исчточник:</p>
                        <Link className={s.link} to={post.addressUrl} target="_blank">
                            {post.addressUrl}
                        </Link>
                    </div>
                    <div className={s.block_comments_and_views}>
                        <button className={s.btn_views}><AiFillEye className="icon" /><span>{post.viewsCount}</span></button>
                        <button className={s.btn_comments}><AiOutlineMessage className="icon" /><span>{comments?.length || 0}</span></button>
                    </div>
                </div>
                <div className={s.block_btns}>
                    {user?._id === post.author._id && (
                        <>
                            <Link className={s.btn_update} to={`/edit-post/${id}`}> 
                                <AiTwotoneEdit /> Обновить
                            </Link>
                            <button className={s.btn_delete} onClick={removePostHandler}>
                                <AiFillDelete className={s.icon} />
                                Удалить
                            </button>
                        </>
                    )}
                </div>
            </div>
            {/* комментарии */}
            <h3 className={s2.title_full_comment}>комментарии</h3>
            {!isAuth ? 
                <p className={s2.auth}>Коментарии могут оставлять только авторизированные пользователи.</p> : ""}
            <form className={s2.comment_enter_and_btn} onSubmit={(e) => e.preventDefault()}>
                <textarea className={s2.comment_enter} type='text' 
                    required minLength="1"
                    disabled={!isAuth}
                    placeholder='Введите сообщение...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                {comment && 
                <div className={s2.btn}>
                    <button className={s2.comment_btn} disabled={!isAuth} onClick={handleSubmit}>
                        Отправить
                    </button>
                </div>}
            </form> 
            <div className={s2.comment}>
                {comments.length !== 0
                ? comments?.map((comment) => (
                    <ItemsComment key={comment._id} comment={comment} />
                ))
                : <p className="nothing">Комментариев нет.</p> 
            }
            </div>
        </div>
    );
}

export default FullPost;