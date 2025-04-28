import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const News = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNewsId, setSelectedNewsId] = useState(null);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await axios.get('https://back.ifly.com.uz/api/news');
            setNews(response.data.data);
        } catch (error) {
            console.error('Error fetching news:', error);
            toast.error('Failed to fetch news');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    const confirmDelete = (id) => {
        setSelectedNewsId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://back.ifly.com.uz/api/news/${selectedNewsId}`);
            setNews(prevNews => prevNews.filter(item => item.id !== selectedNewsId));
            toast.success('News deleted successfully');
        } catch (error) {
            console.error('Error deleting news:', error);
            toast.error('Failed to delete news');
        } finally {
            setShowDeleteModal(false);
            setSelectedNewsId(null);
        }
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedNewsId(null);
    };

    if (loading) {
        return (
            <div className="text-center p-8 text-xl font-semibold">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col p-6 items-center">
                <div className="w-full flex justify-end">
                    <button
                        onClick={handleLogout}
                        className="cursor-pointer mb-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Log Out
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[1050px] ml-[250px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold mb-4">News</h2>
                        <button className="cursor-pointer mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            Add News
                        </button>
                    </div>

                    {news.length === 0 ? (
                        <div className="text-center py-6">
                            <img
                                src="https://aoron.nippon.com.uz/assets/noData-DPgWaiIB.png"
                                alt="No data"
                                className="mx-auto w-20"
                            />
                            <p className="text-gray-500 mt-2">No Data Available</p>
                        </div>
                    ) : (
                        <table className="min-w-full table-auto border-collapse mt-4">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2">№</th>
                                    <th className="border border-gray-300 p-2">Image</th>
                                    <th className="border border-gray-300 p-2">Title (EN)</th>
                                    <th className="border border-gray-300 p-2">Description (EN)</th>
                                    <th className="border border-gray-300 p-2 w-[170px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {news.map((item, index) => (
                                    <tr key={item.id} className="text-center hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">
                                            <img
                                                src={`https://back.ifly.com.uz/api/files/${item.image}`}
                                                alt={item.title_en}
                                                className="w-16 h-16 object-cover rounded-md mx-auto"
                                            />
                                        </td>
                                        <td className="border border-gray-300 p-2">{item.title_en}</td>
                                        <td className="border border-gray-300 p-2">{item.description_en}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(item.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button
                            onClick={closeModal}
                            className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full"
                        >
                            X
                        </button>
                        <div>
                            <h3 className="text-xl font-bold mb-4">Delete News</h3>
                            <p>Are you sure you want to delete this news item?</p>
                            <div className="flex justify-between mt-4">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 cursor-pointer bg-gray-500 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default News;
