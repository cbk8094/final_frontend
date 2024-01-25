import './../assets/styles/_layer.scss'

function Layer({ message, handleController }) {
    const handleConfirm = () => {
        handleController(true)
    }

    const handleCancel = () => {
        handleController(false)
    }

    return (
        <div className='layer'>
            <div className='confirm'>
                <p>{ message }</p>
                <div className='button'>
                    <button onClick={ handleConfirm }>확인</button>
                    <button onClick={ handleCancel }>취소</button>
                </div>
            </div>
        </div>
    )
}

export default Layer