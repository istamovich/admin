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
                axios.get('https://testaoron.limsa.uz/api/category'),
                axios.get('https://testaoron.limsa.uz/api/sizes'),
                axios.get('https://testaoron.limsa.uz/api/colors'),
                axios.get('https://testaoron.limsa.uz/api/discount')
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

            await axios.patch(`https://testaoron.limsa.uz/api/product/${product.id}`, form, {
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
            <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={onClose} className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full">X</button>
                <h3 className="text-xl font-bold mb-4">Update Product</h3>
                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
    
                    {/* Titles */}
                    {['en', 'ru', 'de'].map((lang) => (
                        <div key={`title_${lang}`}>
                            <label className="block text-sm font-medium mb-1">
                                Product Title ({lang.toUpperCase()})
                            </label>
                            <input
                                type="text"
                                name={`title_${lang}`}
                                value={formData[`title_${lang}`]}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                maxLength={80}
                                required
                            />
                        </div>
                    ))}
    
                    {/* Descriptions */}
                    {['en', 'ru', 'de'].map((lang) => (
                        <div key={`description_${lang}`}>
                            <label className="block text-sm font-medium mb-1">
                                Product Description ({lang.toUpperCase()})
                            </label>
                            <textarea
                                name={`description_${lang}`}
                                value={formData[`description_${lang}`]}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                maxLength={500}
                                required
                            />
                        </div>
                    ))}
    
                    {/* Price and min sell */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            maxLength={10}
                            required
                        />
                    </div>
    
                    <div>
                        <label className="block text-sm font-medium mb-1">Minimal nechta sotish</label>
                        <input
                            type="number"
                            name="min_sell"
                            step="1"
                            value={formData.min_sell}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
    
                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name_en}</option>
                            ))}
                        </select>
                    </div>
    
                    {/* Sizes (Checkbox) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Sizes</label>
                        <div className="flex flex-wrap gap-4">
                            {sizes.map((s) => (
                                <div className="flex items-center" key={s.id}>
                                    <input
                                        type="checkbox"
                                        id={`size-${s.id}`}
                                        value={s.id}
                                        checked={formData.sizes_id.includes(s.id)}
                                        onChange={(e) => {
                                            const newSizes = e.target.checked
                                                ? [...formData.sizes_id, s.id]
                                                : formData.sizes_id.filter((id) => id !== s.id);
                                            setFormData((prev) => ({ ...prev, sizes_id: newSizes }));
                                        }}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`size-${s.id}`} className="text-sm">{s.size}</label>
                                </div>
                            ))}
                        </div>
                    </div>
    
                    {/* Colors (Checkbox) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Colors</label>
                        <div className="flex flex-wrap gap-4">
                            {colors.map((c) => (
                                <div className="flex items-center" key={c.id}>
                                    <input
                                        type="checkbox"
                                        id={`color-${c.id}`}
                                        value={c.id}
                                        checked={formData.colors_id.includes(c.id)}
                                        onChange={(e) => {
                                            const newColors = e.target.checked
                                                ? [...formData.colors_id, c.id]
                                                : formData.colors_id.filter((id) => id !== c.id);
                                            setFormData((prev) => ({ ...prev, colors_id: newColors }));
                                        }}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`color-${c.id}`} className="text-sm">{c.color_en}</label>
                                </div>
                            ))}
                        </div>
                    </div>
    
                    {/* Discount */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Discount</label>
                        <select
                            name="discount_id"
                            value={formData.discount_id}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="">Select Discount</option>
                            {discounts.map((d) => (
                                <option key={d.id} value={d.id}>{d.discount}</option>
                            ))}
                        </select>
                    </div>
    
                    {/* Images Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleImageUpload}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
    
                    {/* Materials */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Materials</label>
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
    
                    {/* Submit / Cancel */}
                    <div className="flex justify-end gap-2 pt-2">
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
