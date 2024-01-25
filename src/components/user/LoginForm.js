import { PostLogin } from "../../api";
import { useState } from "react";
import FindPwModal from "./FindPwModal";
import { useNavigate } from "react-router-dom";
function Loginform({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const openModalHandler = () => {
    setIsOpen(!isOpen);
  };
  const closeModalHandler = () => {
    setIsOpen(false);
  };
  const emailHandle = (e) => {
    setEmail(e.currentTarget.value);
  };
  const passwordHandle = (e) => {
    setPassword(e.currentTarget.value);
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    console.log({ email });
    console.log({ password });
    try {
      const response = await PostLogin({ email: email, password: password });
      console.log("Login successful:", response);

      // 로그인 성공 시 onLogin 호출
      onLogin(localStorage.getItem("ACCESS_TOKEN"));
    } catch (error) {
      console.error("Login failed:", error);

      // 에러 처리 로직 추가
    }
  };

  return (
    <>
      <div className="logform-position">
        <form onSubmit={handlesubmit}>
          <div className="logform-input">
            <input
              className="log-input-email"
              value={email}
              onChange={emailHandle}
              type="text"
              placeholder="이메일"
            />
            <button className="email-button"></button>
          </div>
          <div className="logform-input">
            <input
              className="log-input-pw"
              type="password"
              value={password}
              onChange={passwordHandle}
              placeholder="비밀번호"
            />
            <button className="pw-button"></button>
          </div>
          <p className="guest">
            이메일: guest@woute.com<br />비밀번호: guest42!
          </p>
          <div className="btn-position">
            <button className="log-btn" type="submit">
              로그인
            </button>
          </div>
        </form>
      </div>
      <div className="log-find">
        <button className="find-btn" onClick={openModalHandler}>
          비밀번호 찾기
        </button>
        {isOpen ? <FindPwModal closeModal={closeModalHandler} /> : null}
      </div>
    </>
  );
}
export default Loginform;
