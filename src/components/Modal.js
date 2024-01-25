import { useState, useEffect } from 'react'
import { Link, useLocation, Outlet, useParams } from 'react-router-dom'
import './../assets/styles/_modal.scss'
import PostType from './feed/PostType'
import CourseCreate from './feed/CourseCreate'
import CourseView from './feed/CourseView'
import ModalAddFeed from './feed/ModalAddFeed'
import ModalFeed from './feed/ModalFeed'
import ChatModal from './chatting/ChatModal'

function Modal({ wouteFeeds, setLoading, user }) {
    const location = useLocation()
    const { id } = useParams()
    const state = location.state && location.state?.backgroundLocation
    const [type, setType] = useState('')

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className='modal'>
            <div className='inner'>
                {
                    location.pathname === '/create' ? (
                        <><PostType type={ setType } user={ user }/>
                        { type === 'course' ? <CourseCreate type={'courses'} wouteFeeds={ wouteFeeds } setLoading={ setLoading } user={ user } /> 
                        : type === 'feed' ? <ModalAddFeed type={'feeds'} wouteFeeds={ wouteFeeds } setLoading={ setLoading } user={ user } /> : '' }</>
                    ) : (
                        location.pathname === `/p/${ id }` ? (
                            location.state.type === 'courses' ? <CourseView wouteFeeds={ wouteFeeds } setLoading={ setLoading } user={ user } /> : (
                                location.state.type === 'feeds' ? <ModalFeed wouteFeeds={ wouteFeeds } setLoading={ setLoading } user={ user } /> : ''
                            ) 
                        ) : (
                            location.pathname === `/chat` && (<ChatModal user={ user } />)
                        )
                    )
                }
                <Link to={ state } className='close'>닫기 <Outlet /></Link>
            </div>
        </div>
    )
}

export default Modal