import "../../assets/styles/_modalFeed.scss";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Reply from "./Reply";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { wouteAPI } from "../../api";

function ModalFeed({ wouteFeeds, setLoading, user }) {
  const { id } = useParams();
  const feedId = id;
  const [feedData, setFeedData] = useState([]);

  useEffect(() => {
    const fetchFeedData = async () => {
      try {
        const response = await wouteAPI(`/p/${id}`, "GET");
        setFeedData(response.data);
      } catch (error) {
        console.error("피드 데이터 불러오기 실패:", error);
      }
    };
    fetchFeedData();
  }, [id]);

  useEffect(() => {
  }, [feedData]);
  return (
    <div className="myfeed">
      <div className="feedImg">
        <Swiper
          navigation={true}
          pagination={{ dynamicBullets: true }}
          modules={[Pagination, Navigation]}
        >
          {feedData?.attaches?.map((item) => (
            <SwiperSlide key={item.uuid}>
              <img src={ `${process.env.REACT_APP_IMAGE_PATH}${item.uuid}` } alt='' />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Reply feedData={feedData} wouteFeeds={ wouteFeeds } setLoading={ setLoading } user={ user } />
    </div>
  );
}

export default ModalFeed;