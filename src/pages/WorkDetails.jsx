import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const fetchWork = async (id) => {
  const response = await axios.get(`http://localhost:3000/works/${id}`);
  return response.data;
};

export default function WorkDetails() {
  const { id } = useParams();

  const {
    data: work,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["work", id],
    queryFn: () => fetchWork(id),
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl">Loading project...</h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="text-2xl text-red-500">Failed to load project.</h1>
      </div>
    );
  }

  const lat = Number(work.latitude);
  const lng = Number(work.longitude);

  return (
    <div className="min-h-screen  py-10">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Project Images */}
        {work.photos && work.photos.length > 0 && (
          <div className="grid md:grid-cols-2 gap-4 p-4">
            {work.photos
              .sort((a, b) => a.position - b.position)
              .map((photo) => (
                <img
                  key={photo.id}
                  src={`${photo.url}?q=80&w=1200&auto=format&fit=crop`}
                  alt={photo.alt_text || work.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ))}
          </div>
        )}

        <div className="p-8 space-y-8">
          {/* Project Description */}
          <div>
            <h1 className="text-4xl font-bold mb-2">{work.title}</h1>

            <p className="text-gray-600 text-lg">{work.description}</p>
          </div>

          {/* Project Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className=" rounded-lg p-5">
              <h2 className="font-semibold text-lg mb-4">
                Project Information
              </h2>

              <div className="space-y-3">
                <p>
                  <span className="font-medium">Category:</span> {work.category}
                </p>

                <p>
                  <span className="font-medium">Typology:</span> {work.typology}
                </p>

                <p>
                  <span className="font-medium">Address:</span> {work.address}
                </p>

                <p>
                  <span className="font-medium">City:</span> {work.city}
                </p>

                <p>
                  <span className="font-medium">Country:</span> {work.country}
                </p>
              </div>
            </div>

            <div className=" rounded-lg p-5">
              <h2 className="font-semibold text-lg mb-4">Coordinates</h2>

              <div className="space-y-3">
                <p>
                  <span className="font-medium">Latitude:</span> {lat}
                </p>

                <p>
                  <span className="font-medium">Longitude:</span> {lng}
                </p>

                <p>
                  <span className="font-medium">Created:</span>{" "}
                  {new Date(work.created_at).toLocaleString()}
                </p>

                <p>
                  <span className="font-medium">Updated:</span>{" "}
                  {new Date(work.updated_at).toLocaleString()}
                </p>

                <p>
                  <span className="font-medium">Author ID:</span>
                  <br />
                  <span className="text-sm break-all">{work.author_id}</span>
                </p>

                <p>
                  <span className="font-medium">Work ID:</span>
                  <br />
                  <span className="text-sm break-all">{work.id}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Captions */}
          {work.photos && work.photos.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Gallery</h2>

              <div className="space-y-3">
                {work.photos.map((photo) => (
                  <p key={photo.id} className="text-gray-600">
                    <span className="font-medium">{photo.caption}:</span>{" "}
                    {photo.alt_text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Location Map */}
          {!isNaN(lat) && !isNaN(lng) && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-4">Location</h2>

              <div className="rounded-xl overflow-hidden shadow-lg">
                <MapContainer
                  center={[lat, lng]}
                  zoom={15}
                  style={{
                    height: "500px",
                    width: "100%",
                  }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}.png"
                  />

                  <Marker position={[lat, lng]}>
                    <Popup>
                      <div>
                        <h3 className="font-bold">{work.title}</h3>

                        <p>
                          {work.city}, {work.country}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
