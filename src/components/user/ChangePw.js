import { useState } from "react";
import "../../assets/styles/_changepw.scss";
import axios from "axios";

function ChangePw({ onCloseModal, user }) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [Lock, setLock] = useState(false);
  const handlePasswordChange = (e, setPassword1) => {
    const newPassword = e.target.value;
    setPassword1(newPassword);
    const PasswwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    const isValid = PasswwordRegex.test(password1);
    if (!isValid) {
      setErrorMessage("영문,숫자,특문 1개씩, 6글자이상");
    }
    if (password2 && newPassword !== password2) {
      setErrorMessage("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorMessage("");
    }
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
    console.log("확인 보내는 pw:" + currentPassword);
    console.log("id" + user.id);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/modifyprofile/checkPw/${user.id}`,
        { password: currentPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      if (response.data == "Y") {
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
    if (errorMessage == "") {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/modifyprofile/changePw/${user.id}`,
          { password: password1 },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        if (response.data === "Y") {
          alert("비밀번호가 변경되었습니다.");
        } else {
          alert("비밀번호 변경오류");
        }
      } catch (error) {
        console.error("Error during password check:", error);
        console.log("Error details:", error.response);
        console.log("Error details:", error.response.data);
      }
    } else {
    }

    onCloseModal();
  };
  return (
    <>
      <div className="change-frame">
        <div className="changepw-header">
          <span className="changepw-icon"></span>
          <div>
            <h2>비밀번호변경</h2>
            <h3>안전한 비밀번호로 내 정보를 보호하세요.</h3>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            className="current-pw"
            type="password"
            placeholder="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => handlePasswordChange(e, setCurrentPassword)}
          />
          <button className="passwordCheck" onClick={checkPass}>
            확인
          </button>
        </div>
        <input
          className="change-pw"
          type="password"
          value={password1}
          onChange={(e) => handlePasswordChange(e, setPassword1)}
          placeholder="변경할 비밀번호"
        />
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

          {Lock ? (
            <button onClick={handleButtonClick}>변경하기</button>
          ) : (
            <button onClick={handleButtonClick} disabled>
              변경하기
            </button>
          )}
        </div>
      </div>
    </>
  );
}
export default ChangePw;
