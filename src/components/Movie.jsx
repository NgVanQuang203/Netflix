import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { UserAuth } from '../Context/AuthContext';
import { db } from '../firebase';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';

const Movie = ({ item }) => {
    const { user } = UserAuth();
    const [saved, setSaved] = useState(false);

    const movieID = doc(db, 'users', `${user?.email}`);

    const initialLike =
        JSON.parse(localStorage.getItem(`like-${item.id}`)) || false;
    const [like, setLike] = useState(initialLike);

    useEffect(() => {
        // Lưu trạng thái like vào localStorage mỗi khi like thay đổi
        localStorage.setItem(`like-${item.id}`, JSON.stringify(like));
    }, [like]);

    const saveShow = async () => {
        if (user?.email) {
            setLike(!like);
            setSaved(true);
            if (like) {
                await updateDoc(movieID, {
                    savedShows: arrayRemove({
                        id: item.id,
                        title: item.title,
                        img: item.backdrop_path,
                    }),
                });
            } else {
                await updateDoc(movieID, {
                    savedShows: arrayUnion({
                        id: item.id,
                        title: item.title,
                        img: item.backdrop_path,
                    }),
                });
            }
        } else {
            alert('Please log in to save a movie');
        }
    };

    return (
        <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2">
            <img
                className="w-full h-auto block"
                src={`https://image.tmdb.org/t/p/w500/${item?.backdrop_path}`}
                alt={item.title}
            />
            <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white">
                <p className="whitespace-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
                    {item?.title}
                </p>
                <p onClick={saveShow}>
                    {like ? (
                        <FaHeart className="absolute top-4 left-4 text-gray-300" />
                    ) : (
                        <FaRegHeart className="absolute top-4 left-4 text-gray-300" />
                    )}
                </p>
            </div>
        </div>
    );
};

export default Movie;
