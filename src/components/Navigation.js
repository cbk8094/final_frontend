import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import NotiList from './NotiList'
import { wouteAPI } from '../api'
import { toast } from 'react-toastify'

function Navigation({ user, chatNoti }) {
    const location = useLocation()
    const navigate = useNavigate()
    const noticeRef = useRef()
    const [active, setActive] = useState(false)
    const [noti, setNoti] = useState([])
    const [redDot, setRedDot] = useState(false)
    

    useEffect(() => {
        if(user.id !== undefined) {
            const eventSource = new EventSource(`${process.env.REACT_APP_BASE_URL}/sub/${user.id}`)
    
            eventSource.addEventListener('connect', e => {
                console.log("data : " + e.data);
            })
            eventSource.addEventListener('sse', e => {
                setNoti(e.data);
                setRedDot(true)
            })
            eventSource.addEventListener("error", function (event) {
                if (event.target.readyState === EventSource.CLOSED) {
                console.log("eventsource closed");
                }
                eventSource.close();
            });
        }
    },[user])

    useEffect(()=>{
        const handleFocus = e => {
            if(noticeRef.current && !noticeRef.current.contains(e.target)) {                
                setActive(false)
            }
        }
        document.addEventListener('mouseup', handleFocus)
        return () => { document.removeEventListener('mouseup', handleFocus) }
    }, [ noticeRef ])


    const handleClick = async e => {
        e.preventDefault()
        if(active) {
            document.body.style.overflow = 'hidden'
            setActive(false)
            return
        }
        document.body.style.overflow = 'unset'
        setActive(true)
        noticeRef.current?.scrollTo({ top: 0, hefavior: 'smooth' })
        if(redDot) {
            try {
                await wouteAPI(`/noti`, 'POST', {myId : user.id})
                setRedDot(false)
            } catch (error) {
            }
        }
    }

    
    return (
        <div className={`navigation ${ active ? 'active' : '' }`}>
            <div className='inner'>
                <h1 className='logo'><Link to='/'>woute</Link></h1>
                <div className='gnb'>
                    <ul>
                        <li className='home'><NavLink to='/'>홈</NavLink></li>
                        <li className='course'><NavLink to='/p/courses'>코스</NavLink></li>
                        <li className='create'><NavLink to='/create' state={{ backgroundLocation: location }}>만들기</NavLink></li>
                        <li className='notice'>
                            <NavLink to='/notice' onClick={ handleClick }>알림</NavLink>
                            <div className={`redDot ${redDot ? '' : 'd-none'}`}></div>
                        </li>
                        <li className='chat'>
                            <NavLink to={`/chat/${user.id}`} state={{ backgroundLocation: location}}>채팅</NavLink>
                            <div className={`redDot ${chatNoti ? '' : 'd-none'}`}></div>
                            {/* <div className={`redDot`}></div> */}
                        </li>

                        <li className='profile'><NavLink to={`/users/${user.id}`}>
                            {
                                user?.profileImage == null ? (
                                    <i></i>
                                ) : (
                                    <i style={{backgroundImage: `url(${ user.profileImage })`}}></i>
                                )
                            }
                            프로필</NavLink>
                        </li>
                    </ul>
                    <Outlet />
                </div>
                <div className='terms'>
                    <ul>
                        <li>약관</li>
                        <li>채용정보</li>
                        <li>도움말</li>
                        <li>개인정보처리방침</li>
                    </ul>
                    <p>&copy; woute all right reserved</p>
                </div>
            </div>
            <div className="notification" ref={noticeRef}>
                <NotiList data={noti} user={user} setRedDot={setRedDot} active={setActive}/>
            </div>
        </div>
    )
}

export default Navigation