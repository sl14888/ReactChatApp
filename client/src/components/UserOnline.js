import React from 'react';

function UserOnline({ nickname }) {
  return (
    <li className="w-full flex justify-start drop-shadow-md py-2 bg-gray-50 hover:bg-gray-100 hover:drop-shadow-2xl hover:text-black cursor-pointer rounded-md">
      <div className="flex items-center">
        <div className="block pr-2">
          <img
            alt="avatar"
            src="https://downtownsandiego.org/wp-content/uploads/2020/10/29-297748_round-profile-image-placeholder.png"
            className="rounded-full h-10 w-10 "
          />
        </div>
        <p className="w-36 truncate text-left">{nickname}</p>
      </div>
    </li>
  );
}

export default UserOnline;
