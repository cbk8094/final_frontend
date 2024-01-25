import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../assets/styles/_follow.scss';
import { useEffect, useRef, useState } from 'react';
import { wouteAPI } from '../../api';

export default function Following({user, pageUserId}) {
    const navigate = useNavigate();
    const location = useLocation()
    const state = location.state && location.state?.backgroundLocation
    const [following, setfollowing] = useState([]);
    const searchInput = useRef();

    const back = () => {
        navigate(-1)
    }

    useEffect(() => {
        search()
    },[])


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
        const followingId = e.target.nextSibling.value
        console.log(followingId);
        const btn = e.target.classList
        console.log(btn);
        const folBtn = e.target.previousSibling.classList
        console.log(folBtn);
        // 로그인한 유저의 팔로잉리스트 언팔
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
            // 다른 유저의 팔로잉리스트에서 언팔
            try {
                const response = await wouteAPI(`/check/${user.id}/${followingId}`, 'GET')
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
    

    const search = async () => {
        console.log(searchInput.current.selectionStart);
        console.log('c : '+ searchInput.current.value);
        try {
            if(searchInput.current.selectionStart == 0) {
                const response = await wouteAPI(`/${pageUserId}/following`, "POST", {followingId : user.id});
                setfollowing(response.data)
                console.log(response.data);
                console.log('첫 목록');
            } else {
                const response = await wouteAPI(`/${pageUserId}/following/search`,'POST',
                {nickname:searchInput.current.value, followingId : user.id})
                setfollowing(response.data)
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
                        <div className='head'>팔로잉</div>
                        <div><button className='exit-btn' onClick={back}></button></div>
                    </div>
                    <div className='search-wrap'>
                        <div className='search-input'>
                            <input 
                            type="text" 
                            onChange={search}
                            ref={searchInput}
                            placeholder='검색'
                            />
                        </div>
                    </div>
                    <div className="fol-wrap">
                        <div className="fol-list">
                            {following.map(item => {
                                return(
                                    <div className="fol-tab" key={item.id}>
                                        <div className="profileImg">
                                            <Link 
                                            to={`/users/${item.followingId}`}
                                            >
                                                <img
                                                src={`${process.env.REACT_APP_IMAGE_PATH}${item.followingImg}`}
                                                alt="상대 프로필"
                                                />
                                            </Link>
                                        </div>
                                        <div className="tab-info">
                                            <div className="tab-name">
                                                <Link 
                                                to={`/users/${item.followingId}`}
                                                >
                                                    <h2>{item.followingNick}</h2>
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="btn-wrap">
                                            {
                                                pageUserId === user.id ?
                                                <div className="btn-box">
                                                    <button 
                                                    className={'follow-btn d-none'}
                                                    value={item.followingId}
                                                    onClick={follow}
                                                    >
                                                    팔로우
                                                    </button>
                                                    <button 
                                                    className={'following-btn'} 
                                                    value={item.id}
                                                    onClick={unFollow}
                                                    >
                                                    팔로잉
                                                    </button>
                                                    <input readOnly type="text" hidden className='followingId' value={item.followingId}/>
                                                </div>
                                                :
                                                <div className="btn-box">
                                                    <button 
                                                    className={`follow-btn ${item.followState || user.id != pageUserId ? 'd-none' : ''}`}
                                                    value={item.followingId}
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
                                                    <input readOnly type="text" hidden className='followingId' value={item.followingId}/>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}