import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "api/userApi"; 
import InputField from "components/InputField/InputField"; 
import { useUser } from "../../contexts/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();
  
  const isValidInput = () => {
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailRegex.test(email) && password;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      // 로그인 요청
      const loginResponse = await loginUser(email, password);
      setUser(loginResponse.data);
      console.log("로그인 응답:", loginResponse);

      const userId = loginResponse.data?.userId; 
      if (!userId) throw new Error("사용자 ID를 찾을 수 없습니다.");

      navigate(`/MyCalendar/${userId}`, { state: { user: loginResponse.data } });

    } catch (error) {
      alert("로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
      console.error("로그인 오류:", error);
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

              {/* 로그인 폼 */}
              <form onSubmit={handleLogin}>
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
                  placeholder="비밀번호 입력"
                  label="비밀번호"
                />

                {/* 로그인 버튼 */}
                <button
                  type="submit"
                  className="login-button"
                  style={{
                    backgroundColor: isValidInput() ? "#545cf5" : "#dcdcdc",
                    cursor: isValidInput() ? "pointer" : "not-allowed",
                  }}
                >
                  로그인
                </button>
              </form>

              {/* 하단 링크 */}
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
