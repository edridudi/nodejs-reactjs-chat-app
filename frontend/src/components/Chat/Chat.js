import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import 'font-awesome/css/font-awesome.min.css';
import {UsersContainer} from '../UsersContainer/UsersContainer'
import './Chat.css';
import SendIcon from '@material-ui/icons/Send';
import IconButton from "@material-ui/core/IconButton";
import UIfx from 'uifx'
import bellAudio from '../../sounds/accomplished-579.mp3'
import bg from "../../img/bg.png";
import ScrollToBottom from "react-scroll-to-bottom";
import {Message} from "../Message/Message";

let socket;
const bell = new UIfx(bellAudio)

export const Chat = ({ location }) => {
  const [name, setName] = useState('');
  // const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'https://reactjs-nodejs-chat-backend.herokuapp.com/';

  function onMessageChange(e) {
    setMessage(e.target.value);
  }

  useEffect(() => {
    console.log("render");
    const parsedUri = queryString.parse(location.search);
    const myName = parsedUri.name;
    const myRoom = parsedUri.room;
    socket = io(ENDPOINT);
    // setRoom(myRoom);
    setName(myName);
    socket.emit('join', { name: myName, room: myRoom }, (error) => {
      if (error) {
        alert(error);
        window.location.href = '/';
      }
    });
  }, [location.search]);

  useEffect(() => {
    const parsedUri = queryString.parse(location.search);
    const myName = parsedUri.name;
    let date = ''
    socket.on('message', message => {
      // Check Date if Day Changed -> Send "date" Message
      if (message.time) {
        let newDate = (new Date(message.time)).toLocaleDateString('uk-UA');
        if (date!==newDate) {
          date = newDate;
          let dateText = date;
          if (date === (new Date()).toLocaleDateString('uk-UA')) {
            dateText = 'Today'
          }
          setMessages(msgs => [ ...msgs, {user: "date", text: dateText} ]);
        }
      }
      // Check whether to Play Sound on Msg Received - Play when msg is not old and msg sender is not this client or admin/date msg.
      if (!message.old && message.user !== myName.toLowerCase() && message.user !== "admin" && message.user !== "date") {
        bell.play();
      }
      setMessages(msgs => [ ...msgs, message ]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [location.search]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      let time = new Date();
      // let timeText = ("0" + time.getHours()).slice(-2)+":"+("0" + time.getMinutes()).slice(-2)
      let msg = { text: message, time: time};
      socket.emit('sendMessage', msg, () => setMessage(''));
    }
  }

  return (
      <div className="outerContainer">
        <div className="innerContainer">
          <UsersContainer users={users} myname={name} socket={socket} />
          <div className="container">
            <div className="infoBar">
              <div className="leftInnerContainer">
                {/*<h3>{room}</h3>*/}
              </div>
            </div>
            <div className="messagesContainer" style={{backgroundImage: `linear-gradient(to bottom, #ffb09421, #ffb0941f),url(${bg})`}}>
              <ScrollToBottom className="messages" followButtonClassName="stickToBottomButton" debug={false}>
                {messages.map((msg, i) => <div key={i}><Message message={msg} name={name}/></div>)}
              </ScrollToBottom>
            </div>
            <form className="form">
              <input className="input" type="text" placeholder="Type a Message" value={message} onChange={onMessageChange} onKeyPress={e => e.key === 'Enter' ? sendMessage(e) : null }/>
              <div className="sendButton">
              <IconButton color="inherit" aria-haspopup="true" onClick={(e) => sendMessage(e)} disabled={message==null || message === ''}>
                <SendIcon />
              </IconButton>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}