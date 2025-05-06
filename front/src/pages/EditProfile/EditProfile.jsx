import React, { useState } from 'react';
import ProfileEditForm from './ProfileEditForm';
import { useUser } from '../../contexts/UserContext';
import './EditProfile.css';

export default function EditProfile() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <ProfileEditForm setIsEditing={setIsEditing} />;
  }

  return (
    <div className="edit-profile-container">
      <h2>회원정보 요약</h2>
      <div>이름: {user?.name}</div>
      <div>이메일: {user?.email}</div>
      <div>비밀번호: {user?.password ? '******' : ''}</div>
      <div>성별: {user?.gender === 0 ? "남자" : user?.gender === 1 ? "여자" : "미지정"}</div>
      <button onClick={() => setIsEditing(true)} className="edit-button">
        수정하기
      </button>
    </div>
  );
}
