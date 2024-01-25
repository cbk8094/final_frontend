import { useEffect, useState } from "react"
import { wouteAPI } from "../../api";
import { Link, useLocation } from "react-router-dom";

export default function MyFeeds({feeds}) {
    const location = useLocation()
    
    const devidePosts = (data) => {
        const arr = [...data];
        let tmp = [];
        const length = data.length;
        for (let i = 0; i <= length / 3; i++) {
          tmp = [...tmp, [...arr.splice(0, 3)]];
        }
        return tmp;
      };
    return(
        <>
        {devidePosts(feeds).map((row,index) => (
            <article key={index}>
                {[0,1,2].map((i) => 
                row[i] && row[i].attaches && row[i].attaches.length > 0  ? (
                    <Link to={`/p/${row[i].id}`} state={{ backgroundLocation: location, type: row[i].type}} key={i}>
                        {/* <img src={`http://localhost:8081/file/${row[i].attaches[0].uuid}`} /> */}
                        <img src={`${process.env.REACT_APP_IMAGE_PATH}${row[i].attaches[0].uuid}`} />
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
        </>
    )
}