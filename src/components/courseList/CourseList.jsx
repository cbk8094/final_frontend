import { useLocation } from 'react-router';
import { wouteAPI } from '../../api';
import '../../assets/styles/_courseList.scss';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Search from '../Search';

export default function CourseLlist() {
    const location = useLocation()
    const [courseList, setCourseList] = useState([])

    const courses = async () => {
        const response = await wouteAPI('/p/courses', 'GET')
        setCourseList(response.data)
        console.log(response.data.reverse());
    }
    
    useEffect(() => {
        courses()
    },[])

    const devidePosts = (data) => {
        const arr = [...data];
        let tmp = [];
        const length = data.length;
        for (let i = 0; i <= length / 3; i++) {
          tmp = [...tmp, [...arr.splice(0, 3)]];
        }
        return tmp;
      };
    
    return (
        <div className='main'>
            <div className='clMain'>
                <div className='section'>
                    <Search/>
                    <article >
                        {devidePosts(courseList).map((row, index) => (
                            <div className='courseList' key={index}>
                                {[0, 1, 2].map((i) =>
                                row[i] && row[i].attaches && row[i].attaches.length > 0  ? (
                                    <Link to={`/p/${row[i].id}`} className='view' state={{ backgroundLocation: location, type: row[i].type}} key={i}>
                                            <img src={`${process.env.REACT_APP_IMAGE_PATH}${row[i].attaches[0].uuid}`} key={row[i].id} />
                                            <div className='feedHover'>
                                                <ul className='prevInfo'>
                                                    <li>{row[i].heartCount}</li>
                                                    <li>{row[i].replyCount}</li>
                                                </ul>
                                            </div>
                                        </Link>
                                        ) : (
                                            <div className="none_image" key={i}></div>
                                        )
                                    )}
                            </div>
                        ))}
                    </article>
                </div>
            </div>
        </div>
    )
}