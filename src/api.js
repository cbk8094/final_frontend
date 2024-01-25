import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
const accessToken = localStorage.getItem("accessToken");

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: accessToken ? `bearer ${accessToken}` : "",
  },
});

export const wouteAPI = async (
  api,
  method,
  params,
  headers = { "Content-Type": "application/json" }
) => {
  try {
    const response = await axios({
      method: method,
      url: baseURL + api,
      headers: {
        headers,
      },
      data: params,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
export const PostLogin = async (data) => {
  try {
    const response = await axiosInstance.post("/login", data);
    console.log(response.data);

    if (response.data) {
      localStorage.setItem("accessToken", response.data.accessToken);
      console.log("토큰 access: " + response.data.accessToken);
      window.location.href = "/";
    } else {
      console.error("서버 응답에 토큰이 없습니다.");
      // 토큰이 없는 경우에 대한 처리 추가
    }
  } catch (error) {
    console.error("로그인 요청 실패:", error);
    alert("아이디 혹은 비밀번호가 틀립니다.");
    window.location.href = "/login";
    // 로그인 요청 실패에 대한 처리 추가
  }
};

export const getProfile = async (id) => {
  try {
    const response = await axiosInstance.get(`/modifyProfile/${id}`);
    return response.data;
  } catch (error) {}
};
