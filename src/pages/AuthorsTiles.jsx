import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchAuthors = async (filters) => {
  const response = await api.get(`${BASE_URL}/authors`, {
    params: {
      title: filters.title || undefined,
      typology: filters.typology || undefined,
      awards: filters.awards || undefined,
      full_name: filters.author || undefined,
      region: filters.region || undefined,
      yearStart: filters.yearStart || undefined,
      yearEnd: filters.yearEnd || undefined,
    },
  });

  return response.data;
};

export default function AuthorsTiles({ filters }) {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith("en");

  const {
    data: authors = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["authors", filters],
    queryFn: () => fetchAuthors(filters),
  });

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl">
          {isEnglish ? "Loading authors..." : "Učitavanje autora..."}
        </h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">
          {isEnglish
            ? "Failed to load authors"
            : "Greška pri učitavanju autora"}
        </h1>
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full p-8">
      {/* AUTHOR COUNT */}
      <div className="w-full p-6 rounded-lg mb-8">
        <h1 className="text-4xl font-semibold">
          {authors.length} {isEnglish ? "Authors" : "Autora"}
        </h1>
      </div>

      {/* AUTHOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {authors.map((author) => {
          const fullName = author.full_name;
          const education = isEnglish
            ? author.education_en || author.education
            : author.education;

          // --- Find main hero photo, fallback to position 0, first photo, or flat author.photo_url ---
          const mainPhoto =
            author.photos?.find((photo) => photo.is_main) ||
            author.photos?.find((photo) => photo.position === 0) ||
            author.photos?.[0];

          const imageUrl =
            mainPhoto?.url ||
            author.photo_url ||
            "https://images.unsplash.com/photo-1708534317455-0d32d06dad4b?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";

          const imageAlt = mainPhoto?.alt_text || author.alt_text || fullName;

          return (
            <Link
              key={author.id}
              to={`/authors/${author.id}`}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition block"
            >
              <img
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-64 object-cover"
              />

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-3">{fullName}</h2>

                <div className="text-sm text-gray-500">
                  <p>
                    {author.birth_year}
                    {author.death_year
                      ? ` – ${author.death_year}`
                      : ` – ${isEnglish ? "Present" : "Danas"}`}
                  </p>

                  {education && (
                    <p className="mt-2 text-gray-600">{education}</p>
                  )}

                  {(mainPhoto?.caption || author.caption) && (
                    <p className="mt-2 text-gray-600">
                      {mainPhoto?.caption || author.caption}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
