"use client";

import { FreeMode, A11y, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

const Konten = () => {
  return (
    <div className="relative max-w-[1180px] w-full mx-auto h-[310px] mt-7">
      <Swiper
        modules={[FreeMode, A11y, Navigation]}
        spaceBetween={20}
        slidesPerView="auto"
        freeMode={{ enabled: true, sticky: true }}
        centeredSlides
        grabCursor
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="!pb-4 h-full group rounded-xl"
      >
        {["/a.jpeg", "/b.jpeg", "/c.jpeg"].map((img, index) => (
          <SwiperSlide key={index} className="!w-auto !h-auto">
            <div className="flex items-center justify-center h-full">
              <Image
                src={img}
                alt={`Slide ${index + 1}`}
                width={800}
                height={400}
                className="object-cover h-full w-full"
              />
            </div>
          </SwiperSlide>
        ))}

        
        <button
          className="swiper-button-prev arrow-btn left-2 group-hover:opacity-100 group-hover:visible"
        />
        <button
          className="swiper-button-next arrow-btn right-2 group-hover:opacity-100 group-hover:visible"
        />
      </Swiper>
    </div>
  );
};

export default Konten;
