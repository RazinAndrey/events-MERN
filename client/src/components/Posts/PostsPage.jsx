import React, { useEffect, useState} from "react";
import { useDispatch,  useSelector } from "react-redux";
import { getAllPosts } from "../../redux/slices/posts-slice";
import Loading from '../common/Loading/Loading';
import './PostsPage.css';
import PostItem from './ItemPost/ItemPost';
import DatePicker from "react-datepicker";
import ru from 'date-fns/locale/ru';

const Posts = () => {
    // делаем запрос на сервер
    const dispatch = useDispatch();
    // получение постов
    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch]);

    // вытаскиваем данные из хранилища
    const { posts, loading } = useSelector(state => state.posts);
    const isLoading = loading === true;

    const [newPosts, setNewPosts] = useState([]);

    const [date, setDate]= useState('');
    const [search, setSearch] = useState('');
    const [active, setActive] = useState('Все');
    
    const typeFilter = (type) => {
        if(type === 'Все') {
            setNewPosts(posts);
            setDate('');
            setSearch('');
        } else {
            let filterByType = [...posts].filter((item) => item.type === type);
            setNewPosts(filterByType);
            setDate('');
            setSearch('');
        }
        setActive(type);
    }
    
    const dateFilter = (date) =>{
        let filterByDate = [...posts].filter((item)=>{
        let createdDate = new Date(item["createdAt"]);
            return(
                createdDate.toLocaleDateString() === date.toLocaleDateString()
            );
        });
        setNewPosts(filterByDate);
        setDate(date);
        setActive('');
    };

    const searchFilter = (search) =>{
        let searchValue = search.target.value;
        let filterTitle = [...posts].filter((item) => {
            return item.title.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1;
        });
        setNewPosts(filterTitle);
        if(searchValue === ''){
            setNewPosts(posts);
            setActive('Все');
            setDate('');
        }
        if(searchValue){
            setActive('');
            setDate('');
        }
        setSearch(searchValue);
    };

    useEffect(() => {
        setNewPosts(posts);
    }, [posts]);

    return (
        <div className="posts">
            <h3 className="title">Мероприятия</h3>
            <div className="search_container">
                <div>
                    <div>
                        <p className="search_title">Поиск по заголовку:</p>
                        <input className="search-input"  type="text"
                            onChange={searchFilter}
                            value={search}
                            placeholder="Поиск"
                        />
                    </div>
                </div>   
                <div>
                    <p className="search_title">Выбор по дате:</p>
                    <DatePicker
                        className="search-input"
                        selected={date} 
                        onChange={dateFilter}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="MM/DD/YYYY"
                        locale={ru}
                        closeOnScroll={true}
                        onKeyDown={(e) => {
                            e.preventDefault();
                        }}
                    />
                </div>
            </div>
            <div>
                    <p className="search_title">Выбор по типу:</p>
                    <div className="search_btns">
                        <button className={active === 'Все' ? 'active' : ''}  onClick={() => typeFilter('Все')}>Все</button>
                        <button className={active === 'Вузовская' ? 'active' : ''} onClick={() => typeFilter('Вузовская')}>Вузовская</button>
                        <button className={active === 'Региональная' ? 'active' : ''}  onClick={() => typeFilter('Региональная')}>Региональная</button>
                        <button className={active === 'Всероссийская' ? 'active' : ''}  onClick={() => typeFilter('Всероссийская')}>Всероссийская</button>
                        <button className={active === 'Международная' ? 'active' : ''}  onClick={() => typeFilter('Международная')}>Международная</button>
                    </div>
                </div>
            {posts.length === 0 &&  isLoading && <Loading />}
            {!isLoading && posts.length !== 0 && newPosts.length !== 0
                ? newPosts?.map((item, id) => (
                    <PostItem key={id} post={item} />
                ))
                : <p className="nothing">Мероприятий нет <span>&#9785;</span></p> 
            }
        </div>
    );
}

export default Posts;