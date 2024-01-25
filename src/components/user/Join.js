import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Join() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [nickNameMatchError, setNickNameMatchError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [codeMessage, setCodeMessage] = useState("");
  const [confirmVerify, setConfirmVerify] = useState(true);
  const [sendVerify, setSendVerify] = useState(false);
  const [emailCode, setEmailCode] = useState("");
  const navigate = useNavigate();
  // const mailAuthType = false;
  const [ShowEmailVerificationButton, setShowEmailVerificationButton] =
    useState(false);

  const verifyOnchange = (e) => {
    setVerifyCode(e.target.value);
  };

  const verfiyHandle = (e) => {
    e.preventDefault();
    console.log("친코드 : " + verifyCode);
    console.log("인증코드 : " + emailCode);
    if (verifyCode == emailCode) {
      alert("이메일 인증이 완료되었습니다.");
      setConfirmVerify(false);
    } else {
      alert("인증코드가 다릅니다.");
    }
  };

  // const [verificationText, setVerificationText] = useState("");

  // const handleConfirmationButtonClick = () => {
  //   // 인증 확인 로직 필요
  //   setShowVerification(true);
  //   console.log("인증확인완료");
  // };

  // const generateNewVerificationText = () => {
  //   // 새로운 인증 텍스트를 생성하는 함수
  //   return Math.random().toString(36).substring(7);
  // };

  //이메일 인증 axios
  const handleVerificationButtonClick = async (e) => {
    e.preventDefault();
    console.log("handleVerificationButtonClick 호출");
    setShowVerification(true);

    e.preventDefault();
    const userEmail = email;
    console.log("email : " + email);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/join/emailConfirm`,
        userEmail,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      if (response.data !== "") {
        setEmailCode(response.data);
        setSendVerify(true);
        alert("인증메일이 발송 되었습니다.");
        console.log("서버 응답: 성공");
      } else {
        alert("이미 존재하는 아이디입니다.");
        console.log("서버 응답 : 실패");
      }
    } catch (error) {
      console.error("에러 발생:", error.message);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    passwordRuleCheck(newPassword);
    setPassword(newPassword);
    checkPasswordMatch(newPassword, confirmPassword);
  };
  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    checkPasswordMatch(password, newConfirmPassword);
  };

  //비밀번호 유효성 검사
  const passwordRuleCheck = (password) => {
    //영문,숫자,특문 1개씩, 6글자이상
    const PasswwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    const isValid = PasswwordRegex.test(password);
    setIsValidPassword(isValid);
  };
  // 이메일 입력값 변경 시 호출되는 함수
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    emailErrorcheck(e.target.value);
  };

  const emailErrorcheck = (email) => {
    // 이메일 유효성 검사를 위한 정규표현식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setIsValidEmail(isValid);

    if (!isValid) {
      setEmailError("유효한 이메일이 아닙니다.");
    } else {
      setEmailError("");
      setShowEmailVerificationButton("true");
    }
  };

  const handleNickChange = (e) => {
    setNickname(e.target.value);
    if (nickname !== "") {
      setNickNameMatchError("");
    }
  };

  const checkPasswordMatch = (pw, confirmPw) => {
    if (confirmPw == "") {
      setPasswordMatchError("");
    } else if (pw !== confirmPw) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordMatchError("");
      setPasswordError("");
    }
    if (!isValidPassword) {
      setPasswordError("영문, 숫자, 특수문자 조합 6자 이상 입력해야합니다.");
    } else {
      setPasswordError("");
    }
  };
  // 폼 제출 시 호출되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Nickname:", nickname);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    //aaaaa
    if (
      email === "" ||
      password === "" ||
      nickname === "" ||
      confirmPassword === ""
    ) {
      if (email === "") {
        setEmailError("이메일을 입력해주세요.");
      }
      if (password === "") {
        setPasswordError("비밀번호를 입력해주세요.");
      }
      if (nickname === "") {
        setNickNameMatchError("닉네임이 입력되지 않았습니다.");
      }
      if (confirmPassword === "") {
        setPasswordMatchError("비밀번호 확인을 입력해주세요.");
      }

      if (!isValidEmail) {
        setEmailError("유효한 이메일이 아닙니다.");
      }
      if (!sendVerify) {
        alert("이메일 인증을 해주세요.");
      }
      return false;
    }
    if (!sendVerify) {
      alert("이메일 인증을 해주세요.");
      return false;
    }
    if (!isValidPassword) {
      setPasswordMatchError(
        "영문, 숫자, 특수문자 조합 6자 이상 입력해야합니다."
      );
    } else {
      setPasswordError("");
    }
    if (passwordMatchError != "") {
      console.log("여기서 걸림");
      return false;
    }

    const user = {
      nickname: nickname,
      password: password,
      email: email,
      provider: "woute",
    };
    console.log("객체 선언");
    console.log("user: " + user.email);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/join`,
        user,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("ababa");
      console.log("서버 응답:", response.data);
      alert(nickname + "님의 가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      console.error("에러 발생:", error.message);
    }
  };

  return (
    <>
      <div className="logform-position">
        <form onSubmit={handleSubmit}>
          <div className="signup-input">
            <div className="email-position">
              <input
                className="signup-input-email"
                type="text"
                placeholder="이메일"
                value={email}
                onChange={handleEmailChange}
              />

              {ShowEmailVerificationButton ? (
                <button
                  className="email-veri-button"
                  onClick={handleVerificationButtonClick}
                >
                  인증하기
                </button>
              ) : (
                <button className="email-veri-button" disabled>
                  인증하기
                </button>
              )}
            </div>
            <button
              className="email-button"
              style={{ transform: "translateY(32%)" }}
            ></button>
          </div>
          <span
            style={{
              color: "red",
              marginLeft: "20px",
              fontSize: "12px",
            }}
          >
            {emailError}
          </span>
          {showVerification && (
            <div
              className="signup-input"
              style={{ paddingTop: ".1rem", marginBottom: ".5rem" }}
            >
              <div className="email-position">
                <input
                  className="verify-input-email"
                  type="text"
                  placeholder="인증번호를 입력하세요."
                  value={verifyCode}
                  onChange={verifyOnchange}
                />
                {confirmVerify ? (
                  <button className="email-confirm" onClick={verfiyHandle}>
                    확인
                  </button>
                ) : (
                  <button
                    className="email-confirm"
                    onClick={verfiyHandle}
                    disabled
                    style={{ color: "gray" }}
                  >
                    완료
                  </button>
                )}
              </div>
              <span
                style={{
                  color: "red",
                  marginLeft: "20px",
                  fontSize: "12px",
                  marginBottom: "8px",
                }}
              >
                {codeMessage}
              </span>
            </div>
          )}

          <div className="signup-input" style={{ paddingTop: "3px" }}>
            <input
              className="signup-input-nick"
              type="text"
              placeholder="닉네임"
              autoComplete="off"
              value={nickname}
              onChange={handleNickChange}
            />
            <button className="nick-button"></button>
          </div>
          <span
            style={{
              color: "red",
              marginLeft: "20px",
              fontSize: "12px",
            }}
          >
            {nickNameMatchError}
          </span>
          <div className="signup-input" style={{ paddingTop: "3px" }}>
            <input
              className="signup-input-pw"
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="new-password"
            />
            <button
              className="pw-button"
              style={{ transform: "translateY(-50%)" }}
            ></button>
          </div>
          <span
            style={{
              color: "red",
              marginLeft: "20px",
              fontSize: "12px",
            }}
          >
            {passwordError}
          </span>
          <div className="signup-input" style={{ paddingTop: "3px" }}>
            <input
              className="signup-input-check"
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              autoComplete="new-password"
            />
            <button
              className="pw-button2"
              style={{ transform: "translateY(-60%)" }}
            ></button>
          </div>
          <span
            style={{
              color: "red",
              marginLeft: "20px",
              fontSize: "12px",
            }}
          >
            {passwordMatchError}
          </span>
          <div className="btn-position">
            <button className="signup-btn" type="submit">
              가입하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Join;
