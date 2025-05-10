import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ...importlar (o'zgarmagan)

const Category = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ name_en: '', name_ru: '', name_de: '' });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name_en: '', name_ru: '', name_de: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('https://testaoron.limsa.uz/api/category');
            setCategories(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
        window.location.reload(); // sahifani to‘liq yangilaydi
    };
    

    const confirmDelete = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return toast.error('No token found. Please login again.');

            await axios.delete(`https://testaoron.limsa.uz/api/category/${selectedCategoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Category deleted successfully');
            fetchCategories();
        } catch {
            toast.error('Failed to delete category');
        } finally {
            setShowDeleteModal(false);
            setSelectedCategoryId(null);
        }
    };

    const openEditModal = (category) => {
        setSelectedCategoryId(category.id);
        setEditData({ name_en: category.name_en, name_ru: category.name_ru, name_de: category.name_de });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return toast.error('No token found. Please login again.');

            await axios.patch(`https://testaoron.limsa.uz/api/category/${selectedCategoryId}`, editData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Category updated successfully');
            fetchCategories();
        } catch {
            toast.error('Failed to update category');
        } finally {
            setShowEditModal(false);
            setSelectedCategoryId(null);
        }
    };

    // 🔽 ADD CATEGORY handlers
    const openAddModal = () => {
        setNewCategory({ name_en: '', name_ru: '', name_de: '' });
        setShowAddModal(true);
    };

    const handleAddChange = (e) => {
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return toast.error('No token found. Please login again.');

            await axios.post(`https://testaoron.limsa.uz/api/category`, newCategory, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Category added successfully');
            fetchCategories();
        } catch {
            toast.error('Failed to add category');
        } finally {
            setShowAddModal(false);
        }
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedCategoryId(null);
    };

    if (loading) return <div className="text-center p-8 text-xl font-semibold">Loading...</div>;

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col p-6 items-center">
                <div className="w-full flex justify-end">
                    <button onClick={handleLogout} className="cursor-pointer mb-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Log Out
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[1050px] ml-[250px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold mb-4">Category</h2>
                        <button onClick={openAddModal} className="cursor-pointer mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            Add Category
                        </button>
                    </div>

                    {categories.length === 0 ? (
                        <div className="text-center py-6">
                            <img src="https://aoron.nippon.com.uz/assets/noData-DPgWaiIB.png" alt="No data" className="mx-auto w-20" />
                            <p className="text-gray-500 mt-2">No Data Available</p>
                        </div>
                    ) : (
                        <table className="min-w-full table-auto border-collapse mt-4">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2">№</th>
                                    <th className="border border-gray-300 p-2">Title (ENG)</th>
                                    <th className="border border-gray-300 p-2">Title (RU)</th>
                                    <th className="border border-gray-300 p-2">Title (DE)</th>
                                    <th className="border border-gray-300 p-2 w-[170px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category, index) => (
                                    <tr key={category.id} className="text-center hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{category.name_en}</td>
                                        <td className="border border-gray-300 p-2">{category.name_ru}</td>
                                        <td className="border border-gray-300 p-2">{category.name_de}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button onClick={() => openEditModal(category)} className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                                                Edit
                                            </button>
                                            <button onClick={() => confirmDelete(category.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
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
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full">X</button>
                        <h3 className="text-xl font-bold mb-4">Are you sure you want to delete this category?</h3>
                        <div className="flex justify-between">
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">Yes, Delete</button>
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => setShowEditModal(false)} className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full">X</button>
                        <h3 className="text-xl font-bold mb-4">Update Category</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }}>
                            {/* Form fields same as add modal */}
                            {['name_en', 'name_ru', 'name_de'].map((lang, idx) => (
                                <div key={lang}>
                                    <label className="block mt-2 mb-1 text-sm font-medium">Category Name ({lang.split('_')[1].toUpperCase()})</label>
                                    <input
                                        type="text"
                                        name={lang}
                                        value={editData[lang]}
                                        onChange={handleEditChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                        placeholder={`${lang.toUpperCase()} name`}
                                        maxLength={80}
                                    />
                                </div>
                            ))}
                            <button type="submit" className="w-full mt-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Update Category</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={() => setShowAddModal(false)} className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full">X</button>
                        <h3 className="text-xl font-bold mb-4">Add New Category</h3>
                        <form onSubmit={handleAddSubmit}>
                            {['name_en', 'name_ru', 'name_de'].map((lang) => (
                                <div key={lang}>
                                    <label className="block mt-2 mb-1 text-sm font-medium">Category Name ({lang.split('_')[1].toUpperCase()})</label>
                                    <input
                                        type="text"
                                        name={lang}
                                        value={newCategory[lang]}
                                        onChange={handleAddChange}
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                        placeholder={`${lang.toUpperCase()} name`}
                                        maxLength={80}
                                    />
                                </div>
                            ))}
                            <button type="submit" className="w-full mt-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">Create Category</button>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Category;

