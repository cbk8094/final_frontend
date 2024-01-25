import { useEffect } from "react";
import "../../assets/styles/_usermodal.scss";
import ChangePw from "./../user/ChangePw";
function UserModal({ closeModal, user }) {
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
        <ChangePw onCloseModal={closeModal} user={user} />
      </div>
    </div>
  );
}

export default UserModal;
