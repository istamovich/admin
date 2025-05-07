import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Team = () => {
    const navigate = useNavigate();
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [formData, setFormData] = useState({
        file: '',
        full_name: '',
        position_de: '',
        position_ru: '',
        position_en: '',
    });

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const response = await axios.get('https://back.ifly.com.uz/api/team-section', {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTeamMembers(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch team members');
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

    const confirmDelete = (id) => {
        setSelectedTeamId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            await axios.delete(`https://back.ifly.com.uz/api/team-section/${selectedTeamId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setTeamMembers(teamMembers.filter(m => m.id !== selectedTeamId));
            toast.success('Team member deleted');
        } catch {
            toast.error('Failed to delete team member');
        } finally {
            setShowDeleteModal(false);
            setSelectedTeamId(null);
        }
    };

    const openAddModal = () => {
        setIsEditing(false);
        setFormData({
            file: '',
            full_name: '',
            position_de: '',
            position_ru: '',
            position_en: '',
        });
        setShowFormModal(true);
    };

    const openEditModal = (member) => {
        setIsEditing(true);
        setSelectedTeamId(member.id);
        setFormData({
            file: `https://back.ifly.com.uz/${member.image}`,
            full_name: member.full_name,
            position_de: member.position_de,
            position_ru: member.position_ru,
            position_en: member.position_en,
        });
        setShowFormModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setFormData(prev => ({ ...prev, file: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({
            ...prev,
            file: file,
        }));
    };


    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');

            const data = new FormData();
            data.append('file', formData.file);
            data.append('full_name', formData.full_name);
            data.append('position_en', formData.position_en);
            data.append('position_ru', formData.position_ru);
            data.append('position_de', formData.position_de);

            if (isEditing) {
                await axios.patch(
                    `https://back.ifly.com.uz/api/team-section/${selectedTeamId}`, // ✅ to‘g‘ri endpoint
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                toast.success('Team member updated');
            } else {
                await axios.post(
                    'https://back.ifly.com.uz/api/team-section',
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );
                toast.success('Team member added');
            }

            fetchTeam();
            setShowFormModal(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit form');
        }
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
                        className="mb-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Log Out
                    </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[1050px] ml-[250px]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold mb-4">Team Members</h2>
                        <button
                            onClick={openAddModal}
                            className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                            Add Team
                        </button>
                    </div>

                    {teamMembers.length === 0 ? (
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
                                    <th className="border p-2">№</th>
                                    <th className="border p-2">Image</th>
                                    <th className="border p-2">Full Name</th>
                                    <th className="border p-2">Position (EN)</th>
                                    <th className="border p-2 w-[170px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamMembers.map((member, index) => (
                                    <tr key={member.id} className="text-center hover:bg-gray-100">
                                        <td className="border p-2">{index + 1}</td>
                                        <td className="border p-2">
                                            <img
                                                src={`https://back.ifly.com.uz/${member.image}`}
                                                alt="Team"
                                                className="mx-auto w-[150px] h-[100px] object-cover"
                                            />
                                        </td>
                                        <td className="border p-2">{member.full_name}</td>
                                        <td className="border p-2">{member.position_en}</td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => openEditModal(member)}
                                                className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => confirmDelete(member.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
                    <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
                        <button
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-2 right-2 bg-red-500 text-white px-3 rounded-full"
                        >
                            X
                        </button>
                        <h3 className="text-xl font-bold mb-4">Delete Team Member</h3>
                        <p>Are you sure you want to delete this team member?</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Form Modal */}
            {showFormModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg w-full relative">
                        <button
                            onClick={() => setShowFormModal(false)}
                            className="absolute top-2 right-2 bg-red-500 text-white px-3 rounded-full"
                        >
                            X
                        </button>
                        <h3 className="text-xl font-bold mb-4">{isEditing ? 'Edit' : 'Add'} Team Member</h3>
                        <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
                            <input
                                type="file"
                                name="file"
                                onChange={handleFileChange}
                                className="border p-2 rounded"
                                required
                            />
                            <input type="text" name="full_name" placeholder="Full Name" value={formData.full_name} onChange={handleFormChange} className="border p-2 rounded" required />
                            <input type="text" name="position_en" placeholder="Position EN" value={formData.position_en} onChange={handleFormChange} className="border p-2 rounded" required />
                            <input type="text" name="position_ru" placeholder="Position RU" value={formData.position_ru} onChange={handleFormChange} className="border p-2 rounded" required />
                            <input type="text" name="position_de" placeholder="Position DE" value={formData.position_de} onChange={handleFormChange} className="border p-2 rounded" required />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                {isEditing ? 'Update' : 'Add'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Team;
