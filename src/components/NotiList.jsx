import { useEffect, useState } from "react"
import { wouteAPI } from "../api"
import { Link, useLocation } from "react-router-dom"
import moment from "moment"

export default function NotiList({data, user, active, setRedDot}) {
    const [notis, setNotis] = useState([])
    const location = useLocation()
    
    const getNoti = async () => {
        const response = await wouteAPI(`/noti/${user.id}`, 'GET') 
        if(response.data[0] && !response.data[0].read) {
            setRedDot(true)
        }
        setNotis(response.data)
    }
    useEffect(() => {
        if(user.id !== undefined) {
            getNoti()
        }
    },[ user, data ])

    const handleNavi = () => {
        active(false)
    }

    return (
            <>
            <div className='title'>알림</div>
            <ul>
                {notis.map(item => {
                    return(
                        item.senderUrl.indexOf('/p') != -1 ? (
                            <li key={item.id}>
                                <Link to={item.senderUrl} state={{ backgroundLocation: location, type: item.type }} onClick={ handleNavi }> 
                                <div className='user'>
                                    <i style={{backgroundImage: `url(${process.env.REACT_APP_IMAGE_PATH}${item.profileImg})`}}></i>
                                </div>
                                <div className='activity'>
                                    <strong>{item.nickname}</strong>
                                    {item.content}
                                    <span>{moment(item.createdAt).fromNow()}</span>
                                </div>
                                </Link>
                            </li>
                        ) : (
                            <li key={item.id}>
                                <div className='user'>
                                    <Link to={item.senderUrl} onClick={ handleNavi }>
                                        <i style={{backgroundImage: `url(${process.env.REACT_APP_IMAGE_PATH}${item.profileImg})`}}></i>
                                    </Link>
                                </div>
                                <div className='activity'>
                                    <Link to={item.senderUrl} onClick={ handleNavi }>
                                    <strong>{item.nickname}</strong>
                                    </Link>
                                    {item.content}
                                    <span>{moment(item.createdAt).fromNow()}</span>
                                </div>
                            </li>
                        )
                    )
                })}
            </ul>
        </>
    )
}