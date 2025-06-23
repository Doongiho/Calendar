import { loginUser } from "api/userApi";
import InputField from "components/InputField/InputField";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const userId = parsedUser.userId;
      navigate(`/MyCalendar/${userId}`, { state: { user: parsedUser } });
    }
  }, []);

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
      const loginResponse = await loginUser(email, password);
      const { data, token } = loginResponse;

      if (!token || !data?.userId) {
        throw new Error("유효한 로그인 정보가 없습니다.");
      }

      const userData = {
        userId: data.userId,
        name: data.name || data.email,
        email: data.email,
        gender: data.gender,
        token: token,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate(`/MyCalendar/${userData.userId}`, {
        state: { user: userData },
      });
    } catch (error) {
      alert("로그인 실패. 이메일 또는 비밀번호를 확인하세요.");
      console.error("로그인 오류:", error);
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <img src="/img/ERY 1.png" alt="로고" className="login-logo" />
      </header>

      <main className="login-main">
        <section className="login-left">
          <p className="login-message">
            친구들과 편하게 <br />
            일정공유하자
          </p>
        </section>

        <section className="login-right">
          <div className="login-box">
            <h2 className="login-title">이메일과 비밀번호를 입력해주세요.</h2>

            <form onSubmit={handleLogin} className="login-form">
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

            <div className="login-footer">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={autoLogin}
                  onChange={(e) => setAutoLogin(e.target.checked)}
                />
                <span>자동 로그인</span>
              </label>
              <Link to="/signup" className="signup-link">
                회원가입
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
