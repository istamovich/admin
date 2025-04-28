import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProductModal = ({ onClose, fetchProducts }) => {
    const [title_en, setTitleEn] = useState('');
    const [description_en, setDescriptionEn] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        setImages([...e.target.files]); // Fayllarni olish
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title_en', title_en);
        formData.append('description_en', description_en);
        formData.append('price', price);
        formData.append('category_id', categoryId);

        // Rasm fayllarini FormData'ga qo'shish
        images.forEach((image) => {
            formData.append('images', image); // 'images' maydonini yuborish
        });

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('No token found. Please login again.');
                return;
            }

            // Mahsulot qo‘shish API so'rovini yuborish
            const response = await axios.post('https://back.ifly.com.uz/api/product', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                toast.success('Product added successfully');
                fetchProducts(); // Mahsulotlar ro‘yxatini yangilash
                onClose(); // Modalni yopish
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.error('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full"
                >
                    X
                </button>
                <h3 className="text-xl font-bold mb-4">Add New Product</h3>

                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="title_en">Title (English)</label>
                        <input
                            type="text"
                            id="title_en"
                            value={title_en}
                            onChange={(e) => setTitleEn(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="description_en">Description (English)</label>
                        <textarea
                            id="description_en"
                            value={description_en}
                            onChange={(e) => setDescriptionEn(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="category_id">Category</label>
                        <input
                            type="text"
                            id="category_id"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="images">Images</label>
                        <input
                            type="file"
                            id="images"
                            multiple
                            onChange={handleImageChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>

                    <div className="flex justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition ${loading && 'opacity-50 cursor-not-allowed'}`}
                        >
                            {loading ? 'Adding...' : 'Add Product'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
