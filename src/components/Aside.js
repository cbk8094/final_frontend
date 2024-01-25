import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Aside({ data }) {
    const location = useLocation()
    const [popular, setPopular] = useState([])

    useEffect(() => {
        const sort = [...data].sort((a, b) => b.heartCount - a.heartCount)
        setPopular(sort)
    }, [ data ])

    return (
        <div className='aside'>
            <div className='inner'>
                <h4>좋아요 순위</h4>
                <ul>
                    {
                        popular.slice(0, 3).map(item => (
                            <li key={ item.id }>
                                <Link to={ `/p/${ item.id }` } state={{ backgroundLocation: location, type: item.type }}>
                                    <div className='upper'>
                                    {
                                        item?.profileImage == null ? (
                                            <i></i>
                                        ) : (
                                            <i style={{backgroundImage: `url(${ process.env.REACT_APP_IMAGE_PATH }${ item.profileImage })`}}></i>
                                        )
                                    }
                                        { item.nickname }
                                    </div>
                                    <div className='middle'>
                                        <img src={ `${process.env.REACT_APP_IMAGE_PATH}${item?.attaches[0].uuid}` } alt='' />
                                        <div className='description'>
                                            <p>{ item.title }</p>
                                            {
                                                item?.tags?.map(item => (
                                                    <span key={ item.id }>{ item.words }</span>    
                                                ))
                                            }
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default Aside