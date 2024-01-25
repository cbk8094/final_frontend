import { useState, useEffect } from "react";
import "./App.scss";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { wouteAPI } from "./api";
import Navigation from "./components/Navigation";
import Main from "./components/Main";
import MyFeedMain from "./components/MyFeed/MyFeedMain";
import CourseList from "./components/courseList/CourseList";
import Modal from "./components/Modal";
import Modifyprofile from "./components/user/ModifyProfile";
import Loghead from "./components/user/LogHead";
import Loginform from "./components/user/LoginForm";
import Join from "./components/user/Join";
import Logfooter from "./components/user/LogFooter";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import UserFeed from "./components/MyFeed/UserFeed/UserFeed";
import SearchResult from "./components/searchResult/SearchResult";
import ChatModal from "./components/chatting/ChatModal";
import ChatRoom from "./components/chatting/ChatRoom";

function App() {
  const ACCESS_TOKEN = localStorage.getItem("accessToken");
  const limits = 4;
  const location = useLocation();
  const state = location.state && location.state.backgroundLocation;
  const [scrollY, setScrollY] = useState(0);
  const [data, setData] = useState([]);
  const [user, setUser] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollActive, setScrollActive] = useState(false);
  const [token, setToken] = useState();
  const [chatNoti, setChatNoti] = useState(false);

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/", { replace: true });
    console.log(token);
  };

  // token에서 id 빼오기
  const decodeTokenAndExtractId = (ACCESS_TOKEN) => {
    try {
      const base64Url = ACCESS_TOKEN.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      const decodedData = JSON.parse(atob(base64));
      if (decodedData && decodedData.id) {
        return decodedData.id;
      } else {
        console.error("토큰에 id 필드가 없습니다.");
        return null;
      }
    } catch (error) {
      console.error("토큰 디코드 오류:", error);
      return null;
    }
  };

  const fetchUserData = async () => {
    const ACCESS_TOKEN = localStorage.getItem("accessToken");

    if (ACCESS_TOKEN) {
      const userId = decodeTokenAndExtractId(ACCESS_TOKEN);
      console.log("디코드된 토큰의 id:", userId);

      if (userId) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/userinfosave/${userId}`, null, {
            headers: {
              "Content-Type": "application/json",
            },
            params: {
              id: userId,
            },
          });
          console.log("데이터 :" + response.data);
          response.data.profileImage = `${process.env.REACT_APP_IMAGE_PATH}${response.data.profileImage}`;
          setUser(response.data);
          console.log("setUser : " + user);
        } catch (error) {
          console.error("서버에 데이터 저장 중 오류 발생:", error);
        }
      } else {
        console.log("토큰 디코드 실패 또는 id 필드가 없음");
      }
    } else {
      console.warn("로컬 스토리지에 accessToken이 없습니다.");
    }
    return;
  };

  useEffect(() => {
    fetchUserData();
  }, [ACCESS_TOKEN]);

  const wouteFeeds = async () => {
    try {
      const feedList = await wouteAPI("/p", "GET", null);
      setData(feedList.data);
      setTotal(feedList.data.length / limits);
      console.log(feedList.data)
      setTimeout(() => {
        setLoading(true);
      }, 600);
    } catch (err) {
      console.log("에러: " + err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log(ACCESS_TOKEN);
      if (ACCESS_TOKEN != null) {
        setToken(true);
        await wouteFeeds(); // wouteFeeds가 비동기 작업이라면 await을 사용
      } else {
        setToken(false);
        navigate("/login");
        return; // 여기서 중단하고 이후 로직을 실행하지 않도록 추가
      }
    };

    fetchData();
  }, [token]);

  const handleScroll = () => {
    window.pageYOffset < scrollY
      ? setScrollActive(false)
      : setScrollActive(true);
    setScrollY(window.pageYOffset);
  };

  useEffect(() => {
    if (token) {
      const scrollListener = () => {
        window.addEventListener("scroll", handleScroll);
      };
      scrollListener();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [scrollY]);

  const LogLayout = ({ children }) => (
    <>
      <div className="log-top">
        <Loghead />
        {children}
      </div>
      <Logfooter />
    </>
  );

  return (
    <>
      {token ? (
        <div className={`App ${scrollActive ? "__active" : ""}`}>
          <Navigation user={user} chatNoti={chatNoti} />
          <div className="container">
            <Routes location={state || location}>
              <Route
                path="/*"
                element={
                  <Main
                    data={data}
                    limits={limits}
                    total={total}
                    wouteFeeds={wouteFeeds}
                    loading={loading}
                    user={user}
                  />
                }
              />
              <Route path="/p/courses" element={<CourseList />} />
              <Route
                path={`/users/${user.id}/*`}
                element={<MyFeedMain user={user} />}
              />
              <Route
                path={`/users/:toUserId/*`}
                element={<UserFeed user={user} />}
              />
              <Route
                path="/modifyProfile"
                element={
                  <Modifyprofile
                    user={user}
                    fetchUserData={fetchUserData}
                    wouteFeeds={wouteFeeds}
                  />
                }
              />
              <Route
                path={"/search/tags/:keyword"}
                element={<SearchResult />}
              />
              <Route path={"/p/:id"} element={<Modal />} />
            </Routes>
            {state && (
              <Routes>
                <Route
                  path="create"
                  element={
                    <Modal
                      wouteFeeds={wouteFeeds}
                      setLoading={setLoading}
                      user={user}
                    />
                  }
                />
                <Route
                  path="p/:id"
                  element={
                    <Modal
                      wouteFeeds={wouteFeeds}
                      setLoading={setLoading}
                      user={user}
                    />
                  }
                />
                {/* <Route path="chat/:id/m/:userid" element={<ChatModal user={user} />} /> */}
                <Route
                  path="chat/*"
                  element={<ChatModal setChatNoti={setChatNoti} user={user} />}
                >
                  <Route
                    path={`${user.id}/*`}
                    element={<ChatRoom user={user} />}
                  />
                </Route>
                <Route path="notice" element={<></>} />
              </Routes>
            )}
          </div>
          <ToastContainer
            position="bottom-left"
            autoClose={2000}
            theme="light"
            hideProgressBar
          />
        </div>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={
              <LogLayout>
                <Loginform onLogin={handleLogin} />
              </LogLayout>
            }
          ></Route>
          <Route
            path="/join"
            element={
              <LogLayout>
                <Join />
              </LogLayout>
            }
          ></Route>
        </Routes>
      )}
    </>
  );
}

export default App;
