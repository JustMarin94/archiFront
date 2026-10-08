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
                  key={editingItem?.id || "new-work"} // <-- Adding this key fixes the issue!
                  initialData={editingItem}
                  authorsList={authors}
                  onSubmit={(data) => saveWorkMutation.mutate(data)}
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
                  key={editingItem?.id || "new-author"} // <-- Adding this key fixes the issue!
                  initialData={editingItem}
                  onSubmit={(data) => saveAuthorMutation.mutate(data)}
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
                            Awards: {author.awards || "None"}
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
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    birth_year: initialData?.birth_year || "",
    death_year: initialData?.death_year || "",
    education: initialData?.education || "",
    awards: initialData?.awards || "",
    description: initialData?.description || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Extract just the year (e.g., "2025") from the date string ("2025-12-17")
    const payload = {
      ...formData,
      birth_year: formData.birth_year
        ? parseInt(formData.birth_year.split("-")[0])
        : null,
      death_year: formData.death_year
        ? parseInt(formData.death_year.split("-")[0])
        : null,
    };

    onSubmit(payload);
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

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birth Date
          </label>
          <input
            name="birth_year"
            type="date"
            value={formData.birth_year}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Death Date
          </label>
          <input
            name="death_year"
            type="date"
            value={formData.death_year}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Awards
          </label>
          <input
            name="awards"
            value={formData.awards}
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

/* --- WORK FORM SUB-COMPONENT (Handles Relationships & Photos) --- */
function WorkForm({ initialData, authorsList, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    typology: initialData?.typology || "",
    city: initialData?.city || "",
    region: initialData?.region || "",
    year_start: initialData?.year_start || "",
    year_end: initialData?.year_end || "",
    author_id: initialData?.authors?.[0]?.id || "",
    role: initialData?.authors?.[0]?.role || "",
    photo_url: initialData?.photos?.[0]?.url || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      authors: formData.author_id
        ? [{ author_id: formData.author_id, role: formData.role }]
        : [],
      photos: formData.photo_url ? [{ url: formData.photo_url }] : [],
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="grid md:grid-cols-4 gap-4">
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

      {/* Relationship Management Field */}
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

      {/* Photo Management Field */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Work Photo</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo Image URL
          </label>
          <input
            name="photo_url"
            value={formData.photo_url}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
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
