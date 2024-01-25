import "../../assets/styles/_chatModal.scss";
import ChatRoom from "./ChatRoom";
import { useState, useEffect, useRef } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { Link, NavLink, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { wouteAPI } from "../../api";

export default function ChatModal({user, setChatNoti}) {
  const [chatList, setChatList] = useState([])
  const [connected, setConnected] = useState(false)
  // 채팅대상 검색
  const [searchListVisible, setSearchListVisible] = useState(false);
  const [userList, setUserList] = useState([])
  const [receiveMessage, setReceiveMessage] = useState([])
  const [roomNick, setRoomNick] = useState('')
  const [roomProfileImg, setRoomProfileImg] = useState('')
  const [myInfo, setMyInfo] = useState('')
  const [messageInput, setMessageInput] = useState('')
  const [currentUserId, setCurrentUserId] = useState('')
  const [currentRoomId, setCurrentRoomId] = useState('')
  const location = useLocation()
  const findUser = useRef()
  
  const state = location.state && location.state?.backgroundLocation
  const idx = location.pathname.lastIndexOf('/')
  const checkId = location.pathname.substring(idx + 1)
  
  const stompClient = useRef({});
  // const url = 'http://localhost:8081/ws'
  const url = `${process.env.REACT_APP_BASE_URL}/ws`

  let fromPageRoomId = null;
  if (location.state.userId != undefined && user.id != null) {
    if(location.state.roomId == null) {
      fromPageRoomId = user.id.toString() + location.state.userId
    } else {
      fromPageRoomId = location.state.roomId
    }
  }
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    const socket = new SockJS(url)
    stompClient.current = Stomp.over(socket)  
    // WebSocket 연결
      stompClient.current.connect({}, () => {
        console.log('connect 성공');
        setConnected(true)
          // 해당 채팅방 구독
          stompClient.current.subscribe(
            `/sub/chat/m/${fromPageRoomId != null && currentRoomId == '' ?
            fromPageRoomId : currentRoomId}`,
            (frame) => {
              let msg = JSON.parse(frame.body)
              console.log(msg);
              setReceiveMessage(msg)},
            {},
          );
        // }

      })
      return () => {
        stompClient.current.disconnect()
        setConnected(false)
      }
  },[location.pathname])

  // 안읽은 채팅방 읽음처리
  const readNoti = async(id) => {
    try {
      await wouteAPI(`/chat/${user.id}/read`, 'POST', {roomId:id})
    } catch (error) {
      
    }
  }

  useEffect(() => {
    if(stompClient.current.connected) {
      readNoti(fromPageRoomId || currentRoomId)
    }
  },[receiveMessage])

  // 채팅방 선택 
  const selectRoom = (e) => {
    const toUserId = e.currentTarget.querySelector('.userId').value;
    const roomId = e.currentTarget.querySelector('.roomId').value;
    const nick = e.currentTarget.querySelector('.tab-nick h2').textContent;
    const img = e.currentTarget.querySelector('.profileImg img').src;
    readNoti(roomId)
    setRoomNick(nick)
    setRoomProfileImg(img)
    setCurrentUserId(toUserId)
    setCurrentRoomId(roomId)
  }

  

  // 메시지 전송
  const sendMessage = () => {
    // 유저페이지에서 메시지 보내기로 왔을때
  if(location.state.userId == checkId) {
    console.log('보낼때 id :' +location.state.userId);
    console.log('보낼때 roomId :' + fromPageRoomId);
    const newMessage = {
      myId: user.id,
      toUserId: location.state.userId,
      roomId: fromPageRoomId,
      message: messageInput
    }
    stompClient.current.publish({destination: `/pub/chat/m`, body: JSON.stringify({newMessage
    })});
    setMessageInput('')
  }
  stompClient.current.publish({destination: `/pub/chat/m`, body: JSON.stringify({message
  })});
  setMessageInput('')
};

