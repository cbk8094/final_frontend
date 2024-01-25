import { useEffect, useRef, useState } from "react";
import "../../assets/styles/_modifypro.scss";
import UserModal from "./UserModal";
import Withdrawal from "./Withdrawal";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import imageCompression from 'browser-image-compression'

function Modifyprofile({ user, fetchUserData, wouteFeeds }) {
  const [isEditing, setEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isInEditing, setInEditing] = useState(false);
  const [intro, setIntro] = useState("");
  const [file, setFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [UUID, setUUID] = useState(null);
  const [viewImage, setViewImage] = useState(true);
  const [userNo, setUserNo] = useState("");

  useEffect(() => {
    console.log("이메일 : " + user.email);
    // const fetchImage = async () => {
    //   try {
    //     const response = await axios.get(`/user/file/${UUID}`, {
    //       responseType: "arraybuffer",
    //     });

    //     if (response.data) {
    //       const blob = new Blob([response.data], {
    //         type: response.headers["content-type"],
    //       });

    //       // const imageUrl = URL.createObjectURL(blob);
    //     }
    //   } catch (error) {
    //     console.error("Error fetching image:", error);
    //     setViewImage(false);
    //   }
    // };

    // if (UUID) {
    //   fetchImage();
    // }
    // console.log("user" + user.profileImage);
    const imageUrl = user.profileImage;
    // console.log("유저 get :" + imageUrl);
    setUserNo(user.id);
    setSelectedImage(imageUrl);
    setViewImage(true);
  }, [user]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.post(
  //         `/users/uuid/${userNo}`,
  //         {},
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       const uuidObject = response.data;

  //       // 객체의 첫 번째 속성 값만 가져오기
  //       const firstPropertyValue = Object.values(uuidObject)[0];

  //       // 가져온 값을 문자열로 변환
  //       const uuidString = String(firstPropertyValue);
  //       // console.log("리스폰" + response.data);
  //       // console.log("첫번째값", uuidString);
  //       setUUID(uuidString);
  //     } catch (error) {
  //       console.error("Error fetching UUID:", error);
  //       console.error(
  //         "Error details:",
  //         error.response || error.message || error
  //       );
  //     }
  //   };

  //   fetchData();
  // }, [UUID]);

  useEffect(() => {
    if (selectedImage !== null) {
      setViewImage(true);
    }
  }, [UUID]);

  const handleNEditClick = () => {
    setEditing(true);
  };

  const handleNSaveClick = async () => {
    toast.success('닉네임이 수정되었습니다.')
    // alert(`닉네임이 수정되었습니다.`);
    user.nickname = nickname;
    console.log(user.nickname);
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/modifyprofile/nickname/${userNo}`, {
        nickname: user.nickname,
      });
      console.log(response.data);
      setEditing(false);
      return response.data;
    } catch (error) {
      console.error(error);
    }
    setEditing(false);
  };

  const logoutHandler = (e) => {
    alert("로그아웃되었습니다.");
    localStorage.clear();
    window.location.reload();
  };

  const handleNInputChange = (e) => {
    setNickname(e.target.value);
  };

  const handleInEditClick = () => {
    setInEditing(true);
  };

  const handleInSaveClick = async () => {
    toast.success('자기소개가 수정되었습니다.')
    //alert(`자기소개가 수정되었습니다.`);
    user.introduction = intro;
    console.log(user.introduction);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BASE_URL}/modifyprofile/introduction/${userNo}`,
        {
          introduction: user.introduction,
        }
      );
      console.log(response.data);
      setInEditing(false);
      return response.data;
    } catch (error) {
      console.error(error);
    }
    setInEditing(false);
    fetchUserData()
  };

  const handleInInputChange = (e) => {
    setIntro(e.target.value);
  };

  const [isOpen, setIsOpen] = useState(false);

  const openModalHandler = () => {
    setIsOpen(!isOpen);
  };

  const closeModalHandler = () => {
    setIsOpen(false);
  };

  const [isOpen2, setIsOpen2] = useState(false);

  const openModalHandler2 = () => {
    setIsOpen2(!isOpen2);
  };

  const closeModalHandler2 = () => {
    setIsOpen2(false);
  };

  const handleImageChange = async (e) => {
    const selectedFile = e.target.files[0];
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 200,
    }

    try{
      const compressed = await imageCompression(selectedFile, options)
      const compressedFile = new File([compressed], selectedFile.name, { type: selectedFile.type })
      
      if (compressedFile) {
        setFile(compressedFile);
        const imageUrl = URL.createObjectURL(compressedFile);
        setSelectedImage(imageUrl);
  
        const formData = new FormData();
        formData.append("file", compressedFile);
  
        uploadProfileImage(formData);
      }
    } catch(err) {
      console.log(err)
    }    
  };

  const inputRef = useRef(null);

  const handlePicButtonClick = () => {
    inputRef.current.click();
    // console.log(user.id);
  };

  const uploadProfileImage = async (formData) => {
    console.log(userNo);
    try {
      // console.log("폼데이터 : " + formData);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/uploadprofileimage/${userNo}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("온 데이터", response.data);

      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
      toast.success('프로필 사진이 변경되었습니다.')
      fetchUserData()
      wouteFeeds()
      // 이미지가 업로드 성공 후 호출
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="modify-main">
        <div className="modify-profile">
          <div className="modify-form">
            <div className="button-position">
              <Link to={`/users/${userNo}`}>
                <div></div>
                <span>프로필</span>
              </Link>
            </div>
            <div className="edit-picture">
              <div
                className="picture"
                style={{
                  backgroundImage: viewImage
                    ? `url(${selectedImage})`
                    : `url(null)`,
                }}
              ></div>
              <input
                ref={inputRef}
                className="picture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            <div>
              <button onClick={handlePicButtonClick}>사진수정</button>
            </div>
          </div>
          <ul className="modify-content">
            <li>
              <span className="email-icon"></span>e-mail
            </li>
            <div className="modify-input-position">
              <span className="email-input">{user.email}</span>
            </div>

            <li>
              <span className="nick-icon"></span>닉네임
            </li>
            <div className="modify-input-position">
              {isEditing ? (
                <>
                  <input
                    className="nick-input-edit"
                    value={nickname}
                    placeholder={user.nickname}
                    onChange={handleNInputChange}
                  />
                  <button className="save-button" onClick={handleNSaveClick}>
                    저장
                  </button>
                </>
              ) : (
                <>
                  <span className="nick-input">{user.nickname}</span>
                  <button className="edit-button" onClick={handleNEditClick}>
                    수정
                  </button>
                </>
              )}
            </div>

            <li>
              <span className="intro-icon"></span>소개내용
            </li>
            <div className="modify-input-position">
              {isInEditing ? (
                <>
                  <input
                    className="intro-input-edit"
                    value={intro}
                    placeholder={user.introduction}
                    onChange={handleInInputChange}
                  />
                  <button className="save-button" onClick={handleInSaveClick}>
                    저장
                  </button>
                </>
              ) : (
                <>
                  <span className="intro-input">{user.introduction}</span>
                  <button className="edit-button" onClick={handleInEditClick}>
                    수정
                  </button>
                </>
              )}
            </div>
          </ul>
          <button className="pw-change" onClick={openModalHandler}>
            비밀번호 변경
          </button>
          {isOpen ? (
            <UserModal closeModal={closeModalHandler} user={user} />
          ) : null}
          <button className="withdrawal" onClick={openModalHandler2}>
            회원탈퇴
          </button>
          {isOpen2 ? (
            <Withdrawal closeModal={closeModalHandler2} user={user} />
          ) : null}
          <button className="logout" onClick={logoutHandler}>
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}

export default Modifyprofile;
