import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";
import Navbar from "../shared/Navbar";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("works"); // "works" or "authors"
  const [editingItem, setEditingItem] = useState(null); // null means creating new

  const queryClient = useQueryClient();

  // --- FETCHERS ---
  const fetchWorks = async () => {
    const res = await api.get(`${BASE_URL}/works`);
    return res.data;
  };

  const fetchAuthors = async () => {
    const res = await api.get(`${BASE_URL}/authors`);
    return res.data;
  };

  const { data: works = [], isLoading: loadingWorks } = useQuery({
    queryKey: ["works"],
    queryFn: fetchWorks,
  });

  const { data: authors = [], isLoading: loadingAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });

  // --- MUTATIONS: AUTHORS ---
  const saveAuthorMutation = useMutation({
    mutationFn: async (authorData) => {
      if (editingItem) {
        return await api.put(
          `${BASE_URL}/authors/${editingItem.id}`,
          authorData,
        );
      } else {
        return await api.post(`${BASE_URL}/authors`, authorData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authors"] });
      setEditingItem(null);
      alert("Author saved successfully!");
    },
    onError: (err) => alert(err.response?.data?.error || "Error saving author"),
  });

  const deleteAuthorMutation = useMutation({
    mutationFn: async (id) => await api.delete(`${BASE_URL}/authors/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authors"] }),
  });

  // --- MUTATIONS: WORKS ---
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
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage architectural works, authors, and relationships.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 pb-4">
            <button
              onClick={() => {
                setActiveTab("works");
                setEditingItem(null);
              }}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === "works"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Manage Works
            </button>
            <button
              onClick={() => {
                setActiveTab("authors");
                setEditingItem(null);
              }}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === "authors"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Manage Authors
            </button>
          </div>

          {/* RENDER WORKS MANAGEMENT */}
          {activeTab === "works" && (
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
                        queryClient.invalidateQueries({ queryKey: ["works"] });
                        setEditingItem(null);
                        if (resetForm) resetForm();
                        alert("Work saved successfully!");
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
                          <h3 className="font-bold text-gray-900">
                            {work.title}
                          </h3>
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
          )}

          {/* RENDER AUTHORS MANAGEMENT */}
          {activeTab === "authors" && (
            <div className="space-y-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  {editingItem ? "Edit Author" : "Create New Author"}
                </h2>
                <AuthorForm
                  key={editingItem?.id || "new-author"}
                  initialData={editingItem}
                  onSubmit={(data, resetForm) => {
                    saveAuthorMutation.mutate(data, {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: ["authors"],
                        });
                        setEditingItem(null);
                        if (resetForm) resetForm();
                        alert("Author saved successfully!");
                      },
                    });
                  }}
                  onCancel={() => setEditingItem(null)}
                />
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Existing Authors
                </h2>
                {loadingAuthors ? (
                  <p className="text-gray-500">Loading authors...</p>
                ) : (
                  <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
                    {authors.map((author) => (
                      <div
                        key={author.id}
                        className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {author.full_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Awards:{" "}
                            {Array.isArray(author.awards) &&
                            author.awards.length > 0
                              ? author.awards.map((a) => a.title).join(", ")
                              : typeof author.awards === "string" &&
                                  author.awards
                                ? author.awards
                                : "None"}
                          </p>
                        </div>
                        <div className="space-x-3">
                          <button
                            onClick={() => setEditingItem(author)}
                            className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              deleteAuthorMutation.mutate(author.id)
                            }
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
          )}
        </div>
      </div>
    </>
  );
}

/* --- AUTHOR FORM SUB-COMPONENT --- */
function AuthorForm({ initialData, onSubmit, onCancel }) {
  const formatYearForInput = (year) => {
    if (!year) return "";
    return String(year);
  };

  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    birth_year: formatYearForInput(initialData?.birth_year),
    death_year: formatYearForInput(initialData?.death_year),
    education: initialData?.education || "",
    description: initialData?.description || "",
    awards:
      Array.isArray(initialData?.awards) && initialData?.awards.length > 0
        ? initialData.awards
        : [{ title: "", year: "", description: "" }],
    photos: initialData?.photos || [{ url: "", caption: "", alt_text: "" }],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Award List Handlers ---
  const handleAwardChange = (index, field, value) => {
    const updatedAwards = [...formData.awards];
    updatedAwards[index][field] = value;
    setFormData({ ...formData, awards: updatedAwards });
  };

  const addAwardRow = () => {
    setFormData({
      ...formData,
      awards: [...formData.awards, { title: "", year: "", description: "" }],
    });
  };

  const removeAwardRow = (index) => {
    const updatedAwards = formData.awards.filter((_, i) => i !== index);
    setFormData({ ...formData, awards: updatedAwards });
  };

  // --- Photo List Handlers ---
  const handlePhotoChange = (index, field, value) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos[index][field] = value;
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const addPhotoRow = () => {
    setFormData({
      ...formData,
      photos: [...formData.photos, { url: "", caption: "", alt_text: "" }],
    });
  };

  const removePhotoRow = (index) => {
    const updatedPhotos = formData.photos.filter((_, i) => i !== index);
    setFormData({ ...formData, photos: updatedPhotos });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parseYear = (val) => {
      if (!val) return null;
      if (typeof val === "string" && val.includes("-")) {
        return parseInt(val.split("-")[0], 10);
      }
      return parseInt(val, 10) || null;
    };

    const payload = {
      ...formData,
      birth_year: parseYear(formData.birth_year),
      death_year: parseYear(formData.death_year),
      // Filter out empty award entries before submitting
      awards: formData.awards
        .filter((a) => a.title && a.title.trim() !== "")
        .map((a) => ({
          ...a,
          year: a.year ? parseInt(a.year, 10) : null,
        })),
      // Filter out empty photo rows before submitting
      photos: formData.photos.filter((p) => p.url && p.url.trim() !== ""),
    };

    onSubmit(payload, () => {
      setFormData({
        full_name: "",
        birth_year: "",
        death_year: "",
        education: "",
        description: "",
        awards: [{ title: "", year: "", description: "" }],
        photos: [{ url: "", caption: "", alt_text: "" }],
      });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Education
          </label>
          <input
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birth Date / Year
          </label>
          <input
            name="birth_year"
            type="text"
            placeholder="e.g. 1985 or YYYY-MM-DD"
            value={formData.birth_year}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Death Date / Year
          </label>
          <input
            name="death_year"
            type="text"
            placeholder="e.g. 2060 or YYYY-MM-DD"
            value={formData.death_year}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description / Biography
        </label>
        <textarea
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Dynamic Multi-Award Management */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-800">Author Awards</h3>
          <button
            type="button"
            onClick={addAwardRow}
            className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            + Add Award
          </button>
        </div>

        <div className="space-y-4">
          {formData.awards.map((award, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 relative"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700">
                  Award #{index + 1}
                </span>
                {formData.awards.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAwardRow(index)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Award Title *
                  </label>
                  <input
                    type="text"
                    value={award.title || ""}
                    onChange={(e) =>
                      handleAwardChange(index, "title", e.target.value)
                    }
                    placeholder="e.g. Pritzker Architecture Prize"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={award.year || ""}
                    onChange={(e) =>
                      handleAwardChange(index, "year", e.target.value)
                    }
                    placeholder="YYYY"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={award.description || ""}
                    onChange={(e) =>
                      handleAwardChange(index, "description", e.target.value)
                    }
                    placeholder="Optional details"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Multi-Photo Management */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-800">Author Pictures</h3>
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
              <div className="grid md:grid-cols-3 gap-3">
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
                    placeholder="Description for accessibility"
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
          Save Author
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
    author_id:
      existingAuthor.author_id ||
      existingAuthor.id ||
      initialData?.author_ids?.[0] ||
      "",
    role: existingAuthor.role || "",
    photos: initialData?.photos || [{ url: "", caption: "", alt_text: "" }],
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
      photos: [...formData.photos, { url: "", caption: "", alt_text: "" }],
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
      photos: formData.photos.filter((p) => p.url.trim() !== ""),
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
        photos: [{ url: "", caption: "", alt_text: "" }],
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

      {/* Timeline & Project Details */}
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
              Status
            </label>
            <input
              name="status"
              value={formData.status}
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
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Protection Status
            </label>
            <input
              name="protection_status"
              value={formData.protection_status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Intervention Type
            </label>
            <input
              name="intervention_type"
              value={formData.intervention_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Legacy Category
            </label>
            <input
              name="legacy_category"
              value={formData.legacy_category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows="3"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Author Relationship */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Author Relationship
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Author
            </label>
            <select
              name="author_id"
              value={formData.author_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
            >
              <option value="">-- None --</option>
              {authorsList.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.full_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author Role (e.g. Lead Architect)
            </label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
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
              <div className="grid md:grid-cols-3 gap-3">
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
                    placeholder="Description for accessibility"
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
