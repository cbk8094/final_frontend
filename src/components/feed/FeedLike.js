import { Link, useNavigate } from 'react-router-dom'
import '../../assets/styles/_follow.scss'
import { useEffect } from 'react'

function FeedLike({ likes }) {
    const navigate = useNavigate()
    const back = () => {
        navigate(-1)
    }
    
    return (
        <div className='minModal'>
            <div className='inner'>
                <div className='follow'>
                    <div className='fol-header'>
                        <div className='head'>좋아요</div>
                        <div><button className='exit-btn' onClick={ back }></button></div>
                    </div>
                    <div className='fol-wrap'>
                        <div className='fol-list'>
                            {
                                likes?.map(item => (
                                    <div className='fol-tab' key={ item.id }>
                                        <div className='profileImg'>
                                            <Link to={`/users/${item.userId}`}>
                                                <img src={ `${ process.env.REACT_APP_IMAGE_PATH }${ item.profileImage }` } alt='' />
                                            </Link>
                                        </div>
                                        <div className='tab-info'>
                                            <div className='tab-name'>
                                                <Link to={`/users/${item.userId}`}>
                                                    <h2>{ item.nickname }</h2>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FeedLike