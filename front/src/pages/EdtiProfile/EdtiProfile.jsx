import React from 'react';
import './EditProfile.css'; // 선택사항

export default function EditProfile() {
  return (
    <div className="edit-profile-container">
      <h1>회원정보 수정</h1>
      <p>이곳에서 이름, 이메일, 비밀번호 등을 수정할 수 있습니다.</p>
      {/* 추후에 InputField 등을 추가할 수 있어요 */}
    </div>
  );
}
