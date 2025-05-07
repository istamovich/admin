import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
    const [formData, setFormData] = useState({
        title_en: '',
        title_ru: '',
        title_de: '',
        description_en: '',
        description_ru: '',
        description_de: '',
        price: '',
        category_id: '',
        sizes_id: [],
        colors_id: [],
        file: [],
        materials: {},
        discount_id: '',
        min_sell: 1,
        images: []
    });

    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [discounts, setDiscounts] = useState([]);
    const [materialKey, setMaterialKey] = useState('');
    const [materialValue, setMaterialValue] = useState('');

    useEffect(() => {
        if (isOpen && product) {
            setFormData({
                ...product,
                sizes_id: product.sizes?.map(s => s.id) || [],
                colors_id: product.colors?.map(c => c.id) || [],
                materials: product.materials || {},
                images: []
            });
            fetchData();
        }
    }, [isOpen, product]);

    const fetchData = async () => {
        try {
            const [catRes, sizeRes, colorRes, discountRes] = await Promise.all([
                axios.get('https://back.ifly.com.uz/api/category'),
                axios.get('https://back.ifly.com.uz/api/sizes'),
                axios.get('https://back.ifly.com.uz/api/colors'),
                axios.get('https://back.ifly.com.uz/api/discount')
            ]);
            setCategories(catRes.data.data);
            setSizes(sizeRes.data.data);
            setColors(colorRes.data.data);
            setDiscounts(discountRes.data.data);
        } catch (error) {
            toast.error('Failed to fetch form data');
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e, name) => {
        const values = Array.from(e.target.selectedOptions, (opt) => +opt.value);
        setFormData((prev) => ({ ...prev, [name]: values }));
    };

    const addMaterial = () => {
        if (materialKey && materialValue) {
            setFormData((prev) => ({
                ...prev,
                materials: { ...prev.materials, [materialKey]: materialValue }
            }));
            setMaterialKey('');
            setMaterialValue('');
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({ ...prev, images: files }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) return toast.error('Please login.');

            const form = new FormData();
            form.append('title_en', formData.title_en);
            form.append('title_ru', formData.title_ru);
            form.append('title_de', formData.title_de);
            form.append('description_en', formData.description_en);
            form.append('description_ru', formData.description_ru);
            form.append('description_de', formData.description_de);
            form.append('price', formData.price);
            form.append('category_id', formData.category_id);
            form.append('discount_id', formData.discount_id || '');
            form.append('min_sell', formData.min_sell);
            form.append('materials', JSON.stringify(formData.materials));

            formData.sizes_id.forEach(id => form.append('sizes_id[]', id));
            formData.colors_id.forEach(id => form.append('colors_id[]', id));
            formData.images.forEach((image) => {
                form.append('files', image);
            });

            await axios.patch(`https://back.ifly.com.uz/api/product/${product.id}`, form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Product updated successfully');
            onProductUpdated();
            onClose();
        } catch (error) {
            toast.error('Failed to update product');
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[800px] max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                    {['title_en', 'title_ru', 'title_de'].map((lang) => (
                        <input
                            key={lang}
                            name={lang}
                            value={formData[lang]}
                            onChange={handleInputChange}
                            placeholder={`Title (${lang.split('_')[1].toUpperCase()})`}
                            className="border p-2 rounded"
                            required
                        />
                    ))}
                    {['description_en', 'description_ru', 'description_de'].map((lang) => (
                        <textarea
                            key={lang}
                            name={lang}
                            value={formData[lang]}
                            onChange={handleInputChange}
                            placeholder={`Description (${lang.split('_')[1].toUpperCase()})`}
                            className="border p-2 rounded col-span-2"
                            required
                        />
                    ))}
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="number"
                        name="min_sell"
                        value={formData.min_sell}
                        onChange={handleInputChange}
                        placeholder="Minimum Sell"
                        className="border p-2 rounded"
                    />
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                        ))}
                    </select>
                    <select
                        multiple
                        value={formData.sizes_id}
                        onChange={(e) => handleSelectChange(e, 'sizes_id')}
                        className="border p-2 rounded"
                    >
                        {sizes.map((s) => (
                            <option key={s.id} value={s.id}>{s.size}</option>
                        ))}
                    </select>
                    <select
                        multiple
                        value={formData.colors_id}
                        onChange={(e) => handleSelectChange(e, 'colors_id')}
                        className="border p-2 rounded"
                    >
                        {colors.map((c) => (
                            <option key={c.id} value={c.id}>{c.color_en}</option>
                        ))}
                    </select>
                    <select
                        name="discount_id"
                        value={formData.discount_id}
                        onChange={handleInputChange}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Discount</option>
                        {discounts.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>

                    <div className="col-span-2">
                        <label className="block mb-1 font-medium">Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageUpload}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block font-medium">Materials</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                value={materialKey}
                                onChange={(e) => setMaterialKey(e.target.value)}
                                placeholder="Material (e.g. wool)"
                                className="border p-2 rounded w-full"
                            />
                            <input
                                value={materialValue}
                                onChange={(e) => setMaterialValue(e.target.value)}
                                placeholder="Value (e.g. 20%)"
                                className="border p-2 rounded w-full"
                            />
                            <button type="button" onClick={addMaterial} className="bg-blue-500 text-white px-3 py-2 rounded">
                                Add
                            </button>
                        </div>
                        <div className="text-sm text-gray-600">
                            {Object.entries(formData.materials).map(([key, value]) => (
                                <div key={key}>{key}: {value}</div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-2 flex justify-end gap-2">
                        <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700">
                            Update Product
                        </button>
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;
