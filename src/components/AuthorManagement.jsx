import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AuthorManagement() {
  const [editingItem, setEditingItem] = useState(null);
  const queryClient = useQueryClient();

  const fetchAuthors = async () => {
    const res = await api.get(`${BASE_URL}/authors`);
    return res.data;
  };

  const { data: authors = [], isLoading: loadingAuthors } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });

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

  return (
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
                if (resetForm) resetForm();
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
            {authors.map((author) => {
              const isEditing = editingItem?.id === author.id;

              return (
                <div
                  key={author.id}
                  className={`p-4 flex items-center justify-between transition-colors ${
                    isEditing
                      ? "bg-blue-50 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {author.full_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Awards:{" "}
                      {Array.isArray(author.awards) && author.awards.length > 0
                        ? author.awards.map((a) => a.title).join(", ")
                        : typeof author.awards === "string" && author.awards
                          ? author.awards
                          : "None"}
                    </p>
                  </div>
                  <div className="space-x-3">
                    <button
                      onClick={() => {
                        setEditingItem(author);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this author?",
                          )
                        ) {
                          deleteAuthorMutation.mutate(author.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
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

    // Safely parse awards whether they are in an array, relation, or missing
    awards:
      Array.isArray(initialData?.awards) && initialData?.awards.length > 0
        ? initialData.awards
        : Array.isArray(initialData?.author_awards) &&
            initialData?.author_awards.length > 0
          ? initialData.author_awards
          : [{ title: "", year: "", description: "" }],

    // Normalize photos whether returned as an array or as flat properties from the API
    photos: (() => {
      if (Array.isArray(initialData?.photos) && initialData.photos.length > 0) {
        return initialData.photos.map((p) => ({
          url: p.url || p.photo_url || "",
          caption: p.caption || "",
          alt_text: p.alt_text || "",
          position: p.position !== undefined ? p.position : 0,
          is_main: Boolean(p.is_main), // <--- Normalize is_main
        }));
      }
      // Handle flat photo structure returned by your backend endpoint
      if (initialData?.photo_url) {
        return [
          {
            url: initialData.photo_url,
            caption: initialData.caption || "",
            alt_text: initialData.alt_text || "",
            position:
              initialData.position !== undefined ? initialData.position : 0,
            is_main: Boolean(initialData.is_main), // <--- Normalize is_main
          },
        ];
      }
      return [
        { url: "", caption: "", alt_text: "", position: 0, is_main: false },
      ];
    })(),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const handlePhotoChange = (index, field, value) => {
    const updatedPhotos = [...formData.photos];
    if (field === "is_main" && value === true) {
      // If setting this photo as main, turn off is_main for all other photos
      updatedPhotos.forEach((photo, i) => {
        photo.is_main = i === index;
      });
    } else {
      updatedPhotos[index][field] = value;
    }

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
      awards: formData.awards
        .filter((a) => a.title && a.title.trim() !== "")
        .map((a) => ({
          ...a,
          year: a.year ? parseInt(a.year, 10) : null,
        })),
      photos: formData.photos
        .filter((p) => p.url && p.url.trim() !== "")
        .map((p) => ({
          ...p,
          position: p.position !== "" ? parseInt(p.position, 10) : 0,
          is_main: Boolean(p.is_main),
        })),
    };

    onSubmit(payload, () => {
      setFormData({
        full_name: "",
        birth_year: "",
        death_year: "",
        education: "",
        description: "",
        awards: [{ title: "", year: "", description: "" }],
        photos: [{ url: "", caption: "", alt_text: "", position: 0 }],
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
        </div>

        <div className="space-y-4">
          {formData.photos.map((photo, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 relative"
            >
              <div className="grid md:grid-cols-5 gap-3 items-end">
                <div className="md:col-span-2">
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
                <div className="flex items-center h-10 space-x-2">
                  <input
                    type="checkbox"
                    id={`is_main_${index}`}
                    checked={photo.is_main || false}
                    onChange={(e) =>
                      handlePhotoChange(index, "is_main", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`is_main_${index}`}
                    className="text-xs font-semibold text-gray-700 cursor-pointer"
                  >
                    Main Hero Photo
                  </label>
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
