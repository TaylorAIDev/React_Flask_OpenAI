import React from 'react';
import ProfileCard from './ProfileCard'; 
import MenuItems from './MenuItems'; 
import MedipalPicture from '../medipalpicture.png'

const Sidebar = () => {
  const profilePictureURL = null; 
  return (
    <div className="sidebar">
      <ProfileCard
        profilePicture={MedipalPicture} 
        name='MediPal'
        status='user'
        //change to {name} and {status} {profilePicture} when Backend is setup
      />
      {/* Add the MenuItems component */}
      <MenuItems />
      {/* Add the rest of the sidebar content here */}
    </div>
  );
};

export default Sidebar;
