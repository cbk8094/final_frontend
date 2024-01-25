import { useEffect } from "react";
import "../../assets/styles/_findpwmodal.scss";
import FindPw from "./FindPw";
function FindPwModal({ closeModal }) {
  const handleClose = () => {
    closeModal(); // 모달 닫기 함수 호출
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div className="user-modal">
      <div className="inner">
        <button className="close" onClick={handleClose}>
          닫기
        </button>
        <FindPw onCloseModal={closeModal} />
      </div>
    </div>
  );
}

export default FindPwModal;
