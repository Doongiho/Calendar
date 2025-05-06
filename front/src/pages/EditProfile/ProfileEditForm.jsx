import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { updateUserInfo } from 'api/userApi';

export default function ProfileEditForm({ setIsEditing }) {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState(user?.gender === 0 ? '남성' : '여성');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 문자열 "남성" → 숫자 0, "여성" → 숫자 1
    const genderNumber = gender === '남성' ? 0 : 1;

    const updatedUserData = {
      userId: user.userId,
      name,
      email,
      gender: genderNumber,
      pwd: password || '', // 서버는 'pwd' 필드 필요
    };

    try {
      const updatedUser = await updateUserInfo(user.userId, updatedUserData);

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      navigate(`/MyCalendar/${updatedUser.userId}`, {
        state: { user: updatedUser },
      });
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
      alert('회원정보 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <form className="profile-edit-form" onSubmit={handleSubmit}>
      <h2>회원정보 수정</h2>

      <label>이름</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="이름을 입력하세요"
        required
      />

      <label>이메일</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
        required
      />

      <label>새 비밀번호 (선택)</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="변경 시에만 입력하세요"
      />

      <label>비밀번호 확인</label>
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="비밀번호를 다시 입력하세요"
      />

      <label>성별</label>
      <div className="gender-options">
        <label>
          <input
            type="radio"
            name="gender"
            value="남성"
            checked={gender === '남성'}
            onChange={(e) => setGender(e.target.value)}
          />
          남성
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="여성"
            checked={gender === '여성'}
            onChange={(e) => setGender(e.target.value)}
          />
          여성
        </label>
      </div>

      <div className="button-group">
        <button type="button" onClick={() => setIsEditing(false)}>
          취소
        </button>
        <button type="submit">
          확인
        </button>
      </div>
    </form>
  );
}
