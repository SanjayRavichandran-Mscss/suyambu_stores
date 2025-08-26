import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const API_BASE = "http://localhost:5000/api/admin";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: "", description: "" });
  const [loading, setLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    loadCategories();
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

  // Open modal for adding new category
  const openAddModal = () => {
    setFormData({ id: null, name: "", description: "" });
    setModalOpen(true);
  };

  // Open modal with existing data for editing
  const openEditModal = (category) => {
    setFormData({ id: category.id, name: category.name, description: category.description || "" });
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setFormData({ id: null, name: "", description: "" });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, name, description } = formData;
    if (!name.trim()) {
      Swal.fire("Validation Error", "Name is required", "warning");
      return;
    }

    setLoading(true);

    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `${API_BASE}/categories/${id}` : `${API_BASE}/categories`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Operation failed");
      }

      const successMsg = id ? "Category updated successfully" : "Category added successfully";
      Swal.fire("Success", successMsg, "success");

      closeModal();
      loadCategories();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete category with confirmation
  const handleDelete = (category) => {
    Swal.fire({
      title: `Delete Category "${category.name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#69D84F",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`${API_BASE}/categories/${category.id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to delete");
          }
          Swal.fire("Deleted!", "Category has been deleted.", "success");
          loadCategories();
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Categories</h1>
        <button
          onClick={openAddModal}
          className="bg-[#69D84F] hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          + Add Category
        </button>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-3 px-4 text-gray-700">Name</th>
              <th className="py-3 px-4 text-gray-700">Description</th>
              <th className="py-3 px-4 text-gray-700 w-28">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-500">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-b border-gray-200 hover:bg-green-50 transition"
                >
                  <td className="py-3 px-4 text-gray-900 font-medium">{cat.name}</td>
                  <td className="py-3 px-4 text-gray-700">{cat.description || "-"}</td>
                  <td className="py-3 px-4 space-x-3">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="text-[#69D84F] hover:text-green-600"
                      aria-label="Edit"
                      title="Edit"
                    >
                      {/* Pencil Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#69D84F"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11c1.105 0 2-.895 2-2v-5m-10-7l7 7m0 0l-7 7m7-7H6"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Delete"
                      title="Delete"
                    >
                      {/* Trash Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1h6a1 1 0 00-1-1m-4 0v-1a1 1 0 112 0v1"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm bg-opacity-30 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {formData.id ? "Edit Category" : "Add Category"}
            </h2>
            <form onSubmit={handleSubmit}>
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
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
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

export default ManageCategories;
