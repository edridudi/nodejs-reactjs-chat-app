const users = [];

const addUser = ({ id, name, room, ip }) => {
  name = name.trim().toLowerCase();
  if (room) {
    room = room.trim().toLowerCase();
  } else {
    room = "public"
  }
  if (!name || !room) return { error: 'Username and room are required.' };
  const existingUser = users.find((user) => user.room === room && user.name === name);
  if (existingUser) {
    // console.log("existingUser Ip: "+existingUser.ip)
    // console.log("New User Ip: "+ip)
    if (existingUser.ip !== ip) {
      return { error: 'Username is Taken' };
    } else if (existingUser.id !== id) {
      removeUser(id);
      users.push(existingUser);
    }
    return existingUser;
  } else {
    const user = { id, name, room, ip };
    users.push(user);
    return { user };
  }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };