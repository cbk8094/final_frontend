import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/_follow.scss';
import { useEffect, useRef, useState } from 'react';
import { wouteAPI } from '../../api';

export default function Follower({user, pageUserId}) {
    const navigate = useNavigate();
    const location = useLocation()
    const state = location.state && location.state?.backgroundLocation

    const [follower, setFollower] = useState([]);
    const searchInput = useRef();

    const back = () => {
        navigate(-1)
    }

    
    useEffect(() => {
        search()
    },[])

    const smallFollow = async (e) => {
        console.log(e.target);
        let id = e.target.value
        const btn = e.target.classList
        console.log("id : " +id);
        console.log(btn);
        btn.add('d-none')
        
        try {
            await wouteAPI("/follow","POST", {followingId : user.id, followerId : id})
            console.log("팔로우 성공");
            btn.add('d-none')
        } catch (error) {
            console.error("팔로우 실패");
        }
    }

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
        const followerId = e.target.nextSibling.value
        console.log(followerId);
        const btn = e.target.classList
        console.log(btn);
        const folBtn = e.target.previousSibling.classList
        console.log(folBtn);
        // 로그인한 유저의 팔로워리스트에서 언팔
        if(user.id === pageUserId) {
            try {
                await wouteAPI(`/follow/${id}`,"DELETE")
                console.log("삭제 성공");
                btn.add('d-none')
                folBtn.remove('d-none')
            } catch (error) {
                console.error("삭제 실패");
                
            }
        } else {
            // 다른 유저의 팔로워리스트에서 언팔
            try {
                const response = await wouteAPI(`/check/${user.id}/${followerId}`, 'GET')
                const followId = response.data.id
                console.log('folId : ' + followId);
                await wouteAPI(`/follow/${followId}`,"DELETE")
                console.log("삭제 성공");
                btn.add('d-none')
                folBtn.remove('d-none')
            } catch (error) {
                console.error("삭제 실패");
                
            }
        }

    }

    
    const followDelete = async (e) => {
        let id = e.target.value
        console.log(id);
        e.target.setAttribute('disabled','true')
        try {
            await wouteAPI(`/follow/${id}`,"DELETE")
            console.log("삭제 성공");
        } catch (error) {
            console.error("삭제 실패");
            
        }
    }


    
    const search = async () => {
        console.log(searchInput.current.selectionStart);
        console.log('c : '+ searchInput.current.value);
        try {
            if(searchInput.current.selectionStart == 0) {
                const response = await wouteAPI(`/${pageUserId}/follower`, "POST", {followingId : user.id});
                console.log(response.data);
                setFollower(response.data)
                console.log('첫 목록');
            } else {
                const response = await wouteAPI(`/${pageUserId}/follower/search`,'POST',
                {nickname:searchInput.current.value, followingId : user.id })
                setFollower(response.data)
                console.log('검색성공');
            }
        } catch (error) {
            console.log('검색실패');
            
        }
    }
    
    return(
        <div className="minModal">
            <div className="inner">
                <div className="follow">
                    <div className='fol-header'>
                        <div className='head'>팔로워</div>
                        <div><button className='exit-btn' onClick={back}></button></div>
                    </div>
                    <div className='search-wrap'>
                        <div className='search-input'>
                            <input type="text" 
                            onChange={search}
                            ref={searchInput}
                            placeholder='검색'
                            />
                        </div>
                    </div>
                    <div className="fol-wrap">
                        <div className="fol-list">
                            {follower.map(item => {
                                return (
                                    <div className="fol-tab" key={item.id}>
                                        <div className="profileImg">
                                            <Link 
                                            to={`/users/${item.followerId}`}
                                            >
                                                <img
                                                src={`${process.env.REACT_APP_IMAGE_PATH}${item.followerImg}`}
                                                alt="상대 프로필"
                                                />
                                            </Link>
                                        </div>
                                        <div className="tab-info">
                                            <div className="tab-name">
                                                <Link 
                                                to={`/users/${item.followerId}`}
                                                >
                                                    <h2>
                                                        {item.followerNick}
                                                    </h2>
                                                </Link>
                                                <input readOnly type="text" hidden className='followerId' value={item.followerId}/>
                                                <button 
                                                className={`${(item.followState || user.id != pageUserId)? 'd-none' : '' }`}
                                                    value={item.followerId}
                                                    onClick={smallFollow}
                                                >
                                                    팔로우
                                                </button>
                                            </div>
                                        </div>
                                        <div className="btn-wrap">
                                            {
                                                pageUserId === user.id ?
                                                <div className={`del-btn ${user.id !== pageUserId ? 'd-none' : ''}`}>
                                                    <button onClick={followDelete} value={item.id}>삭제</button>
                                                </div>
                                                : (
                                                    item.followerId === user.id ?
                                                    <div></div>
                                                    :
                                                    <div className="btn-box">
                                                        <button 
                                                        className={`follow-btn ${item.followState ? 'd-none' : ''}`}
                                                        value={item.followerId}
                                                        onClick={follow}
                                                        >
                                                        팔로우
                                                        </button>
                                                        <button 
                                                        className={`following-btn ${!item.followState ? 'd-none' : ''}`} 
                                                        value={item.id}
                                                        onClick={unFollow}
                                                        >
                                                        팔로잉
                                                        </button>
                                                        <input readOnly type="text" hidden className='followerId' value={item.followerId}/>
                                                    </div>
                                                )
                                            }
                                            </div>
                                    </div>
                                )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}