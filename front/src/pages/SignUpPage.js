import React, { useState } from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null); // null: 선택 안 함

  const handleGenderToggle = (value) => {
    setGender(value);
  };

  const validateEmail = (email) => {
    return email.includes('@') && email.includes('.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ 예외처리
    if (!validateEmail(email)) {
      alert('이메일 형식에 맞춰주세요.');
      return;
    }

    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!name.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    if (gender === null) {
      alert('성별을 선택해주세요.');
      return;
    }

    // ✅ 모든 조건 만족 시, 전송
    const signUpData = {
      email,
      password,
      confirmPassword,
      name,
      gender,
    };

    try {
      const response = await axios.post(
        'http://localhost:4000/signup',
        signUpData
      );
      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다!');
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
                <label className="login-label" htmlFor="email">
                  이메일
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="sample@gmail.com"
                />

                <label className="login-label" htmlFor="password">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="비밀번호 입력 (8자 이상)"
                />

                <label className="login-label" htmlFor="confirmPassword">
                  비밀번호 확인
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="login-input"
                  placeholder="비밀번호 다시 입력"
                />

                <label className="login-label" htmlFor="name">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login-input"
                  placeholder="이름 입력"
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

                <button type="submit" className="login-button">
                  회원가입
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
