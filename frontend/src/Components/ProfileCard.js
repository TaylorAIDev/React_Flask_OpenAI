import React from 'react';

const ProfileCard = ({ profilePicture, name, status }) => {
  return (
    <div className="card">
      <div className="profile-picture">
        {profilePicture ? (
          <img className="profile-image" src={profilePicture} alt="Profile" />
        ) : (
          <div className="profile-image-placeholder">No Picture</div>
        )}
      </div>
      <div className="profile-details">
        <div className="profile-content">
          <div className="profile-name">{name}</div>
          <div className="profile-status">{status}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
