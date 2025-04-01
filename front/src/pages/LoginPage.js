import React from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';

export default function LoginPage() {
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

        {/* 오른쪽 */}
        <div className="login-right">
          <div className="login-box">
            <div className="login-inner">
              <div className="login-title">
                이메일과 비밀번호를
                <br />
                입력해주세요.
              </div>

              <label htmlFor="email" className="login-label">
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="sample@gmail.com"
                className="login-input"
              />

              <label htmlFor="password" className="login-label">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                className="login-input"
              />

              <button className="login-button" disabled>
                로그인
              </button>

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
