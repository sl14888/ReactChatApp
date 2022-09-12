const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 8080;

///////////////MySQL//////////////////
const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'chatapp',
  password: '',
});

conn.connect((error) => {
  if (error) {
    console.log(error, 'ошибка(((!');
    return error;
  } else {
    console.log('SqlDB -> OK');
  }
});

let queryString = 'SELECT * FROM users';

conn.query(queryString, (err, result) => {
  if (err) {
    console.log(err, 'ошибка!');
  }
  if (result) {
    console.log('БД', result);
  }
});

///////////////////////////////////

// массив с подключенными пользователями
let usersConnected = new Map();

io.on('connection', (socket) => {
  // достаю через деструкторизацию id пользователя
  let { id } = socket.client;

  socket.on('USER:NICKNAME', (nickname) => {
    // mySql запрос
    let sqlData = [null, nickname];

    const sql = 'INSERT INTO users VALUES (?, ?)';

    conn.execute(sql, sqlData, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log('В БД добавлен пользователь:', nickname);
      }
    });

    // 1) клиент отправляет имя на сервер, мы добовляем его в map и добовляем его сокет ид и клиент ид
    usersConnected.set(nickname, [socket.client.id, socket.id]);
    //  2) Отправляем список пользователей на клиент
    io.emit('USER:ON', Array.from(usersConnected.keys()));

    //  3) Отправляем всем пользователям, кроме себя, предупреждение о подключении нового пользователя
    socket.broadcast.emit('USER:CONNECT', nickname);
  });

  // отправляем сообщение глобально
  socket.on('CHAT:MESSAGE', ({ nickname, msg }) => {
    socket.broadcast.emit('CHAT:MESSAGE', { nickname, msg });
  });

  // отправляем сообщение приватно
  socket.on('CHAT:MESSAGE private', ({ toUser, nickname, msg }) => {
    // берем из мепа ид юзера
    let socketId = usersConnected.get(toUser)[1];
    // отправляем по ид приватное сообщение
    io.to(socketId).emit('private msg', { id, nickname, msg });
  });

  // отключение
  socket.on('disconnect', () => {
    let tempUserNickname;
    // ищем юзера по ключу
    for (let key of usersConnected.keys()) {
      // если находит то удаляем
      if (usersConnected.get(key)[0] === id) {
        tempUserNickname = key;
        // console.log(tempUserNickname);
        usersConnected.delete(key);
        break;
      }
    }
    // Отправляем клиенту обновленный список подключенных пользователей
    io.emit('USER:ON', Array.from(usersConnected.keys()));

    // Отправляем клиентам ник пользователя, который был отключен
    socket.broadcast.emit('USER:DISCONNECTED', tempUserNickname);
  });
});

server.listen(PORT, () => console.log(`Сервер на порту *: ${PORT}`));
