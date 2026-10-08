import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AuthorsTiles from "./AuthorsTiles";
import WorksTiles from "./WorksTiles";
import Filter from "../components/Filter";
import Navbar from "../shared/Navbar";

export default function FilterPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedPage, setSelectedPage] = useState("works");

  const [filters, setFilters] = useState({
    title: searchParams.get("title") || "",
    typology: searchParams.get("typology") || "",
    awards: searchParams.get("awards") || "",
    author: searchParams.get("author") || "",
    region: searchParams.get("region") || "",
    yearStart: searchParams.get("yearStart")
      ? Number(searchParams.get("yearStart"))
      : null,
    yearEnd: searchParams.get("yearEnd")
      ? Number(searchParams.get("yearEnd"))
      : null,
  });

  console.log("filters", filters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Update URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      // Don't put empty/default values into the URL
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  }, [filters, setSearchParams]);

  return (
    <div>
      <Navbar />

      <div className="p-8 space-y-6">
        <Filter
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          filters={filters}
          updateFilter={updateFilter}
        />
      </div>

      {selectedPage === "works" && <WorksTiles filters={filters} />}

      {selectedPage === "authors" && <AuthorsTiles filters={filters} />}
    </div>
  );
}
