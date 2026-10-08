import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchAuthor = async (id) => {
  const response = await api.get(`${BASE_URL}/authors/${id}`);
  return response.data;
};

export default function AuthorDetails() {
  const { id } = useParams();

  const {
    data: author,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["author", id],
    queryFn: () => fetchAuthor(id),
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl">Loading author...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Failed to load author.</h1>
      </div>
    );
  }

  const photo =
    author.photos?.sort((a, b) => a.position - b.position)?.[0] || author;

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Author Image */}
        <img
          src={
            photo.url ||
            author.photo_url ||
            "https://images.unsplash.com/photo-1520587393050-c5298e1a8486?q=80&w=1200&auto=format&fit=crop"
          }
          alt={photo.alt_text || author.full_name}
          className="w-full h-[125] object-cover"
        />

        <div className="p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold">{author.full_name}</h1>

            <p className="text-lg text-gray-600 mt-2">
              {author.birth_year || "Unknown"} –{" "}
              {author.death_year || "Present"}
            </p>

            {(photo.caption || author.caption) && (
              <p className="text-gray-600 mt-4">
                {photo.caption || author.caption}
              </p>
            )}
          </div>

          {/* Biography */}
          {author.description && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Biography</h2>

              <p className="text-gray-700 whitespace-pre-line">
                {author.description}
              </p>
            </div>
          )}

          {/* Information */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Author Information */}
            <div className="rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4">Author Information</h2>

              <div className="space-y-3">
                <p>
                  <span className="font-medium">Full Name:</span>{" "}
                  {author.full_name}
                </p>

                <p>
                  <span className="font-medium">Birth Year:</span>{" "}
                  {author.birth_year || "—"}
                </p>

                <p>
                  <span className="font-medium">Death Year:</span>{" "}
                  {author.death_year || "Still Living"}
                </p>

                <p>
                  <span className="font-medium">Education:</span>{" "}
                  {author.education || "—"}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4">Metadata</h2>

              <div className="space-y-3">
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(author.created_at).toLocaleString()}
                </p>

                <p>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(author.updated_at).toLocaleString()}
                </p>

                <p>
                  <span className="font-medium">Author ID:</span>
                  <br />
                  <span className="text-sm break-all">{author.id}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Awards */}
          {author.awards && (
            <div className="rounded-lg p-5">
              <h2 className="text-2xl font-semibold mb-4">Awards & Honors</h2>

              <p className="text-gray-700 whitespace-pre-line">
                {author.awards}
              </p>
            </div>
          )}

          {/* Photos */}
          {author.photos && author.photos.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Gallery</h2>

              <div className="grid md:grid-cols-2 gap-4">
                {author.photos
                  .sort((a, b) => a.position - b.position)
                  .map((photo) => (
                    <div key={photo.id}>
                      <img
                        src={photo.url}
                        alt={photo.alt_text || author.full_name}
                        className="w-full h-80 object-cover rounded-lg"
                      />

                      <div className="mt-3 space-y-1 text-sm text-gray-600">
                        {photo.caption && (
                          <p>
                            <span className="font-medium">Caption:</span>{" "}
                            {photo.caption}
                          </p>
                        )}

                        {photo.alt_text && (
                          <p>
                            <span className="font-medium">Alt Text:</span>{" "}
                            {photo.alt_text}
                          </p>
                        )}

                        <p>
                          <span className="font-medium">Position:</span>{" "}
                          {photo.position}
                        </p>

                        <p>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(photo.created_at).toLocaleString()}
                        </p>

                        <p>
                          <span className="font-medium">Photo ID:</span>
                          <br />
                          <span className="text-xs break-all">{photo.id}</span>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
