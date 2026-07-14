import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const fetchAuthors = async () => {
  const response = await axios.get("http://localhost:3000/authors");

  return response.data;
};

export default function AuthorsCarousel() {
  const { data: authors = [], isLoading } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAuthors,
  });

  if (isLoading) {
    return <div>Loading authors...</div>;
  }

  return (
    <section className="bg-white py-20">
      <div className="text-center max-w-5xl mx-auto mb-16">
        <h2 className="text-7xl font-black">{authors.length} AUTHORS</h2>

        <p className="mt-6 text-xl">
          Discover the architects behind the projects and explore their
          contribution to architectural heritage.
        </p>
      </div>

      <div className="px-12">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={30}
          slidesPerView={4}
          loop
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 4,
            },
          }}
        >
          {authors.map((author) => (
            <SwiperSlide key={author.id}>
              <div className="h-[400px] overflow-hidden">
                <img
                  src={author.photo_url}
                  alt={author.alt_text}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              </div>

              <h3 className="text-xl font-bold mt-4">{author.full_name}</h3>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex justify-center mt-12">
        <Link
          to="/filter"
          className="
            bg-black
            text-white
            px-10
            py-5
            font-bold
            text-xl
          "
        >
          + AUTHORS
        </Link>
      </div>
    </section>
  );
}
