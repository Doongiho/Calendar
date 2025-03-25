import React from 'react'; // React 라이브러리 가져오기

const LoginPage = () => {
  // LoginPage라는 함수형 컴포넌트 선언
  return (
    <div
      style={{
        width: '100vw', // 화면 전체 너비
        height: '100vh', // 화면 전체 높이
        backgroundColor: '#4B5AE4', // 배경색 설정
        display: 'flex', // Flexbox 레이아웃 적용
        justifyContent: 'space-between', // 좌우 여백과 정렬
        alignItems: 'center', // 세로 방향 중앙 정렬
        flexDirection: 'row', // 요소들을 가로로 배치
        padding: '0 100px', // 좌우 여백
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ color: 'white', fontSize: '48px', margin: '10px 0' }}>
          친구들과
        </h1>
        <h1 style={{ color: 'white', fontSize: '48px', margin: '10px 0' }}>
          편하게
        </h1>
        <h1 style={{ color: 'white', fontSize: '48px', margin: '10px 0' }}>
          일정을 공유하자
        </h1>
      </div>

      <div
        style={{
          width: '650px', // 박스 너비
          height: '600px', // 박스 높이
          backgroundColor: 'white', // 흰색 박스
          borderRadius: '20px', // 꼭지점 라운드 처리
          //boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // 살짝 그림자
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>이메일과 비밀번호를 입력해주세요</p>
      </div>
    </div>
  );
};

export default LoginPage; // LoginPage 컴포넌트 내보내기
