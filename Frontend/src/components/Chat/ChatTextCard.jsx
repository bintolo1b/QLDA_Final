function ChatTextCard(props){
    const typeOfText = props.typeOfText

    const styles = {
        chatMessages: {
            padding: "20px",
        },
        systemMessage: {
            color: "#666",
            fontSize: "14px",
            margin: "10px 0",
        },
        message: {
            display: 'flex',
            flexDirection: 'column',
            margin: "20px 0",
            position: 'relative'
        },
        messageTime: {
            color: "#666",
            fontSize: "12px",
            textAlign: "left",
            marginTop: "5px",
            marginLeft: typeOfText === 'taken' ? '55px' : 'auto',
            // ...(typeOfText === 'taken' ? { marginLeft: '55px' } : { marginLeft: '600px' })
        },
        messageContent: {
            background: typeOfText==='taken'?"#F5F5F5":'#E8EBFA',
            padding: "12px 16px",
            borderRadius: "8px",
            maxWidth: "80%",
            display: "inline-block",
            fontSize: '14px',
            marginLeft: typeOfText === 'taken' ? '50px' : 'auto',
            // ...(typeOfText === 'taken' ? { marginLeft: '50px' } : { marginLeft: '120px' })
        },
        avatar: {
            display: typeOfText === 'taken'?'inline-block':'none',
            width: '40px',
            borderRadius: '50%',
            position: 'absolute',
            bottom: '0',
            left: '0'
            // ...(typeOfText === 'taken' ? { left: '0' } : {right: '0'})
        }

    }
    return(
        <div style={styles.chatMessages}>
            <div style={styles.message}>
                <div style={styles.messageTime}>
                    <span>Trinh Cong Duy, </span>
                    <span>Thứ Năm 14:37</span>
                </div>
                <div style={styles.messageContent}>
                    Dạ em chào thầy, nhóm em xin phép gửi đề tài đề xuất của nhóm a.<br />
                    Đề tài: Hệ thống điểm danh lớp học tự động tích hợp chức năng quản lý lớp học (Auto Attendance System).<br />
                    Mô tả:<br />
                    - Nền tảng ứng dụng: Web tích hợp AI<br />
                    - Đối tượng sử dụng: Giảng viên, sinh viên<br />
                    - Chức năng điểm danh tự động: Sử dụng camera ở lớp dùng để nhận diện sinh viên, tiến hành điểm danh tự động.
                    - Chức năng điểm danh tự động: Sử dụng camera ở lớp dùng để nhận diện sinh viên, tiến hành điểm danh tự động.
                    - Chức năng điểm danh tự động: Sử dụng camera ở lớp dùng để nhận diện sinh viên, tiến hành điểm danh tự động.
                    - Chức năng điểm danh tự động: Sử dụng camera ở lớp dùng để nhận diện sinh viên, tiến hành điểm danh tự động.
                    <img style={styles.avatar} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpPrwRbbdLXzdJwLOy9ICOec2MEnh-UU8W7w&s" alt="" />
                </div>
            </div>
        </div>
    )
}

export default ChatTextCard