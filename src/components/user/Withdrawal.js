import { useEffect } from "react";
import "../../assets/styles/_withdramodal.scss";
import WithdraIndex from "./Withdraindex";
function Withdrawal({ closeModal, user }) {
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
    <div className="with-modal">
      <div className="inner">
        <button className="close" onClick={handleClose}>
          닫기
        </button>
        <WithdraIndex onCloseModal={closeModal} user={user} />
      </div>
    </div>
  );
}

export default Withdrawal;
