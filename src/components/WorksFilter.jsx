import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchWorkTitles = async () => {
  const response = await axios.get("http://localhost:3000/works/titles");

  return response.data;
};

export default function WorksFilter({ selectedWork, setSelectedWork }) {
  const { data: works = [] } = useQuery({
    queryKey: ["workTitles"],
    queryFn: fetchWorkTitles,
  });

  return (
    <div className=" p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Work filter</h2>

      <select
        value={selectedWork}
        onChange={(e) => setSelectedWork(e.target.value)}
        className="bg-white border rounded-lg px-4 py-2 min-w-64"
      >
        <option value="">All works</option>

        {works.map((work) => (
          <option key={work} value={work}>
            {work}
          </option>
        ))}
      </select>
    </div>
  );
}
