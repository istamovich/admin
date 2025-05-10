import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Faq = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFaqId, setSelectedFaqId] = useState(null);
  const [formData, setFormData] = useState({
    question_en: '',
    question_ru: '',
    question_de: '',
    answer_en: '',
    answer_ru: '',
    answer_de: '',
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('https://testaoron.limsa.uz/api/faq', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFaqs(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch FAQs');
      if (error.response?.status === 401) {
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
    setSelectedFaqId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.delete(`https://testaoron.limsa.uz/api/faq/${selectedFaqId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setFaqs(faqs.filter(faq => faq.id !== selectedFaqId));
      toast.success('FAQ deleted successfully');
    } catch (error) {
      toast.error('Failed to delete FAQ');
    } finally {
      setShowDeleteModal(false);
      setSelectedFaqId(null);
    }
  };

  const handleEditClick = (faq) => {
    setSelectedFaqId(faq.id);
    setFormData({ ...faq });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.patch(`https://testaoron.limsa.uz/api/faq/${selectedFaqId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('FAQ updated successfully');
      setShowEditModal(false);
      setSelectedFaqId(null);
      fetchFaqs();
    } catch (error) {
      toast.error('Failed to update FAQ');
    }
  };

  const handleAddClick = () => {
    setFormData({
      question_en: '',
      question_ru: '',
      question_de: '',
      answer_en: '',
      answer_ru: '',
      answer_de: '',
    });
    setShowAddModal(true);
  };

  const handleAddSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.post(`https://testaoron.limsa.uz/api/faq`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('FAQ added successfully');
      setShowAddModal(false);
      fetchFaqs();
    } catch (error) {
      toast.error('Failed to add FAQ');
    }
  };

  const closeModal = () => {
    setShowDeleteModal(false);
    setShowEditModal(false);
    setShowAddModal(false);
    setSelectedFaqId(null);
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
            <h2 className="text-xl font-bold mb-4">FAQs</h2>
            <button
              onClick={handleAddClick}
              className="cursor-pointer mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Add FAQ
            </button>
          </div>

          {faqs.length === 0 ? (
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
                  <th className="border border-gray-300 p-2">Question EN</th>
                  <th className="border border-gray-300 p-2">Answer EN</th>
                  <th className="border border-gray-300 p-2 w-[170px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq, index) => (
                  <tr key={faq.id} className="text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{faq.question_en}</td>
                    <td className="border border-gray-300 p-2">{faq.answer_en}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => handleEditClick(faq)}
                        className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(faq.id)}
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
          <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full"
            >
              X
            </button>
            <h3 className="text-xl font-bold mb-4">Delete FAQ</h3>
            <p>Are you sure you want to delete this FAQ?</p>
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
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full"
            >
              X
            </button>
            <h3 className="text-xl font-bold mb-4">Edit FAQ</h3>

            <div className="grid grid-cols-2 gap-4">
              {['question_en', 'question_ru', 'question_de', 'answer_en', 'answer_ru', 'answer_de'].map((field) => (
                <input
                  key={field}
                  className="border p-2 rounded w-full"
                  placeholder={field}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full"
            >
              X
            </button>
            <h3 className="text-xl font-bold mb-4">Add New FAQ</h3>

            <div className="grid grid-cols-2 gap-4">
              {['question_en', 'question_ru', 'question_de', 'answer_en', 'answer_ru', 'answer_de'].map((field) => (
                <input
                  key={field}
                  className="border p-2 rounded w-full"
                  placeholder={field}
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                />
              ))}
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Faq;
