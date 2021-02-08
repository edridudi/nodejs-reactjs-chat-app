import React from 'react';
import ReactEmoji from 'react-emoji'
import './Message.css';
import Stc from "string-to-color";

export const Message = ({message: { user, text, time }, name}) => {
    let isSentByCurrentUser = false;
    let isAdminMsg = false;
    let isDate = false;
    const myName = name.trim();
    const trimmedName = name.trim().toLowerCase()
    if (user === 'admin') {
        isAdminMsg = true;
    } else if (user === 'date') {
        isDate = true;
    } else {
        if (user === trimmedName) {
            isSentByCurrentUser = true
        }
    }

    function getColor(value) {
        return Stc(value).replace('#','');
    }

    function checkRTL(s){
        let ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' +
            '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
            rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
            rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');
        return rtlDirCheck.test(s);
    }

    function formatTime(time) {
        let date = new Date(time);
        // console.log(date.toUTCString());
        return ("0" + date.getHours()).slice(-2)+":"+("0" + date.getMinutes()).slice(-2);
    }

    let isRTL = checkRTL(text);
    let timeText =  formatTime(time)

    return (
        isAdminMsg ? (
            <div className="messageContainer justifyCenter">
                <div className="messageBox backgroundYellow">
                    <p className="messageText">{text}</p>
                </div>
            </div>
        ) : isDate ? (
            <div className="messageContainer justifyCenter">
                <div className="messageBox backgroundLightBlue">
                    <p className="messageText">{text}</p>
                </div>
            </div>
        ) : isSentByCurrentUser ? (
            <div className="messageContainer justifyEnd">
                <div className="messageBox background">
                    <p className={isRTL ? `messageTextRTL` : `messageText`}>{ReactEmoji.emojify(text)}</p>
                    <span className={isRTL ? `msgTimeStampRTL` : `msgTimeStamp`}>{timeText}</span>
                </div>
                <span className="bubbleTailOther"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"/><path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"/></svg></span>
                <img src={`https://ui-avatars.com/api/?name=${myName}&rounded=true&size=40&background=${getColor(myName)}&color=fff&font-size=0.4&bold=true`} className="userAvatar" alt="" />
            </div>
        ) : (
            <div className="messageContainer justifyStart">
                <img src={`https://ui-avatars.com/api/?name=${user}&rounded=true&size=40&background=${getColor(user)}&color=fff&font-size=0.4&bold=true`} className="userAvatar" alt="" />
                <span className="bubbleTail"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 13" width="8" height="13"><path opacity=".13" d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"/><path fill="currentColor" d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"/></svg></span>
                <div className="messageBox backgroundLight">
                    <p className={isRTL ? `messageTextRTL` : `messageText`}><span className="userName" style={{color:`#${getColor(user)}`}}>{user}</span>{ReactEmoji.emojify(text)}</p>
                    <span className={isRTL ? `msgTimeStampRTL` : `msgTimeStamp`}>{timeText}</span>
                </div>
            </div>
        )
    )
}