import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";

export default function CarouselSection({
  title,
  description,
  items = [],
  renderImage,
  renderTitle,
}) {
  console.log("CarouselSection items:", items);
  return (
    <section className="bg-white py-20">
      <div className="text-center max-w-5xl mx-auto mb-16 px-6">
        <h2 className="text-7xl font-black">
          {items.length} {title}
        </h2>

        <p className="mt-6 text-xl">{description}</p>
      </div>

      <div className="px-12">
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={30}
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
          {items.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="h-100 overflow-hidden">
                <img
                  src={renderImage(item)}
                  alt={item.alt_text || item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {renderTitle && (
                <h3 className="text-xl font-bold mt-4">{renderTitle(item)}</h3>
              )}
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
            hover:bg-gray-800
          "
        >
          + {title}
        </Link>
      </div>
    </section>
  );
}
