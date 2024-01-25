import { useEffect,  useState } from 'react';
import '../../../assets/styles/_myFeedMain.scss';
import { Link, useLocation, useParams  } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'
import Follower from '../../follow/Follower';
import Following from '../../follow/Following';
import MyFeeds from '../MyFeeds';
import MyCourses from '../MyCourses';
import MyLikes from '../MyLikes';
import { wouteAPI } from '../../../api';

export default function UserFeed({user}) {
    const location = useLocation()
    const {toUserId} = useParams()
    const [feeds, setFeeds] = useState(true)
    const [courses, setCourses] = useState(false)
    const [likes, setLikes] = useState(false)
    const [userInfo, setUserInfo] = useState([])
    const [feedList, setFeedList] = useState([])
    const state = location.state && location.state?.backgroundLocation

    const userFeeds = async () => {
        const response = await wouteAPI(`/users/${toUserId}`, 'POST', {myId : user.id})
        console.log(response.data);
        setUserInfo(response.data)
        setFeedList(response.data.feeds.reverse())
    }
    useEffect(() => {
        userFeeds()

    },[toUserId, user])

    
    const tabClick = (e) => {
        const id = e.currentTarget.id
        
        if(id === 'feeds') {
            setFeeds(true)
            setCourses(false)
            setLikes(false)
        }
        if(id === 'courses') {
            setFeeds(false)
            setCourses(true)
            setLikes(false)
        }
        if(id === 'likes') {
            setFeeds(false)
            setCourses(false)
            setLikes(true)
        }
    }
    // useEffect(() => {
    // },[feeds])
    // useEffect(() => {
    // },[courses])
    // useEffect(() => {
    // },[likes])
    

    const follow = async (e) => {
        const id = e.target.value
        const btn = e.target.classList
        const unFolBtn = e.target.nextSibling.classList
        console.log("id : " +id);
        console.log(btn);
        console.log(unFolBtn);
        
        try {
            await wouteAPI("/follow","POST", {followingId : user.id, followerId : id})
            console.log("팔로우 성공");
            btn.add('d-none')
            unFolBtn.remove('d-none')
        } catch (error) {
            console.error("팔로우 실패");
        }
    }

    
    const unFollow = async (e) => {
        const id = e.target.value
        console.log("id : " +id);
        const btn = e.target.classList
        console.log(btn);
        const folBtn = e.target.previousSibling.classList
        console.log(folBtn);
        try {
            const response = await wouteAPI(`/check/${user.id}/${id}`, 'GET')
            const followerId = response.data.id
            console.log('folId : ' + followerId);
            await wouteAPI(`/follow/${followerId}`,"DELETE")
            console.log("삭제 성공");
            btn.add('d-none')
            folBtn.remove('d-none')
        } catch (error) {
            console.error("삭제 실패");
        }
    }


    return(
        <div className='MyFeed'>
            <section>
                <div className='MfWrap'>
                    <div className='header-profile'>
                        <div className='profile-img'>
                            <div className='a mx-auto'>
                                {/* 프로필 이미지 */}
                                <img src={`${process.env.REACT_APP_IMAGE_PATH}${userInfo.profileImage}`} alt="" />
                            </div>
                        </div>
                        <div className='profile-main'>
                            <div className='profile-edit mb20'>
                                {/* 닉네임 */}
                                <h2 className='nick'>{userInfo.nickname}</h2>
                                <div className='com-btn'>
                                    <button 
                                    className={`follow-btn ${!userInfo.hasFollowed ? '' : 'd-none' }`} 
                                    onClick={follow}
                                    value={userInfo.id}
                                    >
                                    팔로우
                                    </button>
                                    <button 
                                    className={`following-btn ${userInfo.hasFollowed ? '' : 'd-none' }`} 
                                    onClick={unFollow}
                                    value={userInfo.id}
                                    >
                                        팔로잉
                                    </button>
                                    <Link 
                                    to={`/chat/${user.id}/m/${userInfo.id}`} 
                                    state={{ backgroundLocation: location, 
                                        userId : userInfo.id,
                                        nickName : userInfo.nickname, 
                                        profileImg : userInfo.profileImage,
                                        roomId : userInfo.roomId
                                     }}
                                    >
                                        <button className='msg-btn'>메시지 보내기</button>
                                    </Link>
                                </div>
                            </div>
                            <ul className='fol-amount mb20'>
                                {/* 게시글, 팔로우 카운트 */}
                                <li>게시글<span>{userInfo.feedsCount}</span></li>
                                <li>
                                    <Link to='follower' 
                                    state={{backgroundLocation : state}}
                                     >
                                    팔로워<span>{userInfo.followerCount}</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to='following'
                                    state={{backgroundLocation : state}} 
                                    >
                                        팔로우<span>{userInfo.followingCount}</span>
                                    </Link>
                                </li>
                            </ul>
                            <Routes>
                                <Route path='/follower' element={<Follower user={user} pageUserId={userInfo.id} />}/>
                                <Route path='/following' element={<Following user={user} pageUserId={userInfo.id} />}/>
                            </Routes>
                            <h1 className='profile-intro'>{userInfo.introduction}</h1>
                        </div>
                    </div>
                    <div className='feed-cate'>
                        <Link to={`/users/${userInfo.id}`} className={`cate-btn ${feeds ? 'active' : ''}`} id='feeds' onClick={tabClick}>
                            <div>게시물</div>
                        </Link>
                        <Link to='course' className={`cate-btn ${courses ? 'active' : ''}`} id='courses' onClick={tabClick}>
                            <div>코스</div>
                        </Link>
                        <Link to='like' className={`cate-btn ${likes ? 'active' : ''}`} id='likes' onClick={tabClick}>
                            <div>좋아요</div>
                        </Link>
                    </div>
                    <div className="myFeed-list">
                        <Routes>
                            <Route path={`/`} element={<MyFeeds feeds={feedList} />} ></Route>
                            <Route path={`/course`} element={<MyCourses/>}></Route>
                            <Route path={`/like`} element={<MyLikes/>}></Route>
                        </Routes>
                    </div>
                </div>
            </section>
        </div>
    )
}