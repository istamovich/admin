import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Discount = () => {
    const navigate = useNavigate();
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDiscountId, setSelectedDiscountId] = useState(null);

    // Edit modal
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({
        discount: '',
        started_at: '',
        finished_at: '',
        status: true,
    });

    // Add modal
    const [addModal, setAddModal] = useState(false);
    const [newDiscount, setNewDiscount] = useState({
        discount: '',
        started_at: '',
        finished_at: '',
        status: true,
    });

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const fetchDiscounts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('https://testaoron.limsa.uz/api/discount', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDiscounts(response.data.data);
        } catch (error) {
            console.error('Error fetching discounts:', error);
            toast.error('Failed to fetch discounts');
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
        navigate('/login');
    };

    const confirmDelete = (id) => {
        setSelectedDiscountId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://testaoron.limsa.uz/api/discount/${selectedDiscountId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDiscounts(discounts.filter((discount) => discount.id !== selectedDiscountId));
            toast.success('Discount deleted successfully');
        } catch (error) {
            console.error('Error deleting discount:', error);
            toast.error('Failed to delete discount');
        } finally {
            setShowDeleteModal(false);
            setSelectedDiscountId(null);
        }
    };

    const openEditModal = (discount) => {
        setEditData(discount);
        setEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'discount' ? Number(value) : value,
        }));
    };

    const handleEditSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`https://testaoron.limsa.uz/api/discount/${editData.id}`, editData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Discount updated successfully');
            fetchDiscounts();
            setEditModal(false);
        } catch (error) {
            console.error('Error updating discount:', error);
            toast.error('Failed to update discount');
        }
    };

    const handleAddChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewDiscount((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'discount' ? Number(value) : value,
        }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://testaoron.limsa.uz/api/discount', newDiscount, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Discount added successfully');
            fetchDiscounts();
            setAddModal(false);
            setNewDiscount({ discount: '', started_at: '', finished_at: '', status: true });
        } catch (error) {
            console.error('Error adding discount:', error);
            toast.error('Failed to add discount');
        }
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedDiscountId(null);
    };

    if (loading) return <div className="text-center p-8 text-xl font-semibold">Loading...</div>;

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 flex flex-col p-6 items-center">
                <div className="w-full flex justify-end">
                    <button onClick={handleLogout} className="mb-6 px-4 py-2 bg-red-600 text-white rounded-lg">
                        Log Out
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[1050px] ml-[250px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold mb-4">Discount</h2>
                        <button onClick={() => setAddModal(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg">Add Discount</button>
                    </div>

                    {discounts.length === 0 ? (
                        <div className="text-center py-6">
                            <img src="https://aoron.nippon.com.uz/assets/noData-DPgWaiIB.png" alt="No data" className="mx-auto w-20" />
                            <p className="text-gray-500 mt-2">No Data Available</p>
                        </div>
                    ) : (
                        <table className="min-w-full table-auto border-collapse mt-4">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border p-2">№</th>
                                    <th className="border p-2">Discount (%)</th>
                                    <th className="border p-2">Start Date</th>
                                    <th className="border p-2">End Date</th>
                                    <th className="border p-2">Status</th>
                                    <th className="border p-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discounts.map((discount, index) => (
                                    <tr key={discount.id} className="text-center hover:bg-gray-100">
                                        <td className="border p-2">{index + 1}</td>
                                        <td className="border p-2">{discount.discount}</td>
                                        <td className="border p-2">{discount.started_at}</td>
                                        <td className="border p-2">{discount.finished_at}</td>
                                        <td className="border p-2">
                                            <span className={`px-3 py-1 rounded-full text-white ${discount.status ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {discount.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="border p-2">
                                            <button onClick={() => openEditModal(discount)} className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg">Edit</button>
                                            <button onClick={() => confirmDelete(discount.id)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
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
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                        <h3 className="text-xl font-bold mb-4">Delete Discount</h3>
                        <p>Are you sure you want to delete this discount?</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setEditModal(false)}
                            className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full"
                        >
                            X
                        </button>
                        <h3 className="text-xl font-bold mb-4">Edit Discount</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleEditSubmit(); }}>
                            <input
                                type="number"
                                name="discount"
                                placeholder="Discount (%)"
                                value={editData.discount}
                                onChange={handleEditChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="date"
                                name="started_at"
                                value={editData.started_at}
                                onChange={handleEditChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="date"
                                name="finished_at"
                                value={editData.finished_at}
                                onChange={handleEditChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <label className="block mb-2">
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={editData.status}
                                    onChange={handleEditChange}
                                    className="mr-2"
                                />
                                Active
                            </label>
                            <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-lg">Update Discount</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {addModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setAddModal(false)}
                            className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full"
                        >
                            X
                        </button>
                        <h3 className="text-xl font-bold mb-4">Add Discount</h3>
                        <form onSubmit={handleAddSubmit}>
                            <input
                                type="number"
                                name="discount"
                                placeholder="Discount (%)"
                                value={newDiscount.discount}
                                onChange={handleAddChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="date"
                                name="started_at"
                                value={newDiscount.started_at}
                                onChange={handleAddChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <input
                                type="date"
                                name="finished_at"
                                value={newDiscount.finished_at}
                                onChange={handleAddChange}
                                className="w-full p-2 border rounded mb-2"
                            />
                            <label className="block mb-2">
                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={newDiscount.status}
                                    onChange={handleAddChange}
                                    className="mr-2"
                                />
                                Active
                            </label>
                            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-lg">Add Discount</button>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Discount;
