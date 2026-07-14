import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const fetchPhotographer = async (id) => {
  const response = await axios.get(`${BASE_URL}/photographers/${id}`);
  return response.data;
};

export default function PhotographerDetails() {
  const { id } = useParams();

  const {
    data: photographer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["photographer", id],
    queryFn: () => fetchPhotographer(id),
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl">Loading photographer...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Failed to load photographer.</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Photographer Image */}
        <img
          src={
            photographer.photo_url ||
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
          }
          alt={photographer.alt_text || photographer.full_name}
          className="w-full h-[500px] object-cover"
        />

        <div className="p-8 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold">{photographer.full_name}</h1>

            <p className="text-lg text-gray-600 mt-2">
              Born {photographer.birth_year}
            </p>

            {photographer.birth_place && (
              <p className="text-gray-600 mt-1">{photographer.birth_place}</p>
            )}

            {photographer.biography && (
              <p className="text-gray-600 mt-4">{photographer.biography}</p>
            )}
          </div>

          {/* Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className=" rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4">
                Photographer Information
              </h2>

              <div className="space-y-3">
                <p>
                  <span className="font-medium">Full Name:</span>{" "}
                  {photographer.full_name}
                </p>

                <p>
                  <span className="font-medium">Birth Year:</span>{" "}
                  {photographer.birth_year}
                </p>

                <p>
                  <span className="font-medium">Birth Place:</span>{" "}
                  {photographer.birth_place}
                </p>

                <p>
                  <span className="font-medium">Biography:</span>{" "}
                  {photographer.biography}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className=" rounded-lg p-5">
              <h2 className="text-xl font-semibold mb-4">Metadata</h2>

              <div className="space-y-3">
                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(photographer.created_at).toLocaleString()}
                </p>

                <p>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(photographer.updated_at).toLocaleString()}
                </p>

                <p>
                  <span className="font-medium">Photographer ID:</span>
                  <br />

                  <span className="text-sm break-all">{photographer.id}</span>
                </p>

                <p>
                  <span className="font-medium">Image ID:</span>
                  <br />

                  <span className="text-sm break-all">
                    {photographer.image_id}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Image Information */}
          <div className=" rounded-lg p-5">
            <h2 className="text-xl font-semibold mb-4">Image Information</h2>

            <div className="space-y-3">
              <p>
                <span className="font-medium">Caption:</span>{" "}
                {photographer.caption || "-"}
              </p>

              <p>
                <span className="font-medium">Alt Text:</span>{" "}
                {photographer.alt_text || "-"}
              </p>

              <p>
                <span className="font-medium">Position:</span>{" "}
                {photographer.position}
              </p>

              <p>
                <span className="font-medium">Image Created:</span>{" "}
                {new Date(photographer.image_created_at).toLocaleString()}
              </p>

              {photographer.photographer_id && (
                <p>
                  <span className="font-medium">Photographer ID:</span>{" "}
                  {photographer.photographer_id}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
