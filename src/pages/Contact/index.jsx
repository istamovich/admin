import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editData, setEditData] = useState({
        phone_number: '',
        email: '',
        address_en: '',
        address_ru: '',
        address_de: '',
    });
    const [newContact, setNewContact] = useState({
        phone_number: '',
        email: '',
        address_en: '',
        address_ru: '',
        address_de: '',
    });

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            const response = await axios.get('https://testaoron.limsa.uz/api/contact', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch contacts');
            if (error.response?.status === 401) navigate('/login');
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
        setSelectedContactId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            await axios.delete(`https://testaoron.limsa.uz/api/contact/${selectedContactId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(contacts.filter(contact => contact.id !== selectedContactId));
            toast.success('Contact deleted successfully');
        } catch (error) {
            toast.error('Failed to delete contact');
        } finally {
            setShowDeleteModal(false);
            setSelectedContactId(null);
        }
    };

    const openEditModal = (contact) => {
        setSelectedContactId(contact.id);
        setEditData({
            phone_number: contact.phone_number,
            email: contact.email,
            address_en: contact.address_en,
            address_ru: contact.address_ru,
            address_de: contact.address_de,
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            await axios.patch(`https://testaoron.limsa.uz/api/contact/${selectedContactId}`, editData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Contact updated successfully');
            fetchContacts();
            setShowEditModal(false);
        } catch (error) {
            toast.error('Failed to update contact');
        }
    };

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setNewContact((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            await axios.post(`https://testaoron.limsa.uz/api/contact`, newContact, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Contact added successfully');
            fetchContacts();
            setShowAddModal(false);
            setNewContact({
                phone_number: '',
                email: '',
                address_en: '',
                address_ru: '',
                address_de: '',
            });
        } catch (error) {
            toast.error('Failed to add contact');
        }
    };

    const closeModal = () => setShowDeleteModal(false);
    const closeEditModal = () => setShowEditModal(false);
    const closeAddModal = () => setShowAddModal(false);

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
                        className="mb-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Log Out
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[1050px] ml-[250px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold mb-4">Contacts</h2>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            Add Contact
                        </button>
                    </div>

                    {contacts.length === 0 ? (
                        <div className="text-center py-6">
                            <img src="https://aoron.nippon.com.uz/assets/noData-DPgWaiIB.png" alt="No data" className="mx-auto w-20" />
                            <p className="text-gray-500 mt-2">No Data Available</p>
                        </div>
                    ) : (
                        <table className="min-w-full table-auto border-collapse mt-4">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 p-2">№</th>
                                    <th className="border border-gray-300 p-2">Phone</th>
                                    <th className="border border-gray-300 p-2">Email</th>
                                    <th className="border border-gray-300 p-2">Address (EN)</th>
                                    <th className="border border-gray-300 p-2 w-[170px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact, index) => (
                                    <tr key={contact.id} className="text-center hover:bg-gray-100">
                                        <td className="border border-gray-300 p-2">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{contact.phone_number}</td>
                                        <td className="border border-gray-300 p-2">{contact.email}</td>
                                        <td className="border border-gray-300 p-2">{contact.address_en}</td>
                                        <td className="border border-gray-300 p-2">
                                            <button
                                                onClick={() => openEditModal(contact)}
                                                className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(contact.id)}
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
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full">
                        <button onClick={closeModal} className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] rounded-full">X</button>
                        <h3 className="text-xl font-bold mb-4">Delete Contact</h3>
                        <p>Are you sure you want to delete this contact?</p>
                        <div className="flex justify-between mt-4">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full">
                        <button onClick={closeEditModal} className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] rounded-full">X</button>
                        <h3 className="text-xl font-bold mb-4">Edit Contact</h3>
                        <div className="space-y-4">
                            {Object.keys(editData).map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{field.replace('_', ' ')}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={editData[field]}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end gap-4 pt-4">
                                <button onClick={closeEditModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                                <button onClick={handleEditSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full">
                        <button onClick={closeAddModal} className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] rounded-full">X</button>
                        <h3 className="text-xl font-bold mb-4">Add New Contact</h3>
                        <div className="space-y-4">
                            {Object.keys(newContact).map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium mb-1 capitalize">{field.replace('_', ' ')}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={newContact[field]}
                                        onChange={handleAddChange}
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end gap-4 pt-4">
                                <button onClick={closeAddModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
                                <button onClick={handleAddSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Contact;
