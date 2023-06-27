import React from 'react';
import s from './ItemsComment.module.css';
import Moment from 'react-moment';
import { AiFillDelete } from 'react-icons/ai';
import { removeComment } from '../../redux/slices/comments-slice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const ItemsComment = ({ comment }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const handleRemoveComment = () => {
        try {
            if (window.confirm("Вы действительно хотите удалить комментарий?")) {
                dispatch(removeComment(comment._id));
                toast.info('Комментарий был удалён.', {
                    position: toast.POSITION.BOTTOM_LEFT
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className={s.comment}>
            {
                !comment
                    ? <p>Коментарий удалён</p>
                    : <>
                        {/* <Link to={`/user/${comment.author._id}`}>
                        <div className={s.comment_author}>{comment.author.fullName}</div>
                    </Link> */}
                        {comment.author.fullName
                            ? <Link to={`/user/${comment.author._id}`}>
                                <div className={s.comment_author}>
                                    {user?._id === comment?.author._id ? <p>{user?.fullName}</p> : comment.author.fullName}
                                </div>

                            </Link>
                            : <Link to={`/user/${user._id}`}>
                                <div className={s.comment_author}>
                                    {user?.fullName}
                                </div>
                            </Link>
                        }
                        <div className={s.comment_text}>{comment.comment}</div>
                        <div className={s.date_and_delete_block}>
                            <Moment date={comment.createdAt} format='HH:mm - DD/MM/YYYY' />
                            {user?._id === comment?.author._id && user?._id &&(
                                <button className={s.btn_delete} onClick={handleRemoveComment}>
                                    <AiFillDelete className={s.delete} />
                                </button>
                            )}
                            {!comment?.author._id &&(
                                <button className={s.btn_delete} onClick={handleRemoveComment}>
                                    <AiFillDelete className={s.delete} />
                                </button>
                            )}
                        </div>
                    </>
            }
        </div>
    );
}

export default ItemsComment;
