import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddProductModal from '../../components/AddProductModal';

const ProductsTable = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // AddProduct modal state

    const handleOpenModal = () => {
        setIsModalOpen(true); // Modalni ochish
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Modalni yopish
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('https://back.ifly.com.uz/api/product');
            setProducts(response.data.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id) => {
        setSelectedProductId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('No token found. Please login again.');
                return;
            }

            await axios.delete(`https://back.ifly.com.uz/api/product/${selectedProductId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success('Product deleted successfully');
            fetchProducts(); // o‘chirgandan keyin ro‘yxatni yangilash
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Failed to delete product');
        } finally {
            setShowDeleteModal(false);
            setSelectedProductId(null);
        }
    };

    const closeModal = () => {
        setShowDeleteModal(false);
        setSelectedProductId(null);
    };

    if (loading) {
        return (
            <div className="text-center p-8 text-xl font-semibold">
                Loading...
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[1050px] ml-[255px]">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-4">Products</h2>
                    <button
                        onClick={handleOpenModal} // Modal ochiladi
                        className="cursor-pointer mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Add Product
                    </button>
                </div>

                <div className="text-center py-6">
                    <img
                        src="https://aoron.nippon.com.uz/assets/noData-DPgWaiIB.png"
                        alt="No data"
                        className="mx-auto w-20"
                    />
                    <p className="text-gray-500 mt-2">No Data Available</p>
                </div>

                <ToastContainer />
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[1090px] ml-[240px]">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-4">Products</h2>
                    <button
                        onClick={handleOpenModal} // Modal ochiladi
                        className="cursor-pointer mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        Add Product
                    </button>
                </div>

                <div className="p-4 overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">№</th>
                                <th className="border border-gray-300 p-2">Images</th>
                                <th className="border border-gray-300 p-2">Title</th>
                                <th className="border border-gray-300 p-2">Description</th>
                                <th className="border border-gray-300 p-2">Price</th>
                                <th className="border border-gray-300 p-2">Category</th>
                                <th className="border border-gray-300 p-2">Colors</th>
                                <th className="border border-gray-300 p-2">Sizes</th>
                                <th className="border border-gray-300 p-2">Discount</th>
                                <th className="border border-gray-300 p-2">Materials</th>
                                <th className="border border-gray-300 p-2 w-[170px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product.id} className="text-center hover:bg-gray-100">
                                    <td className="border border-gray-300 p-2">{index + 1}</td>
                                    <td className="border border-gray-300 p-2 w-[150px] h-[100px]">
                                        {product.images.length > 0 ? (
                                            <img
                                                src={`https://back.ifly.com.uz/${product.images[0]}`}
                                                alt={product.title_en}
                                                className="w-full h-full rounded-sm object-cover"
                                            />
                                        ) : (
                                            <div className="text-gray-400">No Image</div>
                                        )}
                                    </td>
                                    <td className="border border-gray-300 p-2">{product.title_en}</td>
                                    <td className="border border-gray-300 p-2 h-[50px]">
                                        <p>{product.description_en}</p>
                                    </td>
                                    <td className="border border-gray-300 p-2">{product.price}</td>
                                    <td className="border border-gray-300 p-2">{product.category?.name_en || 'No Category'}</td>
                                    <td className="border border-gray-300 p-2">
                                        {product.colors.length > 0 ? product.colors[0].color_en : ''}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {product.sizes.length > 0 ? product.sizes[0].size : ''}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {product.discount ? `${product.discount}%` : 'No Discount'}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {product.materials && Object.keys(product.materials).length > 0 ? (
                                            Object.entries(product.materials).map(([key, value]) => (
                                                <div key={key}>
                                                    {key}: {value}%
                                                </div>
                                            ))
                                        ) : (
                                            ''
                                        )}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        <button className="px-4 py-2 mr-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => confirmDelete(product.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <ToastContainer />
            </div>

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
                            <h3 className="text-xl font-bold mb-4">
                                Are you sure you want to delete this product?
                            </h3>
                            <div className="flex justify-between">
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="px-4 cursor-pointer py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <AddProductModal
                    onClose={handleCloseModal} // Modalni yopish
                    fetchProducts={fetchProducts} // Mahsulotlarni yangilash
                />
            )}
        </div>
    );
};

export default ProductsTable;
