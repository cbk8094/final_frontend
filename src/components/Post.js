import { useEffect, useState } from 'react'
import { Link, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import { wouteAPI } from '../api'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Navigation } from 'swiper/modules'
import Hearts from './Hearts'
import FeedLike from './feed/FeedLike'

function Post({ data, wouteFeeds, user }) {
    const path = `/p/${ data.id }`
    const location = useLocation()
    const [like, setLike] = useState(false)
    const [likeId, setLikeId] = useState()

    useEffect(() => {
        const likedUsers = data.likes?.filter(me => me.userId === user.id)
        setLike(likedUsers.length > 0)
        if (likedUsers.length > 0) setLikeId(likedUsers[0].id) 
    }, [ data.likes, user ])

    const handleLike = async () => {
        if(like) {
            try {
                await wouteAPI(`${ path }/like/${ likeId }`, 'DELETE', null)
                setLike(prev => !prev)
            } catch(err) {
                console.log('에러: ' + err)
            }
        } else {
            const params = {
                userId: user.id,
                nickname: user.nickname,
                profileImage: user.profileImage,
            }
            try {
                await wouteAPI(`${ path }/like`, 'PUT', params)
                setLike(prev => !prev)
            } catch(err) {
                console.log('에러: ' + err)
            }
        }
        wouteFeeds()
    }
    
    return (
        <div className='post'>
            <div className='upper'>
                <Link to={`/users/${data.userId}`} className='user'>
                    {
                        data?.profileImage == null ? (
                            <i></i>
                        ) : (
                            <i style={{backgroundImage: `url(${ process.env.REACT_APP_IMAGE_PATH }${ data.profileImage })`}}></i>
                        )
                    }
                { data.nickname }</Link>
                { data.type === 'courses' && <Link to={ path } state={{ backgroundLocation: location, type: data.type }}>코스보기</Link> }
            </div>
            <div className='middle'>
                {
                    data?.attaches?.length > 1 ? (
                        <Swiper
                            navigation={ true }
                            pagination={{ dynamicBullets: true }}
                            modules={[ Pagination, Navigation ]}
                            onDoubleClick={ handleLike }
                        >   
                            {
                                data.attaches?.map(item => (
                                    <SwiperSlide key={ item.uuid }><img src={ `${process.env.REACT_APP_IMAGE_PATH}${item.uuid}` } alt='' /></SwiperSlide>
                                ))
                            }
                        </Swiper>
                    ) : (
                        <img src={ `${process.env.REACT_APP_IMAGE_PATH}${data?.attaches[0].uuid}` } alt='' />
                    )
                }
            </div>
            <div className='lower'>
                <div className='likes'>
                    <div className='heart' onClick={ handleLike }>
                        { like ? <Hearts /> : '' }
                    </div>
                    <Routes>
                        <Route path={ `${ path }/like` } element={<FeedLike likes={ data.likes } />} />
                    </Routes>
                    <Link to={ `p/${ data.id }/like` }>좋아요 { data.likes.length }개</Link>
                </div>
                <div className='description'>
                    <p>{ data.title }</p>
                    {
                        data?.tags.map(item => (
                            <span key={ item.id }>{ item.words }</span>    
                        ))
                    }
                </div>
                <Link to={ path } className='comment' state={{ backgroundLocation: location, type: data.type }}>
                <span className='user'>
                    {
                        user?.profileImage == null ? (
                            <i></i>
                        ) : (
                            <i style={{backgroundImage: `url(${ user.profileImage })`}}></i>
                        )
                    }
                    </span>
                    <span>댓글쓰기</span>
                </Link>
            </div>
            <Outlet />
        </div>
    )
}

export default Post