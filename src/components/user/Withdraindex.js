import { useEffect, useState } from "react";
import "../../assets/styles/_withdraindex.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function WithdraIndex({ onCloseModal, user }) {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [lock, setLock] = useState(false);
  const navigate = useNavigate();
  // 비밀번호 일치여부 확인 로직 필요
  // 계정삭제 로직 필요
  const handlePasswordChange = (e, setPassword) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (password2 && newPassword !== password2) {
      setErrorMessage("비밀번호와 일치하지 않습니다.");
    } else {
      setErrorMessage("");
    }
  };
  const emailChange = (e, setEmail) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };
  const handlePassword2Change = (e) => {
    const newPassword = e.target.value;
    setPassword2(newPassword);

    if (password2 && newPassword !== password1) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorMessage("");
    }
  };
  const checkPass = async (e) => {
    e.preventDefault();
    console.log("확인 보내는 pw:" + password1);
    console.log("id" + user.id);
    try {
      const response = await axios.post(
        `/modifyprofile/checkPw/${user.id}`,
        { password: password1 },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      if (response.data === "Y") {
        alert("비밀번호가 확인되었습니다.");
        setLock(true);
      } else {
        alert("비밀번호가 틀립니다.");
        setLock(false);
      }
    } catch (error) {
      console.error("Error during password check:", error);
      console.log("Error details:", error.response);
      console.log("Error details:", error.response.data);
    }
  };

  const handleButtonClick = async (e) => {
    e.preventDefault();
    if (user.email !== email) {
      alert("이메일이 다릅니다.");
      return;
    }
    if (errorMessage !== "") {
      alert("비밀번호와 비밀번호확인이 다릅니다.");
    }
    if (password2 === "") {
      alert("비밀번호를 입력해주세요.");
    }
    const response = await axios.delete(
      `/modifyprofile/deleteUser/${user.id}`,
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    if (response.data === "Y") {
      alert("탈퇴처리가 완료되었습니다.");
      localStorage.clear();
      navigate("/login");
    } else {
    }
  };

  return (
    <>
      <div className="withdra-frame">
        <div className="withdra-header">
          <span className="withdra-icon"></span>
          <div>
            <h2>회원탈퇴</h2>
            <h3>탈퇴한 아이디는 재사용 및 복구가 불가능합니다.</h3>
          </div>
        </div>
        <input
          className="current-pw"
          type="text"
          placeholder="이메일"
          value={email}
          onChange={(e) => emailChange(e, setEmail)}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            className="change-pw"
            type="password"
            value={password1}
            onChange={(e) => handlePasswordChange(e, setPassword1)}
            placeholder="비밀번호"
          />
          <button className="passwordCheck" onClick={checkPass}>
            확인
          </button>
        </div>
        <input
          className="check-pw"
          type="password"
          value={password2}
          onChange={handlePassword2Change}
          placeholder="비밀번호 확인"
        />
        <div className="submit-btn" style={{ position: "relative" }}>
          <span
            style={{
              color: "red",
              position: "absolute",
              bottom: "100%",
              left: 15,
              fontSize: "13px",
            }}
          >
            {errorMessage}
          </span>
          {setLock ? (
            <button className="button" onClick={handleButtonClick}>
              탈퇴하기
            </button>
          ) : (
            <button className="button2" onClick={handleButtonClick} disabled>
              탈퇴하기
            </button>
          )}
        </div>
      </div>
    </>
  );
}
export default WithdraIndex;
