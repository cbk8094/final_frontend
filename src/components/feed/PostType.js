import '../../assets/styles/_modal.scss'

function PostType({ type, user }) {
    return (
        <div className='between'>
            <div onClick={()=>type('course')}>
                <p>피드에 코스 남기기</p>
                <p><strong>{ user.nickname }</strong>님의 즐거운 여정을 <br />코스, 사진과 함께 기록합니다.</p>
                <p>코스 기록하기</p>
            </div>
            <div onClick={()=>type('feed')}>
                <p>피드에 게시글 남기기</p>
                <p><strong>{ user.nickname }</strong>님의 즐거운 여정을 <br />사진으로 기록합니다.</p>
                <p>게시물 기록하기</p>
            </div>
        </div>
    )
}

export default PostType