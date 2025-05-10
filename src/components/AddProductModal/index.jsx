import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialFormState = {
  title_en: '', title_ru: '', title_de: '',
  description_en: '', description_ru: '', description_de: '',
  price: '', category_id: '', sizes_id: [], colors_id: [],
  images: [], discount_id: '', min_sell: 1, materials: {}
};

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [materialKey, setMaterialKey] = useState('');
  const [materialValue, setMaterialValue] = useState('');

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

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
    } catch (err) {
      toast.error('Failed to fetch data');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (id, name) => {
    setFormData(prev => {
      const current = new Set(prev[name]);
      current.has(id) ? current.delete(id) : current.add(id);
      return { ...prev, [name]: [...current] };
    });
  };

  const handleImageUpload = (e) => {
    setFormData(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const addMaterial = () => {
    if (materialKey && materialValue) {
      setFormData(prev => ({
        ...prev,
        materials: { ...prev.materials, [materialKey]: materialValue }
      }));
      setMaterialKey('');
      setMaterialValue('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return toast.error('Please login');
  
      const form = new FormData();
      ['title_en', 'title_ru', 'title_de', 'description_en', 'description_ru', 'description_de', 'price', 'category_id', 'discount_id', 'min_sell']
        .forEach(field => form.append(field, formData[field] || ''));
  
      // 'materials' ni to'g'ri formatda yuboring
      form.append('materials', JSON.stringify(formData.materials));
      
      formData.sizes_id.forEach(id => form.append('sizes_id[]', id));
      formData.colors_id.forEach(id => form.append('colors_id[]', id));
      formData.images.forEach(file => form.append('files', file));
  
      await axios.post('https://testaoron.limsa.uz/api/product', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
  
      toast.success('Product added successfully');
      onProductAdded();
      setFormData(initialFormState); // formani tozalash
      onClose(); // modalni yopish
    } catch (err) {
      toast.error('Failed to add product');
      console.error(err);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button onClick={onClose} className="absolute top-2 right-2 text-white bg-red-500 px-2 py-[2px] cursor-pointer rounded-full">X</button>
        <h3 className="text-xl font-bold mb-4">Add Product</h3>
        <form onSubmit={handleSubmit}>
          {['en', 'ru', 'de'].map((lang) => (
            <div key={lang}>
              <label className="block text-sm font-medium mb-1">Product Title ({lang.toUpperCase()})</label>
              <input
                type="text"
                name={`title_${lang}`}
                value={formData[`title_${lang}`]}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                maxLength={80}
                required
              />
              <label className="block text-sm font-medium mb-1">Product Description ({lang.toUpperCase()})</label>
              <textarea
                name={`description_${lang}`}
                value={formData[`description_${lang}`]}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded mb-2"
                maxLength={500}
                required
              />
            </div>
          ))}
          <label className="block text-sm font-medium mb-1">Price</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded mb-2" required />

          <label className="block text-sm font-medium mb-1">Minimal nechta sotish</label>
          <input type="number" name="min_sell" value={formData.min_sell} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded mb-2" />

          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded mb-2" required>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name_en}</option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-1">Sizes</label>
          <div className="flex flex-wrap gap-4 mb-2">
            {sizes.map((s) => (
              <div key={s.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`size-${s.id}`}
                  value={s.id}
                  checked={formData.sizes_id.includes(s.id)}
                  onChange={() => handleCheckboxChange(s.id, 'sizes_id')}
                  className="mr-2"
                />
                <label htmlFor={`size-${s.id}`} className="text-sm">{s.size}</label>
              </div>
            ))}
          </div>

          <label className="block text-sm font-medium mb-1">Colors</label>
          <div className="flex flex-wrap gap-4 mb-2">
            {colors.map((c) => (
              <div key={c.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`color-${c.id}`}
                  value={c.id}
                  checked={formData.colors_id.includes(c.id)}
                  onChange={() => handleCheckboxChange(c.id, 'colors_id')}
                  className="mr-2"
                />
                <label htmlFor={`color-${c.id}`} className="text-sm">{c.color_en}</label>
              </div>
            ))}
          </div>

          <label className="block text-sm font-medium mb-1">Discount</label>
          <select name="discount_id" value={formData.discount_id} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded mb-2">
            <option value="">Select Discount</option>
            {discounts.map((d) => (
              <option key={d.id} value={d.id}>{d.discount}</option>
            ))}
          </select>

          <label className="block text-sm font-medium mb-1">Images</label>
          <input type="file" multiple onChange={handleImageUpload} className="w-full p-2 border border-gray-300 rounded mb-2" />

          <label className="block text-sm font-medium mb-1">Materials</label>
          <div className="flex gap-2 mb-2">
            <input value={materialKey} onChange={(e) => setMaterialKey(e.target.value)} placeholder="Material (e.g. wool)" className="border p-2 rounded w-full" />
            <input value={materialValue} onChange={(e) => setMaterialValue(e.target.value)} placeholder="Value (e.g. 20%)" className="border p-2 rounded w-full" />
            <button type="button" onClick={addMaterial} className="bg-blue-500 text-white px-3 py-2 rounded">Add</button>
          </div>
          <div className="text-sm text-gray-600 mb-4">
            {Object.entries(formData.materials).map(([key, val]) => (
              <div key={key}>{key}: {val}</div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Product</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
