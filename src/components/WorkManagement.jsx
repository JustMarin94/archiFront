import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function WorkManagement({ authors }) {
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  const fetchWorks = async () => {
    const res = await api.get(`${BASE_URL}/works`);
    return res.data;
  };

  const { data: works = [], isLoading: loadingWorks } = useQuery({
    queryKey: ["works"],
    queryFn: fetchWorks,
  });

  const saveWorkMutation = useMutation({
    mutationFn: async (workData) => {
      if (editingItem) {
        return await api.put(`${BASE_URL}/works/${editingItem.id}`, workData);
      } else {
        return await api.post(`${BASE_URL}/works`, workData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["works"] });
      setEditingItem(null);
      alert("Work saved successfully!");
    },
    onError: (err) => alert(err.response?.data?.error || "Error saving work"),
  });

  const deleteWorkMutation = useMutation({
    mutationFn: async (id) => await api.delete(`${BASE_URL}/works/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["works"] }),
  });

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          {editingItem ? "Edit Work" : "Create New Work"}
        </h2>
        <WorkForm
          key={editingItem?.id || "new-work"}
          initialData={editingItem}
          authorsList={authors}
          onSubmit={(data, resetForm) => {
            saveWorkMutation.mutate(data, {
              onSuccess: () => {
                if (resetForm) resetForm();
              },
            });
          }}
          onCancel={() => setEditingItem(null)}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Existing Works
        </h2>
        {loadingWorks ? (
          <p className="text-gray-500">Loading works...</p>
        ) : (
          <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
            {works.map((work) => (
              <div
                key={work.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-gray-900">{work.title}</h3>
                  <p className="text-sm text-gray-600">
                    {work.city || "Unknown City"},{" "}
                    {work.region || "Unknown Region"}
                  </p>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => setEditingItem(work)}
                    className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteWorkMutation.mutate(work.id)}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* --- WORK FORM SUB-COMPONENT --- */
function WorkForm({ initialData, authorsList, onSubmit, onCancel }) {
  const existingAuthor =
    initialData?.authors?.[0] || initialData?.work_authors?.[0] || {};

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    typology: initialData?.typology || "",
    city: initialData?.city || "",
    region: initialData?.region || "",
    address: initialData?.address || "",
    postal_code: initialData?.postal_code || "",
    latitude: initialData?.latitude || "",
    longitude: initialData?.longitude || "",
    year_start: initialData?.year_start || "",
    year_end: initialData?.year_end || "",
    investor: initialData?.investor || "",
    protection_status: initialData?.protection_status || "",
    status: initialData?.status || "",
    intervention_type: initialData?.intervention_type || "",
    legacy_category: initialData?.legacy_category || "",
    photo_layout: initialData?.photo_layout || "GRID",
    author_id:
      existingAuthor.author_id ||
      existingAuthor.id ||
      initialData?.author_ids?.[0] ||
      "",
    role: existingAuthor.role || "",
    photos:
      Array.isArray(initialData?.photos) && initialData?.photos.length > 0
        ? initialData.photos.map((p) => ({
            url: p.url || "",
            caption: p.caption || "",
            alt_text: p.alt_text || "",
            position: p.position !== undefined ? p.position : 0,
          }))
        : [{ url: "", caption: "", alt_text: "", position: 0 }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (index, field, value) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos[index][field] = value;
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const addPhotoRow = () => {
    setFormData({
      ...formData,
      photos: [
        ...formData.photos,
        {
          url: "",
          caption: "",
          alt_text: "",
          position: formData.photos.length,
        },
      ],
    });
  };

  const removePhotoRow = (index) => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      year_start: formData.year_start
        ? parseInt(formData.year_start, 10)
        : null,
      year_end: formData.year_end ? parseInt(formData.year_end, 10) : null,
      authors: formData.author_id
        ? [{ author_id: formData.author_id, role: formData.role }]
        : [],
      photos: formData.photos
        .filter((p) => p.url.trim() !== "")
        .map((p) => ({
          ...p,
          position: p.position !== "" ? parseInt(p.position, 10) : 0,
        })),
    };

    onSubmit(payload, () => {
      setFormData({
        title: "",
        description: "",
        typology: "",
        city: "",
        region: "",
        address: "",
        postal_code: "",
        latitude: "",
        longitude: "",
        year_start: "",
        year_end: "",
        investor: "",
        protection_status: "",
        status: "",
        intervention_type: "",
        legacy_category: "",
        author_id: "",
        role: "",
        photos: [{ url: "", caption: "", alt_text: "", position: 0 }],
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Basic Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Title *
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Typology
            </label>
            <input
              name="typology"
              value={formData.typology}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo Gallery Layout
            </label>

            <select
              name="photo_layout"
              value={formData.photo_layout}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="GRID">Grid - Equal-sized images</option>
              <option value="MOSAIC">Mosaic - Mixed-size images</option>
              <option value="LIST">List - Vertical images</option>
            </select>

            <p className="text-xs text-gray-500 mt-1">
              Choose how photos of this architectural work will be displayed.
            </p>
          </div>
        </div>
      </div>

      {/* Location & Coordinates */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Location & Coordinates
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <input
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Postal Code
            </label>
            <input
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              name="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              name="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Timeline & Details */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Timeline & Details
        </h3>
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Start
            </label>
            <input
              name="year_start"
              type="number"
              value={formData.year_start}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year End
            </label>
            <input
              name="year_end"
              type="number"
              value={formData.year_end}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investor
            </label>
            <input
              name="investor"
              value={formData.investor}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <input
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Author Association */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Author Association
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author
            </label>
            <select
              name="author_id"
              value={formData.author_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="">Select an author</option>
              {authorsList.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Lead Architect"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-gray-200 pt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Work Description
        </label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Dynamic Multi-Photo Management */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-800">Work Pictures</h3>
          <button
            type="button"
            onClick={addPhotoRow}
            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            + Add Picture
          </button>
        </div>

        <div className="space-y-4">
          {formData.photos.map((photo, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 relative"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Picture #{index + 1}
                </span>

                {formData.photos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhotoRow(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              {/* Image Preview */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Image Preview
                </label>

                <div className="w-full sm:w-64 h-40 rounded-lg overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                  {photo.url?.trim() ? (
                    <img
                      key={photo.url}
                      src={photo.url}
                      alt={
                        photo.alt_text ||
                        photo.caption ||
                        `Work picture ${index + 1}`
                      }
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display =
                          "flex";
                      }}
                    />
                  ) : null}

                  <div
                    className="w-full h-full flex flex-col items-center justify-center text-gray-400"
                    style={{
                      display: photo.url?.trim() ? "none" : "flex",
                    }}
                  >
                    <svg
                      className="w-10 h-10 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4-4a3 3 0 014 0l4 4m-2-2l2-2a3 3 0 014 0l2 2M4 6h16v14H4z"
                      />
                    </svg>
                    <span className="text-xs">
                      {photo.url?.trim()
                        ? "Unable to load image"
                        : "No image available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Photo Inputs */}
              <div className="grid md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Image URL *
                  </label>
                  <input
                    type="text"
                    value={photo.url}
                    onChange={(e) =>
                      handlePhotoChange(index, "url", e.target.value)
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Position / Order
                  </label>
                  <input
                    type="number"
                    value={photo.position}
                    onChange={(e) =>
                      handlePhotoChange(index, "position", e.target.value)
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={photo.caption || ""}
                    onChange={(e) =>
                      handlePhotoChange(index, "caption", e.target.value)
                    }
                    placeholder="Photo caption"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={photo.alt_text || ""}
                    onChange={(e) =>
                      handlePhotoChange(index, "alt_text", e.target.value)
                    }
                    placeholder="Accessibility description"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Save Work
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
