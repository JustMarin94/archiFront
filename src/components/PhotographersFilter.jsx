import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchPhotographers = async () => {
  const response = await axios.get("http://localhost:3000/photographers/names");

  return response.data;
};

export default function PhotographersFilter({
  selectedPhotographer,
  setSelectedPhotographer,
}) {
  const { data: photographers = [] } = useQuery({
    queryKey: ["photographerNames"],
    queryFn: fetchPhotographers,
  });

  return (
    <div className=" p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Photographer filter</h2>

      <select
        value={selectedPhotographer}
        onChange={(e) => setSelectedPhotographer(e.target.value)}
        className="bg-white border rounded-lg px-4 py-2 min-w-64"
      >
        <option value="">All photographers</option>

        {photographers.map((photographer) => (
          <option key={photographer} value={photographer}>
            {photographer}
          </option>
        ))}
      </select>
    </div>
  );
}
