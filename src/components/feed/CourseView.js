import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Map, MapMarker, Polyline, CustomOverlayMap } from 'react-kakao-maps-sdk'
import './../../assets/styles/_trip.scss'
import one from './../../assets/images/one.png'
import two from './../../assets/images/two.png'
import three from './../../assets/images/three.png'
import four from './../../assets/images/four.png'
import five from './../../assets/images/five.png'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Pagination, Navigation } from 'swiper/modules'
import { wouteAPI } from './../../api'
import Reply from './Reply'

const { kakao } = window
function CourseView({ wouteFeeds, setLoading, user }) {
    const { id } = useParams()
    const feedId = id
    const [feed, setFeed] = useState([])
    const [markers, setMarkers] = useState([])
    const [map, setMap] = useState()
    const [data, setData] = useState()
    const [info, setInfo] = useState()
    const [active, setActive] = useState(false)
    
    useEffect(() => {
        if (!map) return
        const feedData = async () => {
            try {
                const feedList = await wouteAPI(`/p/${ id }`, 'GET', null)
                setFeed(feedList.data)
                const spot = feedList.data.courses
                const bounds = new kakao.maps.LatLngBounds()
                let markers = []
                
                for (let i = 0; i < spot.length; i++) {
                    let orders = null
                    if(i === 0) orders = `${ one }`
                    if(i === 1) orders = `${ two }`
                    if(i === 2) orders = `${ three }`
                    if(i === 3) orders = `${ four }`
                    if(i === 4) orders = `${ five }`
                    markers.push({ lat: spot[i].latitude, lng: spot[i].longitude })
                    spot[i].position = { lat: spot[i].latitude, lng: spot[i].longitude } 
                    spot[i].src = orders
                    bounds.extend(new kakao.maps.LatLng(spot[i].latitude, spot[i].longitude))
                }
                setData(spot)
                setMarkers(markers)
                setTimeout(()=>{ map.setBounds(bounds) }, 100)
            } catch(err) {
                console.log('에러: ' + err)
            }
        }
        feedData()
    }, [ map ])

    const handleHover = item => {
        setInfo(true)
        const bounds = new kakao.maps.LatLngBounds()
        const marker = new kakao.maps.LatLng(item.latitude, item.longitude)
        const position = bounds.extend(marker)
        map.setBounds(position)
        setTimeout(()=>{ setInfo(false) }, 3000)
    }

    return (
        <div className='trip'>
            <div className='view'>
                <div className='service'>
                    <div className='courseRoot'>
                        <button className='tab' onClick={()=>setActive(true)}>사진 보기</button>
                        <div className='maps'>
                            <Map 
                                key={ id }
                                center={{ lat: 33.450701, lng: 126.570667 }}
                                style={{ width: '100%', height: '100%' }}
                                level={ 4 }
                                onCreate={ setMap }
                            >
                                <Polyline
                                    path={ markers }
                                    strokeWeight={ 3 }
                                    strokeColor={ '#595757' } 
                                    strokeOpacity={ 0.7 } 
                                    strokeStyle={ 'dash' } 
                                />
                                { 
                                    data?.map((item, i) => (
                                        <>
                                        <MapMarker
                                            key={`${ item.id }-${ item.position }`}
                                            position={ item.position }
                                            image={{
                                                src: `${ item.src }`,
                                                size: { width: 22, height: 22 },
                                            }}
                                            title={ item.store }
                                        />
                                        {info && (
                                        <CustomOverlayMap 
                                            key={ `${ item.position.lat }-${ item.position.lng }` }
                                            position={ item.position }
                                            yAnchor={ 0.5 }
                                            >
                                            <div className='overlay'>
                                                <strong>{ item.store }</strong>
                                                <span>{ item.category }</span>
                                                <span>{ item.phone }</span>
                                                <Link to={ item.homepage } target='_blank'>홈페이지</Link>
                                            </div>
                                        </CustomOverlayMap>
                                        )}
                                        </>
                                    ))
                                }
                            </Map>
                        </div>
                        <div className='orderList'>
                            <ul>
                                {
                                    data?.map((item, i) => (
                                        <li key={ item.id }>
                                            <strong 
                                                onClick={()=>handleHover(item)}
                                                // onMouseLeave={()=>setInfo(false)}
                                            >
                                                { item.store }
                                            </strong>
                                            <span>{ item.category }</span>
                                            <span>{ item.address }</span>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className={`coursePhoto ${ active ? 'active' : '' }`}>
                        <button className='tab' onClick={()=>setActive(false)}>코스 보기</button>
                        {
                            <Swiper
                                navigation={ true }
                                pagination={{ dynamicBullets: true }}
                                modules={[ Pagination, Navigation ]}
                            >
                                {
                                    feed?.attaches?.map(item => (
                                        <SwiperSlide key={ item.uuid }><img src={ `${process.env.REACT_APP_IMAGE_PATH}${item.uuid}` } alt='' /></SwiperSlide>
                                    ))
                                }
                            </Swiper>
                        }
                    </div>
                </div>
                <div className='inform'>
                    <Reply feedData={ feed } wouteFeeds={ wouteFeeds } setLoading={ setLoading } user={ user } />
                </div>
            </div>
        </div>
    )
}

export default CourseView