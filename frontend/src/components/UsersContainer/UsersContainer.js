import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from "react-router-dom";
import Stc from 'string-to-color';
import './UsersContainer.css';

export const UsersContainer = ({ users,myname,socket }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    let newUsers = [];
    for (let i = 0 ; i<users.length ; i++) {
        if (users[i].name.toLowerCase() !== myname.toLowerCase()) {
            newUsers.push(users[i]);
        }
    }

    function getColor(value) {
        return Stc(value).replace('#','');
    }

    function disconnect() {
        socket.disconnect();
    }

return(

  <div className='usersContainer'>
      <div className="activeItem">
          <div className="userTitle">
            <img src={`https://ui-avatars.com/api/?name=${myname}&rounded=true&size=40&background=${getColor(myname)}&color=fff&bold=true`} className="userAvatar" alt="" />{myname}
          </div>
          <div className="menuButton">
              <IconButton color="inherit" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                  <MoreVertIcon />
              </IconButton>
              <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                  <MenuItem component={Link} to="/" onClick={disconnect}>Logout</MenuItem>
              </Menu>
          </div>
      </div>
    {newUsers ? (
      <div>
        <div className='activeContainer'>
            {newUsers.map(({ name }) => (
              <div className="userEntry" key={name}>
                  <img src={`https://ui-avatars.com/api/?name=${name}&rounded=true&size=32&background=${getColor(name)}&color=fff&bold=true`} className="userAvatar32" alt="" />
                  {name}
              </div>
            ))}
        </div>
      </div>
    ) : null}
  </div>
)};
