import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AuthorsTiles from "./AuthorsTiles";
import WorksTiles from "./WorksTiles";
import Filter from "../components/Filter";
import { api } from "../api/client";

const BASE_URL = import.meta.env.VITE_BASE_URL;

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

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Fetch counts so we can display them in the filter buttons immediately
  const { data: works = [] } = useQuery({
    queryKey: ["works", filters],
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/works`, { params: filters });
      return res.data;
    },
  });

  const { data: authors = [] } = useQuery({
    queryKey: ["authors", filters],
    queryFn: async () => {
      const res = await api.get(`${BASE_URL}/authors`, {
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
      return res.data;
    },
  });

  // Update URL whenever filters change
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        params.set(key, value);
      }
    });

    setSearchParams(params);
  }, [filters, setSearchParams]);

  return (
    <div>
      <div className="p-8 space-y-6">
        <Filter
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          filters={filters}
          updateFilter={updateFilter}
          worksCount={works.length}
          authorsCount={authors.length}
        />
      </div>

      {selectedPage === "works" && <WorksTiles filters={filters} />}

      {selectedPage === "authors" && <AuthorsTiles filters={filters} />}
    </div>
  );
}