// 전송할 메시지
let message = {
  myId: user.id,
  toUserId: currentUserId,
  roomId: currentRoomId,
  message: messageInput
}

  const sendEnter = (e) => {
    if(e.key === 'Enter') {
      sendMessage()
    }
  }
  
  // 채팅방 리스트 조회
  const chatInfo = async () => {
    const response = await wouteAPI(`/chat/${user.id}`, 'GET');
    // console.log(response.data.myUser); 
    // console.log(response.data.rooms); 
    setMyInfo(response.data.myUser)
    setChatList(response.data.rooms.reverse())
  }
  // 안읽은 채팅방 개수
  const unReadCount =  chatList.reduce((count, room) => count + (room.isRead ? 0 : 1), 0);
  if(unReadCount > 0) {
    setChatNoti(true)
  } else {
    setChatNoti(false)
  }

  useEffect(() => {
    chatInfo()
  },[receiveMessage, setChatNoti, connected])

  
  
  
  // 채팅 유저 검색
  const search = async () => {
    if(findUser.current.selectionStart === 0) {
      setSearchListVisible(false)
    } else {
      setSearchListVisible(true)
      const response = await wouteAPI('/chat/user', 'POST', 
      {nickName : findUser.current.value, myId : user.id})
      console.log(response.data.users);
      setUserList(response.data.users)
    }
  }

  
  const showSearchList = () => {
      setSearchListVisible(!searchListVisible)
  }
  
  // 유저 검색
  const selectUser = (e) => {
    const toUserId = e.currentTarget.querySelector('.userId').value;
    const roomId = e.currentTarget.querySelector('.roomId').value;
    const nick = e.currentTarget.querySelector('.tab-nick h2').textContent;
    const img = e.currentTarget.querySelector('.profileImg img').src;
    setRoomNick(nick)
    setRoomProfileImg(img)
    setCurrentUserId(toUserId)
    if(roomId) {
      setCurrentRoomId(roomId)
    } else {
      console.log(user.id.toString() + toUserId);
      setCurrentRoomId(user.id.toString() + toUserId)
    }
  }

  return (
    <>
      <div className="modal">
        <div className="inner">
          <div className="chat-inner">
            <div className="chat-util">
              <div className="chat-profile">
                <div className="profile-wrap">
                  <div className="profileImg">
                    <img
                      src={`${process.env.REACT_APP_IMAGE_PATH}${myInfo.profileImage}`}
                      alt="내 프로필"
                    />
                  </div>
                </div>
                <h2>{myInfo.nickname}</h2>
              </div>
              <div className="chat-header">
                <div className="name">
                  <span>메시지</span>
                </div>
                <div className="search-wrap">
                    <div className="user-search">
                        <div className="search-input">
                            <input type="text" 
                            onChange={search}
                            ref={findUser}
                            />
                        </div>
                    </div>
                </div>
              </div>
                <div className={`search-list-wrap ${!searchListVisible ? 'd-none': ''}`}>
                    <div className="search-list-box">
                        <div className="list-header-wrap">
                            <div className="list-header">
                                <div className="title">유저목록</div>
                                <div className="exit-btn">
                                    <button onClick={showSearchList}></button>
                                </div>
                            </div>
                        </div>
                        <div className="search-list">
                          {(userList || []).map((item) => (
                            item.nickName === user.nickname ?
                            <div></div> :
                            <NavLink
                            to={`${user.id}/m/${item.userId}`}
                            state={{ backgroundLocation: state}}
                            className="user-tab" 
                            key={item.userId}
                            onClick={selectUser}
                             >
                              <input type="text" className="userId" value={item.userId} hidden readOnly />
                              <input type="text" className="roomId" value={item.roomId} hidden readOnly />
                                <div className="profileImg">
                                    <img
                                    src={`${process.env.REACT_APP_IMAGE_PATH}${item.profileImg}`}
                                    alt="상대 프로필"
                                    />
                                </div>
                                <div className="profileInfo">
                                    <div className="tab-nick">
                                        <h2>{item.nickName}</h2>
                                    </div>
                                </div>
                            </NavLink>
                          )
                          )}
                        </div>
                    </div>
                </div>
              <div className="chatRoom-list">
                {chatList.map(item => (
                  <NavLink to={`${user.id}/m/` + item.toUserId} 
                  className="chat-tab"  
                  onClick={selectRoom}
                  state={{ backgroundLocation: state, roomId : item.roomId}} 
                  key={item.roomId}
                  >
                    <input type="text" className="userId" value={item.toUserId} hidden readOnly />
                    <input type="text" className="roomId" value={item.roomId} hidden readOnly />
                    <div className="profileImg">
                      <img src={`${process.env.REACT_APP_IMAGE_PATH}${item.toUserImg}`}/>
                    </div>
                    <div className="profileInfo">
                      <div className="tab-nick">
                        <h2>{item.toUserNick}</h2>
                      </div>
                      <div className="tab-last">{item.lastMsg}</div>
                    </div>
                    <div className="chat-noti">
                      <div>
                          {
                            item.isRead ?
                            <div></div>
                            :
                            <div className="noti-dot"></div>
                          }
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
            {
              location.pathname === `/chat/${user.id}` ? 
              (<div className="chat-room"></div>)
              : (
                <div className="chat-room">
                  <div className="chat-receiver">
                    <div className="profileImg">
                      {currentRoomId == '' ? (
                      <img src={`${process.env.REACT_APP_IMAGE_PATH}${location.state.profileImg}`} />
                      ) : (
                      <img
                        src={roomProfileImg}
                        alt="상대 프로필"
                      />
                      )}
                    </div>
                    <div className="nick">
                      <h2>{location.state.nickName ? location.state.nickName : roomNick}</h2>
                    </div>
                  </div>
                  <div className="chat-service">
                    <div className="chat-log">
                      <div className="logList-wrap">
                          {/* <Routes>
                          <Route path={`/chat/${user.id}/m/${currentUserId}`}  element={<ChatRoom user={user} data={receiveMessage}/>}/> 
                          </Routes> */}
                          <Outlet context={{receiveMessage, fromPageRoomId, sendMessage, setMessageInput, messageInput}} />
                      </div>
                    </div>
                    <div className="chat-submit">
                      <div className="input-box">
                        <div className="chat-input">
                          <input type="text" 
                          onChange={(e) => setMessageInput(e.target.value)}
                          value={messageInput}
                          placeholder="메시지 입력" 
                          onKeyDown={sendEnter}
                          />
                        </div>
                        <div className="submit-btn">
                            <button 
                            onClick={sendMessage}
                            ></button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )
              }
          </div>
          <Link to={ state } className='close'>닫기</Link>
        </div>
      </div>
    </>
  );
}
