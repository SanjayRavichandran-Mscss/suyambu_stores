import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API_BASE = "http://localhost:5000/api/admin";
const IMAGE_BASE = "http://localhost:5000";
const FALLBACK_IMAGE = `${IMAGE_BASE}/fallback-image.png`;

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    category_id: "",
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    thumbnail: null,
    additional_images: [],
  });
  const [categorySearch, setCategorySearch] = useState("");

  // Load all categories and products
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      const updatedProducts = data.map(product => {
        let additionalImages = [];
        if (typeof product.additional_images === "string") {
          try {
            additionalImages = JSON.parse(product.additional_images);
          } catch {
            additionalImages = product.additional_images.split(",").map(img => img.trim()).filter(Boolean);
          }
        } else if (Array.isArray(product.additional_images)) {
          additionalImages = product.additional_images;
        }
        return {
          ...product,
          thumbnail_url: product.thumbnail_url && product.thumbnail_url.startsWith("/")
            ? `${IMAGE_BASE}${product.thumbnail_url}` : product.thumbnail_url || FALLBACK_IMAGE,
          additional_images: additionalImages.map(img =>
            img && img.startsWith("/") ? `${IMAGE_BASE}${img}` : img || FALLBACK_IMAGE
          ),
          selectedImageIndex: 0
        };
      });
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const openAddModal = () => {
    setFormData({
      id: null,
      category_id: "",
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      thumbnail: null,
      additional_images: [],
    });
    setCategorySearch("");
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData({
      id: product.id,
      category_id: product.category_id.toString(),
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      thumbnail: null,
      additional_images: [],
    });
    setCategorySearch("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormData({
      id: null,
      category_id: "",
      name: "",
      description: "",
      price: "",
      stock_quantity: "",
      thumbnail: null,
      additional_images: [],
    });
    setCategorySearch("");
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      if (name === "thumbnail") {
        setFormData(prev => ({ ...prev, thumbnail: files[0] }));
      } else if (name === "additional_images") {
        setFormData(prev => ({ ...prev, additional_images: Array.from(files).slice(0, 5) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const { category_id, name, price, stock_quantity } = formData;
    if (!category_id) {
      Swal.fire("Validation Error", "Category is required", "warning");
      return false;
    }
    if (!name.trim()) {
      Swal.fire("Validation Error", "Name is required", "warning");
      return false;
    }
    if (!price || Number(price) <= 0) {
      Swal.fire("Validation Error", "Price must be greater than 0", "warning");
      return false;
    }
    if (!stock_quantity || Number(stock_quantity) < 0) {
      Swal.fire("Validation Error", "Stock quantity cannot be negative", "warning");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let url = `${API_BASE}/products`;
      let method = "POST";
      if (formData.id) {
        url += `/${formData.id}`;
        method = "PUT";
      }
      const payload = new FormData();
      payload.append("category_id", formData.category_id);
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
      payload.append("stock_quantity", formData.stock_quantity);
      if (formData.thumbnail) payload.append("thumbnail", formData.thumbnail);
      formData.additional_images.forEach((file, idx) => {
        if (idx >= 5) return;
        payload.append("additional_images", file);
      });
      const res = await fetch(url, { method, body: payload });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Operation failed");
      }
      Swal.fire("Success", formData.id ? "Product updated successfully" : "Product added successfully", "success");
      closeModal();
      loadProducts();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (product) => {
    Swal.fire({
      title: `Delete Product "${product.name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#69D84F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_BASE}/products/${product.id}`, { method: "DELETE" });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to delete");
          }
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          loadProducts();
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  const openFullscreen = (image) => {
    setFullscreenImage(image);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  const handleImageSelect = (productId, imageIndex) => {
    setProducts(prev =>
      prev.map(product =>
        product.id === productId
          ? { ...product, selectedImageIndex: imageIndex }
          : product
      )
    );
  };

  const getAllProductImages = (product) => {
    const images = [];
    if (product.thumbnail_url) images.push(product.thumbnail_url);
    if (product.additional_images && product.additional_images.length > 0) {
      images.push(...product.additional_images);
    }
    return images;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <button
          onClick={openAddModal}
          className="bg-[#69D84F] hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          + Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-6 text-gray-500">
            No products found.
          </div>
        ) : (
          products.map((prod) => {
            const category = categories.find((cat) => cat.id === prod.category_id);
            const allImages = getAllProductImages(prod);
            const selectedImageIndex = prod.selectedImageIndex || 0;
            const displayImage = allImages.length > 0 ? allImages[selectedImageIndex] : FALLBACK_IMAGE;
            return (
              <div
                key={prod.id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:shadow-xl transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{prod.name}</h3>
                
                {/* Main product image */}
                <div className="relative mb-4">
                  <img
                    src={displayImage}
                    alt={prod.name}
                    className="w-full h-48 object-cover rounded-xl border border-gray-200 cursor-pointer transition duration-200 hover:scale-105"
                    onClick={() => openFullscreen(displayImage)}
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                  />
                </div>
                
                {/* Thumbnail and additional images */}
                <div className="flex items-start gap-2 mb-4 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${prod.name} ${idx === 0 ? 'thumbnail' : 'additional image ' + idx}`}
                      onClick={() => handleImageSelect(prod.id, idx)}
                      className={`w-14 h-14 object-cover rounded-md cursor-pointer border-2 box-border
                        ${selectedImageIndex === idx ? 'border-green-500' : 'border-gray-300'}
                        transition-all duration-150 flex-shrink-0`}
                      onError={e => { e.target.src = FALLBACK_IMAGE; }}
                    />
                  ))}
                </div>
                
                <div className="mb-1 text-gray-700">
                  <span className="font-medium">Category:</span> {category?.name || "N/A"}
                </div>
                <div className="mb-1 text-gray-700">
                  <span className="font-medium">Price:</span> ₹{Number(prod.price).toFixed(2)}
                </div>
                <div className="mb-1 text-gray-700">
                  <span className="font-medium">Stock:</span> {prod.stock_quantity}
                </div>
                <div className="mb-2 text-gray-600">
                  <span className="font-medium">Description:</span> {prod.description || "No description"}
                </div>
                <div className="flex justify-end gap-3 mt-auto">
                  <button
                    onClick={() => openEditModal(prod)}
                    className="text-[#69D84F] hover:text-green-600 transition"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11c1.105 0 2-.895 2-2v-5m-10-7l7 7m0 0l-7 7m7-7H6"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(prod)}
                    className="text-red-600 hover:text-red-800 transition"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1h6a1 1 0 00-1-1m-4 0v-1a1 1 0 112 0v1"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeFullscreen}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-[90%] max-h-[90%] object-contain"
            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
          />
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeFullscreen}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      )}
      {modalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-30 flex justify-center items-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-6 text-gray-900">
              {formData.id ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-4 relative">
                <label htmlFor="category_id" className="block mb-1 font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={categories.find(cat => cat.id.toString() === formData.category_id)?.name || categorySearch}
                  onChange={(e) => {
                    setCategorySearch(e.target.value);
                    setFormData((prev) => ({ ...prev, category_id: "" }));
                  }}
                  placeholder="Search or select category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#69D84F]"
                />
                {categorySearch && (
                  <ul className="absolute z-50 bg-white border border-gray-300 rounded-md w-full mt-1 max-h-40 overflow-auto shadow-lg">
                    {filteredCategories.length === 0 ? (
                      <li className="p-2 text-gray-500">No categories found</li>
                    ) : (
                      filteredCategories.map((cat) => (
                        <li
                          key={cat.id}
                          className="cursor-pointer p-2 hover:bg-green-100"
                          onClick={() => {
                            setFormData((prev) => ({ ...prev, category_id: cat.id.toString() }));
                            setCategorySearch("");
                          }}
                        >
                          {cat.name}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#69D84F]"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1 font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#69D84F]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block mb-1 font-medium text-gray-700">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#69D84F]"
                  />
                </div>
                <div>
                  <label htmlFor="stock_quantity" className="block mb-1 font-medium text-gray-700">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="stock_quantity"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#69D84F]"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="thumbnail" className="block mb-1 font-medium text-gray-700">
                  Thumbnail Image {formData.id ? "(Leave blank to keep current)" : <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  accept="image/*"
                  onChange={handleChange}
                  required={!formData.id}
                  className="w-full border border-gray-300 rounded-md p-1"
                />
              </div>
              <div className="mt-4">
                <label htmlFor="additional_images" className="block mb-1 font-medium text-gray-700">
                  Additional Images (Max 5)
                </label>
                <input
                  type="file"
                  id="additional_images"
                  name="additional_images"
                  accept="image/*"
                  onChange={handleChange}
                  multiple
                  className="w-full border border-gray-300 rounded-md p-1"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#69D84F] text-white rounded-md hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;