import { registerUser } from "api/signUpApi";
import InputField from "components/InputField/InputField"; // ✅ InputField 사용
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUpPage.css";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null); // null: 선택 안 함

  const navigate = useNavigate();

  const handleGenderToggle = (value) => {
    setGender(value);
  };

  const validateEmail = (email) => {
    return email.includes("@") && email.includes(".");
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
      alert("입력값을 다시 확인해주세요.");
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
      console.log("회원가입 성공:", response);

      alert("회원가입이 완료되었습니다! 🎉");
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-page">
      <header className="signup-header">
        <img src="/img/ERY 1.png" alt="로고" className="signup-logo" />
      </header>

      <main className="signup-main">
        <section className="signup-left">
          <p className="signup-message">
            친구들과 편하게 <br />
            일정공유하자
          </p>
        </section>

        <section className="signup-right">
          <div className="signup-box">
            <h2 className="signup-title">회원가입 정보를 입력해주세요.</h2>

            <form onSubmit={handleSubmit} className="signup-form">
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
                placeholder="비밀번호 확인"
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

              <label className="signup-label">성별</label>
              <div className="gender-toggle">
                <button
                  type="button"
                  className={gender === 0 ? "active" : ""}
                  onClick={() => handleGenderToggle(0)}
                >
                  남자
                </button>
                <button
                  type="button"
                  className={gender === 1 ? "active" : ""}
                  onClick={() => handleGenderToggle(1)}
                >
                  여자
                </button>
              </div>

              <button
                type="submit"
                className="signup-button"
                disabled={!isValidInput()}
                style={{
                  backgroundColor: isValidInput() ? "#545cf5" : "#dcdcdc",
                  cursor: isValidInput() ? "pointer" : "not-allowed",
                }}
              >
                회원가입
              </button>
            </form>

            <div className="signup-footer">
              <Link to="/" className="signup-link">
                로그인으로 돌아가기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
