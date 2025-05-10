import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// imports yuqorida siz yozganidek qoladi...

const Sizes = () => {
    const navigate = useNavigate();
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSizeId, setSelectedSizeId] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editSizeData, setEditSizeData] = useState({ size: '' });

    const [addModal, setAddModal] = useState(false);
    const [newSizeData, setNewSizeData] = useState({ size: '' });

    useEffect(() => {
        fetchSizes();
    }, []);

    const fetchSizes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const response = await axios.get('https://testaoron.limsa.uz/api/sizes', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSizes(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch sizes');
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                navigate('/login');
            }
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
    

    const confirmDelete = (id) => {
        setSelectedSizeId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://testaoron.limsa.uz/api/sizes/${selectedSizeId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSizes(sizes.filter((size) => size.id !== selectedSizeId));
            toast.success('Size deleted successfully');
        } catch {
            toast.error('Failed to delete size');
        } finally {
            setShowDeleteModal(false);
            setSelectedSizeId(null);
        }
    };

    const openEditModal = (size) => {
        setSelectedSizeId(size.id);
        setEditSizeData({ size: size.size });
        setEditModal(true);
    };

    const handleEditChange = (e) => {
        setEditSizeData({ ...editSizeData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`https://testaoron.limsa.uz/api/sizes/${selectedSizeId}`, editSizeData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Size updated successfully');
            setEditModal(false);
            fetchSizes();
        } catch {
            toast.error('Failed to update size');
        }
    };

    const handleAddChange = (e) => {
        setNewSizeData({ ...newSizeData, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`https://testaoron.limsa.uz/api/sizes`, newSizeData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Size added successfully');
            setAddModal(false);
            setNewSizeData({ size: '' });
            fetchSizes();
        } catch {
            toast.error('Failed to add size');
        }
    };

    if (loading) return <div className="text-center p-8 text-xl font-semibold">Loading...</div>;

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col p-6 items-center">
                <div className="w-full flex justify-end">
                    <button onClick={handleLogout} className="mb-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Log Out
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[1050px] ml-[250px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold mb-4">Sizes</h2>
                        <button onClick={() => setAddModal(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            Add Sizes
                        </button>
                    </div>

                    {sizes.length === 0 ? (
                        <div className="text-center py-6">
                            <img src="https://aoron.nippon.com.uz/assets/noData-DPgWaiIB.png" alt="No data" className="mx-auto w-20" />
                            <p className="text-gray-500 mt-2">No Data Available</p>
                        </div>
                    ) : (
                        <table className="min-w-full table-auto border-collapse mt-4">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2">№</th>
                                    <th className="border border-gray-300 p-2">Size</th>
                                    <th className="border border-gray-300 p-2 w-[170px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sizes.map((size, index) => (
                                    <tr key={size.id} className="text-center hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{size.size}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button onClick={() => openEditModal(size)} className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                                                Edit
                                            </button>
                                            <button onClick={() => confirmDelete(size.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
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
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                        <button onClick={() => setShowDeleteModal(false)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">X</button>
                        <h3 className="text-xl font-bold mb-4">Delete Size</h3>
                        <p>Are you sure you want to delete this size?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                        <button onClick={() => setEditModal(false)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">X</button>
                        <h3 className="text-xl font-bold mb-4">Edit Size</h3>
                        <form onSubmit={handleEditSubmit}>
                            <input
                                type="text"
                                name="size"
                                value={editSizeData.size}
                                onChange={handleEditChange}
                                placeholder="Size"
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                required
                            />
                            <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-lg">Update Size</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {addModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
                        <button onClick={() => setAddModal(false)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full">X</button>
                        <h3 className="text-xl font-bold mb-4">Add Size</h3>
                        <form onSubmit={handleAddSubmit}>
                            <input
                                type="text"
                                name="size"
                                value={newSizeData.size}
                                onChange={handleAddChange}
                                placeholder="Size"
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                required
                            />
                            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">Add Size</button>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Sizes;

