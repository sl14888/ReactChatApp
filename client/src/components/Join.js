import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { default as socket } from './ws';
import kubsu from '../img/kubsu.png';

function Join() {
  // считываю vмя и записываю в стейт
  const [nickname, setNickname] = useState();
  const history = useHistory();
  // через реакт роутер меняю url
  const handleOnClick = () => history.push(`/chat/${nickname}`);

  useEffect(() => {
    // записываю в локалсторедж подключение
    localStorage.setItem('chatConnected', 'true');
  }, []);

  const submitNickname = () => {
    // отправляю на сервер никнейм
    socket.emit('USER:NICKNAME', nickname);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="grid place-items-center my-auto">
        <img className="pb-5 h-30 w-25" src={kubsu} alt="kubsu" />
        <h1 className="font-bold text-4xl pb-5 text-gray-900 antialiased">Чат KUBSU</h1>
        <form className="flex flex-col justify-center">
          <div className="relative">
            <input
              type="text"
              onChange={(e) => setNickname(e.target.value)}
              className=" rounded-lg border-transparent mb-5 appearance-none border border-gray-300 py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
              placeholder="Имя пользователя"
            />
          </div>
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200"
            onClick={() => {
              submitNickname();
              handleOnClick();
            }}
            type="submit"
          >
            ВОЙТИ
          </button>
        </form>
      </div>
    </div>
  );
}

export default Join;
