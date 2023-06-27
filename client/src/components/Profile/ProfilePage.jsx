import React, { useCallback, useEffect, useState } from 'react';
import axios from '../../api/api';
import Loading from '../common/Loading/Loading';
import { useParams } from 'react-router-dom';
import s from './profile.module.css';

const ProfilePage = () => {
    // const { user } = useSelector((state) => state.auth);
    // // состояние профиля
    const [profile, setProfile] = useState(null);
    // // состояние загрузки
    const [isLoading, setLoading] = useState(true);
    const { id } = useParams();
    // получаем прифиль
    const fetchProfile = useCallback(async () => {
        try {
            const { data } = await axios.get(`/user/${id}`);
            setProfile(data);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }, [id]);
    // вывод профиля
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (isLoading) {
        return <Loading isLoading={true} />
    }
    return (
        <div className={s.profile}>
            <h1 className={s.title}>Профиль</h1>
            <div className={s.blocks}>
                <div className={s.block}>
                    <p className={s.qqq}>Имя:</p>
                    <p className={s.aaa}>{profile.fullName}</p>
                </div>
                <div className={s.block}>
                    <p className={s.qqq}>Email:</p>
                    <p className={s.aaa}>{profile.email}</p>
                </div>
                <div className={s.block}>
                    <p className={s.qqq}>Login:</p>
                    <p className={s.aaa}>{profile.login}</p>
                </div>
                <div className={s.block}>
                    <p className={s.qqq}>Роль:</p>
                    <p className={s.aaa}>{profile.roles[0]}</p>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
