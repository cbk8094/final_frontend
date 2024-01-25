import { useState } from "react";
import "../../assets/styles/_findpw.scss";
import axios from "axios";

function FindPw({ onCloseModal, user }) {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("이메일 인증을 해주세요.");
  const [currentEmail, setCurrentEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [Lock, setLock] = useState(false);
  const [code, setCode] = useState("");

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
  const handleCodeChange = (e) => {
    setEmailCode(e.target.value);
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
  const checkCode = (e) => {
    if (code === emailCode) {
      console.log("인증이 완료되었습니다.");
      alert("인증이 완료되었습니다.");
      setLock(true);
      setErrorMessage("");
    } else {
      alert("인증번호가 다릅니다.");
      console.log("인증번호가 다릅니다.");
    }
  };
  const checkEmail = async (e) => {
    e.preventDefault();
    console.log("보내는 이메일:" + currentEmail);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/login/findEmail`,
        { email: currentEmail },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);
      if (response.data !== "") {
        setCode(response.data);
        alert("인증번호가 발급되었습니다.");
      } else {
        alert("가입되어 있는 이메일이 아닙니다.");
      }
    } catch (error) {
      console.error("Error during password check:", error);
      console.log("Error details:", error.response);
      console.log("Error details:", error.response.data);
    }
  };
  const handleButtonClick = async (e) => {
    if ((errorMessage = "")) {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BASE_URL}/login/changePw`,
          { password: password1 },
          { email: currentEmail },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        if (response.data !== "") {
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
            <h2>비밀번호 찾기</h2>
            <h3>이메일 인증 후 새비밀번호로 변경하세요.</h3>
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
            className="current-email"
            type="text"
            placeholder="본인의 이메일을 입력하세요."
            value={currentEmail}
            onChange={(e) => handlePasswordChange(e, setCurrentEmail)}
          />
          <button className="passwordCheck" onClick={checkEmail}>
            인증하기
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            className="email-code-input"
            type="text"
            placeholder="인증번호를 입력하세요."
            value={emailCode}
            onChange={(e) => handleCodeChange(e, setEmailCode)}
          />
          <button className="code-check" onClick={checkCode}>
            확인하기
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
export default FindPw;
