import { useEffect, useState, useRef } from 'react'
import { wouteAPI } from './../api'
import Search from './Search'
import Aside from './Aside'
import Post from './Post'
import './../assets/styles/_loader.scss'


function Main({ data, limits, total, wouteFeeds, loading, user }) {
    const target = useRef()
    const [offset, setOffset] = useState(1)
    const [end, setEnd] = useState(limits)

    useEffect(() => {
        setEnd(offset * limits)
    }, [ offset ])

    useEffect(() => {
        if(loading) {
            const observer = new IntersectionObserver(
                entries => {
                    if(entries[0].isIntersecting) {
                        handleObserve()
                    }
                },
                { threshold: 1 }
            )
            observer.observe(target.current)
        }
    }, [ loading ])

    const handleObserve = () => {
        setTimeout(() => {
            setOffset(prev => prev + 1)
        }, 1200)
	}

    return (
        <div className='main'>
            <div className='section'>
                <Search />
                <div className='feeds'>
                    {
                        loading ? (
                            <>
                                {
                                    data?.slice(0, end).map(item => (
                                        <Post key={ item.id } data={ item } wouteFeeds={ wouteFeeds } user={ user } />
                                    ))
                                }
                                <div ref={ target } className='observer'>
                                    { offset <= total ? <div></div> : '' }
                                </div>
                                
                            </>
                        ) : (
                            <div className='intro'></div>
                        )
                    }
                </div>
            </div>
            <Aside data={ data } />
        </div>
    )
}

export default Main