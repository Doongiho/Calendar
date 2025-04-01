import React, { useState } from 'react';
import './LoginPage.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // ✅ 1. 예외처리: 필수 입력
    if (!email || !password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    // ✅ 2. Axios로 백엔드에 전송
    try {
      const response = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });

      alert('로그인 성공!');
      console.log('서버 응답:', response.data);
    } catch (error) {
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
      console.error('로그인 실패:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* 왼쪽 */}
        <div className="login-left">
          <img src="/img/ERY 1.png" alt="로고" className="login-logo" />
          <div className="login-message">
            <div>친구들과</div>
            <div>편하게</div>
            <div>일정공유하자</div>
          </div>
        </div>

        {/* 오른쪽 로그인 박스 */}
        <div className="login-right">
          <div className="login-box">
            <div className="login-inner">
              <div className="login-title">
                이메일과 비밀번호를
                <br />
                입력해주세요.
              </div>

              <form onSubmit={handleLogin}>
                <label htmlFor="email" className="login-label">
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

                <label htmlFor="password" className="login-label">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="비밀번호 입력"
                />

                <button type="submit" className="login-button">
                  로그인
                </button>
              </form>

              <div className="login-footer">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span>자동 로그인</span>
                </label>
                <Link to="/signup" className="signup-link">
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
