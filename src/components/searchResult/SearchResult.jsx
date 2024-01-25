import { Link, useLocation, useParams } from 'react-router-dom';
import { wouteAPI } from '../../api';
import '../../assets/styles/_searchResult.scss';
import { useEffect, useState } from 'react';
import Search from '../Search';

export default function SearchResult() {
    const location = useLocation()
    const [results, setResults] = useState([])
    const {keyword} = useParams()

    const getSearch =  async () => {
        const response = await wouteAPI(`${location.pathname}`, 'GET')
        console.log(response.data);
        console.log('results : ' +response.data);
        setResults(response.data.reverse())
    }

    useEffect(() => {
        getSearch()
    },[keyword])
    
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
            <div className='srMain'>
                <div className='section'>
                    <Search/>
                    <div className="searchResult">
                        <div className='rsHead'>
                            <div className='rsImg'>
                                <div className='firstImg'>
                                    <img src={`${process.env.REACT_APP_IMAGE_PATH}${results[0] && results[0].attaches && results[0].attaches[0].uuid}`} />
                                </div>
                            </div>
                            <div className='rsInfoWrap'>
                                <div className='rsInfo'>
                                    <div className='keyword'>
                                        {/* #태그명 */}
                                        <span>#{keyword}</span>
                                    </div>
                                    <div className='amount'>
                                        게시물
                                        {/* 해당태그 게시글 */}
                                        <span>{results.length}개</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='resultList'>
                            <h2>
                                <div>인기 게시물</div>
                            </h2>
                            {devidePosts(results).map((row,index) => (
                                <article key={index}>
                                    {[0,1,2].map((i) => 
                                    row[i] && row[i].attaches && row[i].attaches.length > 0  ? (
                                        <Link to={`/p/${row[i].id}`} state={{ backgroundLocation: location, type: row[i].type}} key={i}>
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
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}