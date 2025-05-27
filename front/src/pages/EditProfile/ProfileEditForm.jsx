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
  
    const genderNumber = gender === '남성' ? 0 : 1;
  
    const updatedUserData = {
      userId: user.userId,
      name,
      email,
      gender: genderNumber,
      pwd: password || '',
    };
  
    try {
      const updatedUser = await updateUserInfo(updatedUserData);
  
      // ✅ 이름, 이메일, 성별, 비밀번호 중 하나라도 변경되었으면 로그아웃 처리
      const nameChanged = name !== user.name;
      const emailChanged = email !== user.email;
      const genderChanged = genderNumber !== user.gender;
      const passwordChanged = password.length > 0;
  
      const sensitiveChanged = nameChanged || emailChanged || genderChanged || passwordChanged;
  
      if (sensitiveChanged) {
        // 로그아웃 처리
        localStorage.removeItem('user');
        setUser(null);
        alert('회원정보가 변경되어 다시 로그인해주세요.');
        navigate('/');
      } else {
        // 정보 변경만 되고, 로그인 유지 (사용하지 않겠지만 대비)
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        navigate(`/MyCalendar/${updatedUser.userId}`, {
          state: { user: updatedUser },
        });
      }
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
