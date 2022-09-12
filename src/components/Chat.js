import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useParams, useHistory } from 'react-router-dom';
import { default as socket } from './ws';
import UserOnline from './UserOnline';

function Chat() {
  // получаем параметры маршрута с юрл
  let { user_nickName } = useParams();
  const [nickname, setNickname] = useState('');
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([]);
  const [usersOnline, setUsersOnline] = useState([]);
  const [toUser, setToUser] = useState('');
  const history = useHistory();

  useEffect(() => {
    // проверяем если юзер не подключился, меняем юрл
    if (!localStorage.getItem('chatConnected')) {
      history.push(`/`);
    }

    // если юзер покинул стр то отклчаем его (в локалСторедж)
    window.addEventListener('beforeunload', () =>
      localStorage.removeItem('chatConnected')
    );

    // записываем имя в стейт
    setNickname(user_nickName);

    // отправляем на сервер данные
    socket.on('CHAT:MESSAGE', ({ nickname, msg }) => {
      setChat([...chat, { nickname, msg }]);
    });

    socket.on('private msg', ({ id, nickname, msg }) => {
      setChat([...chat, `🔒 Приватное сообщение от ${nickname}: ${msg}`]);
    });

    //  скроллим вниз при новом сообщении
    let objDiv = document.getElementById('msg');
    objDiv.scrollTop = objDiv.scrollHeight;

    return () => {
      // отключаем сокет
      socket.off();
    };
  }, [chat, toUser, user_nickName, history]);

  useEffect(() => {
    // получаем список с сервера и записываем в стейт на клиенте
    socket.on('USER:ON', (list) => {
      setUsersOnline(list);
    });
    //  получаем с сервера никнейм подключенного
    socket.on('USER:CONNECT', (user) => {
      setChat([...chat, `🎉 Пользователь ${user} подключился`]);
    });

    socket.on('USER:DISCONNECTED', (user) => {
      // если такого юзера нет то отключаем его
      if (user !== null) {
        setChat([...chat, `${user} 👋🏻 покинул чат`]);
      }
    });

    return () => {
      socket.off();
    };
  }, [chat]);

  // отправка сообщения
  const submitMsg = (e) => {
    e.preventDefault();

    // валидация
    if (msg === '') {
      toast('Введите сообщение', {
        duration: 4000,
        style: {},
        className: '',
        icon: '⚠️',
        role: 'status',
        ariaLive: 'polite',
      });
    } else if (toUser === nickname) {
      toast('Вы не можете написать самому себе.', {
        duration: 2000,
        style: {},
        className: '',
        icon: '⚠️',
        role: 'status',
        ariaLive: 'polite',
      });
    } else if (toUser !== '') {
      socket.emit('CHAT:MESSAGE private', { toUser, nickname, msg });
      setChat([...chat, { nickname, msg }]);
      setChat([...chat, `🔒 Приватное сообщение для ${toUser}: ${msg}`]);
      setMsg('');
      // setToUser('');
    } else {
      socket.emit('CHAT:MESSAGE', { nickname, msg });
      setChat([...chat, { nickname, msg }]);
      setMsg('');
    }
  };
  // сохраняем пользователей которые онлайн в стейт
  const saveUserToPrivateMsg = (userID) => {
    setToUser(userID);
  };

  return (
    <div className="flex w-screen main-chat lg:h-screen bg-gray-150 ">
      {/*  Уведомления */}
      <Toaster />
      <div className="flex w-full lg:w-5/6 lg:h-5/6 lg:mx-auto lg:my-auto shadow-md">
        {/* Онлайн пользователи */}
        <div className="hidden lg:block pl-4 pr-4 w-64 bg-gray-200">
          <p className="font-black my-4 text-xl divide-y divide-gray-900">
            🌐 Онлайн: ({usersOnline !== null ? usersOnline.length : '0'}):
          </p>
          <ul className="truncate">
            <button
              className="py-2 bg-gray-50 mt-3 mb-3 w-full rounded-md focus:outline-none"
              onClick={(e) => setToUser('')}
            >
              Написать глобально
            </button>
            {usersOnline !== null
              ? usersOnline.map((el, index) => (
                  <button
                    key={index}
                    onClick={() => saveUserToPrivateMsg(el)}
                    className="test-test-html-class block focus:outline-none w-full mb-3 truncate"
                  >
                    <UserOnline nickname={el} />
                  </button>
                ))
              : ''}
          </ul>
        </div>
        <div className="flex flex-col flex-grow lg:max-w-full bg-gray-100">
          {/* Сообщения */}
          <p className="font-black mt-4 mb-2 pb-4 pl-4 lg:pl-8 text-2xl border-b-2">
            {toUser === '' ? `🌍 Глобальный чат` : `👨‍💼 Чат с пользователем ${toUser}`}
          </p>
          <div
            id="msg"
            className="messages h-5/6 overflow-y-auto pl-4 lg:pl-8 pt-4 mb-2 lg:mb-0"
          >
            <ul className="w-96">
              {/* выводим сообщения глобально */}
              {chat.map((el, index) => (
                <li key={index} className="text-white break-words pr-6">
                  {el.nickname != null ? (
                    <p className="pl-2 text-white font-semibold bg-blue-400 mb-3 rounded py-3">
                      {el.nickname}: {el.msg}
                    </p>
                  ) : (
                    <p className="pl-2 text-white font-semibold bg-indigo-400  mb-3 rounded py-3">
                      {el}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <form>
            <div className="px-4">
              {/* выбираем из селекта юзеров */}
              <select
                className="hidden text-xs appearance-none flex-1 w-full py-2 px-1 lg:px-4 placeholder-gray-400 shadow-sm focus:outline-none"
                id="usersOn"
                onChange={(e) => saveUserToPrivateMsg(e.target.value)}
              >
                <option value="">Всем</option>
                {usersOnline !== null
                  ? usersOnline.map((el, index) => (
                      <option value={el} className="" key={index}>
                        {el}
                      </option>
                    ))
                  : ''}
              </select>
            </div>
            <div className="w-full flex pb-4 lg:p-4 bg-purple-50">
              <div className="flex relative w-full lg:w-5/6">
                <span className="rounded-l-md inline-flex items-center border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
                  {toUser === '' ? (
                    <p className="bg-blue-400 text-white text-xs lg:text-base font-normal w-20 p-2 rounded-l-md">
                      Всем
                    </p>
                  ) : (
                    <p className="bg-blue-500 text-white text-xs lg:text-base p-2 w-20 rounded-l-md">
                      {toUser}
                    </p>
                  )}
                </span>
                <input
                  type="text"
                  className="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-1 lg:px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none"
                  name="message"
                  onChange={(e) => setMsg(e.target.value)}
                  value={msg}
                />
              </div>
              <div className="hidden lg:block w-1/6">
                <button
                  className="ml-8 flex-shrink-0 bg-blue-500 text-white text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2"
                  onClick={(e) => submitMsg(e)}
                >
                  Отправить
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chat;
