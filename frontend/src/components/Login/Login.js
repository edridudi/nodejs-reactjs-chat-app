import React, { useState } from 'react';
import bg from '../../img/bg.png';
import Button from '@material-ui/core/Button';
import './Login.css';

export const Login = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('public');

  const handleKeyPress = e => {
    if (e.charCode === 13) {
      handleSubmit();
    }
  };
  const handleSubmit = e => {
    return (!name || !room) ? e.preventDefault() : null
    // return (!name) ? e.preventDefault() : null
  };

  return (
    <div className="joinOuterContainer" style={{backgroundImage: `url(${bg})`}}>
      <div className="joinInnerContainer">
        <form action="/chat">
          <h1 className="heading">Login</h1>
          <div className="inputContainer">
            <input placeholder="Nickname" name="name" className="joinInput" type="text" onChange={(event) => setName(event.target.value)} onKeyPress={handleKeyPress} />
            <img src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_user-512.png" id="input_img"  alt="" />
          </div>
          <div>
            <input placeholder="Room" name="room" value={room} className="joinInput" style={{display:'none'}} type="text" onChange={(event) => setRoom(event.target.value)} />
          </div>
          <Button type="submit" fullWidth variant="contained" className="submitButton" disabled={name==null || name === ''}>SIGN IN</Button>
        </form>
      </div>
    </div>
  );
}