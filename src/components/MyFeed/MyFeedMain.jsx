import { useEffect,  useState } from 'react';
import '../../assets/styles/_myFeedMain.scss';
import { Link, useLocation  } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom'
import Follower from '../follow/Follower';
import Following from '../follow/Following';
import MyFeeds from './MyFeeds';
import MyCourses from './MyCourses';
import MyLikes from './MyLikes';
import { wouteAPI } from '../../api';

export default function MyFeedMain({user}) {
    const [feeds, setFeeds] = useState(true)
    const [courses, setCourses] = useState(false)
    const [likes, setLikes] = useState(false)
    const [userInfo, setUserInfo] = useState([])
    const [feedList, setFeedList] = useState([])
    const location = useLocation()
    const state = location.state && location.state?.backgroundLocation

    const userFeeds = async () => {
        const response = await wouteAPI(`/users/${user.id}`, 'GET')
        // console.log(response.data);
        // console.log(response.data.feeds);
        setUserInfo(response.data)
        setFeedList(response.data.feeds.reverse())
    }
    useEffect(() => {
        userFeeds()
    },[user])
    
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
    
    return(
        <div className='MyFeed'>
            <section>
                <div className='MfWrap'>
                    <div className='header-profile'>
                        <div className='profile-img'>
                            <div className='a mx-auto'>
                                {/* 프로필 이미지 */}
                                <img src={user.profileImage} alt='' />
                            </div>
                        </div>
                        <div className='profile-main'>
                            <div className='profile-edit mb20'>
                                {/* 닉네임 */}
                                <h2 className='nick'>{userInfo.nickname}</h2>
                                <div className='modifyPage'><Link to="/modifyProfile">프로필 편집</Link></div>
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
                                <Route path='/follower' element={<Follower user={user} pageUserId={user.id} />}/>
                                <Route path='/following' element={<Following user={user} pageUserId={user.id} />}/>
                            </Routes>
                            <h1 className='profile-intro'>{userInfo.introduction}</h1>
                        </div>
                    </div>
                    <div className='feed-cate'>
                        <Link to={`/users/${user.id}`} className={`cate-btn ${feeds ? 'active' : ''}`} id='feeds' onClick={tabClick}>
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