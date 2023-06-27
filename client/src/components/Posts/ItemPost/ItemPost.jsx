import React from 'react';
import {AiFillEye, AiOutlineMessage} from 'react-icons/ai';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';

const ItemPost = ({ post }) => {
    var date1 = new Date(post.dateEnd);
    var date2 = new Date(); 
    return (
        <div className="post">
            <Link to={`/post/${post._id}`}  className="link">
                <div className='image_info'>
                    <div className={post.imgUrl && 'image-block'}>
                        {post.imgUrl && (
                            <img className='image' src={`https://events-mern-server-h337jz25i-razinandrey.vercel.app/${post.imgUrl}`} alt="" ></img>
                        )}
                    </div>
                    <div className='info'>
                        <div className="title_type">
                            <p className='title_post'>{post.title}</p>
                            <p className='type_post'>{post.type}</p>
                        </div>
                        <div className='dates'>
                            <div className='date-published'> 
                                <p>Опубликованно: <Moment date={post.createdAt} format='DD/MM/YYYY'/></p>
                            </div> 
                            <div className='date-actual'>
                                {date1.toLocaleDateString().split('.').reverse() > date2.toLocaleDateString().split('.').reverse() && <p className='date_green'>Актуально до: <Moment date={post.dateEnd} format='DD/MM/YYYY'/></p>}   
                                {date1.toLocaleDateString() ===  date2.toLocaleDateString() &&  <p className='date_yellow'>Актуально до: <Moment date={post.dateEnd} format='DD/MM/YYYY'/></p>}
                                {date1.toLocaleDateString().split('.').reverse() <  date2.toLocaleDateString().split('.').reverse() && <p className='date_red'>Не актуально: <Moment date={post.dateEnd} format='DD/MM/YYYY'/></p>}
                            </div>
                        </div>
                        <div className='btns_author'>
                            <div className='btns'>
                                <button className='btn'><AiFillEye className="icon"/><span>{post.viewsCount}</span></button>
                                <button className='btn'><AiOutlineMessage className="icon"/><span>{post.comments?.length || 0}</span></button>
                            </div>
                            <p className='author'>{post.fullName}</p> 
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default ItemPost;
