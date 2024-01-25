import React, { useState, useEffect } from "react";
import "./../../assets/styles/_modalAddFeed.scss";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { wouteAPI } from "./../../api";
import imageCompression from "browser-image-compression";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ModalAddFeed({ type, wouteFeeds, setLoading, user }) {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [spot, setSpot] = useState([]);
  const handleContent = (e) => {
    let value = e.target.value;
    setContent(value);
  };
  const handleFileChange = async (e) => {
    const imageFiles = e.target.files;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 600,
    };

    try {
      const compressedFiles = [];
      for (const file of imageFiles) {
        const compressedBlob = await imageCompression(file, options);
        const compressedFile = new File([compressedBlob], file.name, {
          type: file.type,
        });
        compressedFiles.push(compressedFile);
        console.log(compressedFile);
      }
      if (imageFiles.length === 0) return;
      const resolveAfter3Sec = new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );
      toast.promise(resolveAfter3Sec, {
        pending: "이미지 등록 중입니다.",
        success: "이미지 등록이 완료되었습니다.",
        error: "이미지 등록에 실패하였습니다.",
      });
      const newFiles = [...files, ...compressedFiles];
      setFiles(newFiles);
      setTimeout(() => {
        generatePreviews(compressedFiles);
      }, 600);
      // generatePreviews(imageFiles);
    } catch (error) {
      console.log(error);
    }
  };

  const generatePreviews = (imageFiles) => {
    const newPreviews = Array.from(imageFiles).map((imageFile) =>
      URL.createObjectURL(imageFile)
    );
    setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const handleImgDelete = (idx) => {
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== idx));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== idx));
    URL.revokeObjectURL(previews[idx]);
  };

  const isMaxImagesReached = previews.length >= 5;

  const postSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      toast.warn("사진을올려주세요.");
      return;
    }
    if (!title.trim()) {
      toast.warn("제목을입력해주세요.");
      return;
    }
    if (!content.trim()) {
      toast.warn("내용을입력해주세요.");
      return;
    }
    const formData = new FormData();
    let reg = /#([\S]+)/gim;
    let matches = content.match(reg) || [];

    let feed = {
      userId: user.id,
      nickname: user.nickname,
      profileImage: user.profileImage,
      type: type,
      title: title,
      content: content,
      hashtag: "",
      heartCount: 0,
    };

    for (let file of files) {
      formData.append("attaches", file);
    }

    formData.append(
      "feed",
      new Blob([JSON.stringify(feed)], { type: "application/json" })
    );
    formData.append(
      "tags",
      new Blob([JSON.stringify(matches)], { type: "application/json" })
    );

    let coursesData = [];
    for (let s of spot) {
      coursesData.push({
        code: s.id,
        store: s.place_name,
        address: s.road_address_name,
        phone: s.phone,
        homepage: s.place_url,
        category: s.category_group_name,
        latitude: s.y,
        longitude: s.x,
      });
    }

    formData.append(
      "courses",
      new Blob([JSON.stringify(coursesData)], { type: "application/json" })
    );

    try {
      await wouteAPI("/p", "POST", formData);
      toast.success("피드 등록 완료");
      setLoading(false);
      wouteFeeds();
      navigate("/");
    } catch (error) {}
  };

  return (
    <div className="addFeed">
      <div className="feedImg">
        <Swiper
          navigation={true}
          pagination={{ dynamicBullets: true }}
          modules={[Pagination, Navigation]}
        >
          {previews.map((src, i) => (
            <SwiperSlide key={i}>
              <img
                src={src}
                alt={`Slide Preview ${i}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="feedRecord">
        <div className="feedRecordinner">
          <div className="recordImg">
            {previews.length > 0 && (
              <ul style={{ display: "flex" }}>
                {previews.map((src, i) => (
                  <li key={i}>
                    <img src={src} alt={`Preview ${i}`} />
                    <i onClick={() => handleImgDelete(i)}></i>
                  </li>
                ))}
              </ul>
            )}
            {!isMaxImagesReached && (
              <div
                className="addIcon"
                onClick={() => document.getElementById("fileInput").click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  name="image"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>
          <div className="feedTitle">
            <input
              name="title"
              placeholder="타이틀을 입력하세요"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          <div className="feedContent">
            <textarea
              name="content"
              placeholder="#을이용하여태그를이용해보세요"
              onChange={handleContent}
            ></textarea>
          </div>

          <div className="feedBtn">
            <button type="submit" onClick={postSubmit}>
              피드기록하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalAddFeed;