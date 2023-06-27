import React, { useState, useEffect } from 'react';
import s from './MyPostsPage.module.css';
import axios from '../../api/api';
import PostItem from '../Posts/ItemPost/ItemPost';
import Loading from '../common/Loading/Loading';

const MyPosts = () => {
    const [isLoading, setLoading] = useState(true);

    const [newPosts, setPosts] = useState([]);
    const fetchMyPosts = async () => {
        try {
            const { data } = await axios.get('/my-posts');
            setPosts(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        fetchMyPosts();
    }, []);

    return (
    <div className={s.my_posts}>
        <h3 className="title">Мои мероприятия</h3>
        {newPosts.length === 0 && isLoading && <Loading />}
        {!isLoading && newPosts.length !== 0 
                ? newPosts?.map((item, id) => (
                    <PostItem key={id} post={item} />
                ))
                : <p className="nothing">Мероприятий нет <span>&#9785;</span></p> 
        }
        <p className={s.length}>Количество мероприятий: <span>{newPosts.length}</span></p>
    </div>
    )
}

export default MyPosts;
