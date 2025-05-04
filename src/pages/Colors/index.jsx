import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Colors = () => {
    const navigate = useNavigate();
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedColorId, setSelectedColorId] = useState(null);
    const [colorData, setColorData] = useState({
        color_en: '',
        color_ru: '',
        color_de: ''
    });

    useEffect(() => {
        fetchColors();
    }, []);

    const fetchColors = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const response = await axios.get('https://back.ifly.com.uz/api/colors', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setColors(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch colors');
            if (error.response?.status === 401) navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        navigate('/login');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setColorData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setColorData({ color_en: '', color_ru: '', color_de: '' });
        setShowAddModal(true);
    };

    const handleAddColor = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const response = await axios.post('https://back.ifly.com.uz/api/colors', colorData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setColors([...colors, response.data.data]);
            toast.success('Color added successfully');
            setShowAddModal(false);
        } catch (error) {
            toast.error('Failed to add color');
        }
    };

    const confirmDelete = (id) => {
        setSelectedColorId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            await axios.delete(`https://back.ifly.com.uz/api/colors/${selectedColorId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setColors(colors.filter(c => c.id !== selectedColorId));
            toast.success('Color deleted successfully');
        } catch (error) {
            toast.error('Failed to delete color');
        } finally {
            setShowDeleteModal(false);
            setSelectedColorId(null);
        }
    };

    const handleEdit = (id) => {
        const selected = colors.find(c => c.id === id);
        if (selected) {
            setColorData({
                color_en: selected.color_en,
                color_ru: selected.color_ru,
                color_de: selected.color_de
            });
            setSelectedColorId(id);
            setShowEditModal(true);
        }
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            await axios.patch(`https://back.ifly.com.uz/api/colors/${selectedColorId}`, colorData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setColors(colors.map(c =>
                c.id === selectedColorId ? { ...c, ...colorData } : c
            ));
            toast.success('Color updated successfully');
        } catch (error) {
            toast.error('Failed to update color');
        } finally {
            setShowEditModal(false);
            setSelectedColorId(null);
        }
    };

    const closeModal = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setSelectedColorId(null);
    };

    if (loading) {
        return <div className="text-center p-8 text-xl font-semibold">Loading...</div>;
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
                        <h2 className="text-xl font-bold mb-4">Colors</h2>
                        <button
                            onClick={openAddModal}
                            className="cursor-pointer mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            Add Color
                        </button>
                    </div>

                    {colors.length === 0 ? (
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
                                    <th className="border border-gray-300 p-2">Color EN</th>
                                    <th className="border border-gray-300 p-2">Color RU</th>
                                    <th className="border border-gray-300 p-2">Color DE</th>
                                    <th className="border border-gray-300 p-2 w-[170px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {colors.map((color, index) => (
                                    <tr key={color.id} className="text-center hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{color.color_en}</td>
                                        <td className="border border-gray-300 p-2">{color.color_ru}</td>
                                        <td className="border border-gray-300 p-2">{color.color_de}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => handleEdit(color.id)}
                                                className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(color.id)}
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
                <Modal title="Delete Color" onClose={closeModal}>
                    <p>Are you sure you want to delete this color?</p>
                    <div className="flex justify-between mt-4">
                        <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                        <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
                    </div>
                </Modal>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <ColorFormModal
                    title="Edit Color"
                    onClose={closeModal}
                    onSave={handleSaveEdit}
                    colorData={colorData}
                    handleChange={handleChange}
                />
            )}

            {/* Add Modal */}
            {showAddModal && (
                <ColorFormModal
                    title="Add Color"
                    onClose={closeModal}
                    onSave={handleAddColor}
                    colorData={colorData}
                    handleChange={handleChange}
                />
            )}

            <ToastContainer />
        </div>
    );
};

// Reusable modal layout
const Modal = ({ title, onClose, children }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] rounded-full">X</button>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            {children}
        </div>
    </div>
);

// Reusable form modal for Add/Edit
const ColorFormModal = ({ title, onClose, onSave, colorData, handleChange }) => (
    <Modal title={title} onClose={onClose}>
        {['color_en', 'color_ru', 'color_de'].map((field) => (
            <div key={field} className="mb-4">
                <label className="block mb-2 capitalize">{field.replace('_', ' ')}</label>
                <input
                    type="text"
                    name={field}
                    value={colorData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
            </div>
        ))}
        <div className="flex justify-between mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
            <button onClick={onSave} className="px-4 py-2 bg-green-500 text-white rounded-lg">Save</button>
        </div>
    </Modal>
);

export default Colors;
