import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchAuthors = async () => {
  const response = await axios.get("http://localhost:3000/authors/names");

  return response.data;
};

export default function AuthorsFilter({ selectedAuthor, setSelectedAuthor }) {
  const { data: authors = [] } = useQuery({
    queryKey: ["authorNames"],
    queryFn: fetchAuthors,
  });

  return (
    <div className=" p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Author filter</h2>

      <select
        value={selectedAuthor}
        onChange={(e) => setSelectedAuthor(e.target.value)}
        className="bg-white border rounded-lg px-4 py-2 min-w-64"
      >
        <option value="">All authors</option>

        {authors.map((author) => (
          <option key={author} value={author}>
            {author}
          </option>
        ))}
      </select>
    </div>
  );
}
