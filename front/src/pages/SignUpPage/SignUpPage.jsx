import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from 'api/signUpApi';
import InputField from 'components/InputField/InputField'; // ✅ InputField 사용

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null); // null: 선택 안 함

  const navigate = useNavigate();

  const handleGenderToggle = (value) => {
    setGender(value);
  };

  const validateEmail = (email) => {
    return email.includes('@') && email.includes('.');
  };

  const isValidInput = () => {
    return (
      validateEmail(email) &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      name.trim() &&
      gender !== null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidInput()) {
      alert('입력값을 다시 확인해주세요.');
      return;
    }

    try {
      const response = await registerUser(
        email,
        password,
        confirmPassword,
        name,
        gender
      );
      console.log('회원가입 성공:', response);

      alert('회원가입이 완료되었습니다! 🎉');
      navigate('/');
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* 왼쪽 영역 */}
        <div className="login-left">
          <img src="/img/ERY 1.png" alt="로고" className="login-logo" />
          <div className="login-message">
            <div>친구들과</div>
            <div>편하게</div>
            <div>일정공유하자</div>
          </div>
        </div>

        {/* 오른쪽 회원가입 박스 */}
        <div className="login-right">
          <div className="signup-box">
            <div className="login-inner">
              <div className="signup-title">회원가입</div>
              <form onSubmit={handleSubmit}>
                <InputField
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sample@gmail.com"
                  label="이메일"
                />

                <InputField
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호 입력 (8자 이상)"
                  label="비밀번호"
                />

                <InputField
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호 다시 입력"
                  label="비밀번호 확인"
                />

                <InputField
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름 입력"
                  label="이름"
                />

                <label className="login-label">성별</label>
                <div className="gender-toggle">
                  <button
                    type="button"
                    className={gender === 0 ? 'active' : ''}
                    onClick={() => handleGenderToggle(0)}
                  >
                    남자
                  </button>
                  <button
                    type="button"
                    className={gender === 1 ? 'active' : ''}
                    onClick={() => handleGenderToggle(1)}
                  >
                    여자
                  </button>
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={!isValidInput()}
                  style={{
                    backgroundColor: isValidInput() ? '#545cf5' : '#dcdcdc',
                    cursor: isValidInput() ? 'pointer' : 'not-allowed',
                  }}
                >
                  회원가입
                </button>
              </form>

              <div className="login-footer">
                <Link to="/login" className="signup-link">
                  로그인으로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
