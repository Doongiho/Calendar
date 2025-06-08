import React, { useState } from 'react';
import ProfileEditForm from './ProfileEditForm';
import { useUser } from '../../contexts/UserContext';
import './EditProfile.css';

export default function EditProfile({ onClose }) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="close-btn" onClick={onClose} aria-label="닫기">
          ×
        </button>
        {isEditing ? (
          <ProfileEditForm setIsEditing={setIsEditing} />
        ) : (
          <div className="edit-profile-container">
            <h2>회원정보</h2>
            <div>이름: {user?.name}</div>
            <div>이메일: {user?.email}</div>
            <div>성별: {user?.gender === 0 ? "남자" : user?.gender === 1 ? "여자" : "미지정"}</div>
            <button onClick={() => setIsEditing(true)} className="edit-button">
              수정하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
