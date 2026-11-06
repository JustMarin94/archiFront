import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";
import Navbar from "../shared/Navbar";
import WorkManagement from "../components/WorkManagement";
import AuthorManagement from "../components/AuthorManagement";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("works"); // "works" or "authors"

  // Fetch authors here so we can pass them into WorkManagement for the select dropdown
  const { data: authors = [] } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/authors`);
      return res.data;
    },
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
              onClick={() => setActiveTab("works")}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === "works"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Manage Works
            </button>
            <button
              onClick={() => setActiveTab("authors")}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                activeTab === "authors"
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Manage Authors
            </button>
          </div>

          {/* Render Tab Contents */}
          {activeTab === "works" && <WorkManagement authors={authors} />}
          {activeTab === "authors" && <AuthorManagement />}
        </div>
      </div>
    </>
  );
}
