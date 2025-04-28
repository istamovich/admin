import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sizes = () => {
    const navigate = useNavigate();
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSizeId, setSelectedSizeId] = useState(null);

    useEffect(() => {
        fetchSizes();
    }, []);

    const fetchSizes = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            if (!token) {
                navigate('/login'); // Redirect to login if no token found
                return;
            }

            const response = await axios.get('https://back.ifly.com.uz/api/sizes', {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            });
            setSizes(response.data.data); // Assign the fetched sizes to state
        } catch (error) {
            console.error('Error fetching sizes:', error);
            toast.error('Failed to fetch sizes');
            if (error.response && error.response.status === 401) {
                // Handle unauthorized errors (e.g., token expired)
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
    };

    const confirmDelete = (id) => {
        setSelectedSizeId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect to login if no token found
                return;
            }

            await axios.delete(`https://back.ifly.com.uz/api/sizes/${selectedSizeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            });

            // Remove the deleted size from the state
            setSizes(sizes.filter((size) => size.id !== selectedSizeId));
            toast.success('Size deleted successfully');
        } catch (error) {
            console.error('Error deleting size:', error);
            toast.error('Failed to delete size');
        } finally {
            setShowDeleteModal(false);
            setSelectedSizeId(null);
        }
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedSizeId(null);
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
                        <h2 className="text-xl font-bold mb-4">Sizes</h2>
                        <button className="cursor-pointer mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            Add Sizes
                        </button>
                    </div>

                    {sizes.length === 0 ? (
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
                                            <button className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(size.id)}
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

            {/* Confirmation modal */}
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
                            <h3 className="text-xl font-bold mb-4">Delete Size</h3>
                            <p>Are you sure you want to delete this size?</p>
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

export default Sizes;
