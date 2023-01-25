import { useState } from "react";

import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import styled from "styled-components";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const StyledSwiper = styled(Swiper)`
  padding: 5rem 0;
  .swiper-button-next,
  .swiper-button-prev {
    color: #005c0e;
  }
  .swiper-button-next {
    background-color: #007b23;
    mask-image: url("/images/chevron-left.svg");
    mask-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
  }
  .swiper-button-prev {
    background-color: #007b23;
    mask-image: url("/images/chevron-right.svg");
    mask-repeat: no-repeat;
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center;
  }

  .swiper-button-next::after {
    display: none;
  }
  .swiper-button-prev::after {
    display: none;
  }

  svg {
    fill: #005c0e !important;
  }
`;

const withSwiper = (WrappedComponent) => {
  const WithSwiper = ({ items, ...props }) => {
    return (
      <StyledSwiper
        dir="rtl"
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 40,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        // autoplay={{
        //   delay: 2500,
        //   disableOnInteraction: false,
        //   pauseOnMouseEnter: true,
        // }}
        navigation
        className="lg:!-mx-16 xl:!-mx-8"
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log("slide change")}
      >
        {items.map((item) => (
          <SwiperSlide key={item._id}>
            <WrappedComponent {...item} {...props} />
          </SwiperSlide>
        ))}
      </StyledSwiper>
    );
  };
  WithSwiper.displayName = `WithSwiper(${getDisplayName(WrappedComponent)})`;
  return WithSwiper;
};

export default withSwiper;

const getDisplayName = (WrappedComponent) => {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
};
