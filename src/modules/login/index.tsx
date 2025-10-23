import { observer } from 'mobx-react-lite';
import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useLoginStore } from 'Common/stores/rootStore.tsx';

const Login = observer(() => {
  const navigate = useNavigate();
  const loginStore = useLoginStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void loginStore.login(username, password);
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);

    if (loginStore.error) {
      loginStore.clearError();
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);

    if (loginStore.error) {
      loginStore.clearError();
    }
  };

  const isSubmitting = loginStore.isLoading;
  const errorMessage = loginStore.error;
  const loginResponse = loginStore.response;
  const isSubmitDisabled = isSubmitting || !username.trim() || !password.trim();

  useEffect(() => {
    if (loginResponse && !errorMessage) {
      navigate('/client/registration', { replace: true });
    }
  }, [errorMessage, loginResponse, navigate]);

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-[452px] flex flex-col items-center gap-7">
        <div className="flex flex-col items-center gap-[18px] w-[216px]">
          <svg
            className="w-[132.83px] h-[126.868px]"
            width="134"
            height="127"
            viewBox="0 0 134 127"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M133.415 47.1346C133.415 47.1661 133.415 47.2134 133.415 47.2607C133.305 47.6232 133.21 47.97 133.1 48.3326C130.183 58.1694 127.125 67.9589 123.972 77.7168C123.83 78.1425 123.673 78.5681 123.468 79.1356C123.357 78.7415 123.279 78.4735 123.231 78.2213C122.585 75.2892 121.45 72.562 119.874 70.0082C117.84 66.7293 115.239 63.939 112.26 61.4956C108.224 58.1852 103.747 55.6471 98.9232 53.6924C97.1576 52.983 95.3605 52.3997 93.5634 51.7534C93.2796 51.6588 92.9801 51.5327 92.6648 51.6588C92.6964 51.7377 92.6964 51.7849 92.7279 51.8007C92.9013 51.8953 93.0747 51.9899 93.2639 52.0687C95.0925 52.92 96.8896 53.8343 98.6236 54.9062C103.873 58.1379 108.382 62.1892 111.739 67.3914C116.752 75.1158 118.833 83.6599 118.455 92.8188C118.281 96.8859 117.493 100.843 116.201 104.689C114.009 111.215 111.787 117.742 109.58 124.268C109.501 124.505 109.391 124.757 109.327 124.993C109.233 125.324 109.059 125.482 108.697 125.466C108.208 125.45 107.704 125.498 107.215 125.498C103.889 125.545 100.563 125.592 97.2206 125.655C94.5092 125.703 91.782 125.766 89.0706 125.813C84.704 125.892 80.3531 125.971 75.9865 126.049C75.8603 126.049 75.75 126.002 75.6081 125.986C75.6554 125.908 75.6554 125.86 75.6869 125.845C75.7815 125.781 75.8761 125.718 75.9865 125.655C80.1797 123.291 83.4429 119.98 85.9493 115.897C89.449 110.207 91.2461 103.948 92.05 97.3589C92.2707 95.5145 92.3811 93.6543 92.4757 91.7941C92.5387 90.6434 92.5072 89.4926 92.5072 88.3418C92.5072 88.1526 92.5387 87.9162 92.2707 87.727C92.2234 87.9792 92.1761 88.1684 92.1446 88.3576C91.8293 91.2582 91.2776 94.1115 90.4579 96.9175C88.1563 104.91 83.9 111.641 77.4525 116.938C73.3223 120.343 68.6562 122.771 63.5959 124.473C60.0648 125.655 56.4548 126.396 52.7502 126.696C50.1019 126.901 47.4377 126.885 44.7894 126.838C38.9882 126.759 33.1713 126.68 27.3701 126.585C27.2282 126.585 27.1021 126.585 26.9287 126.585C23.2557 116.024 19.5826 105.477 15.9254 94.9154C16.02 94.9154 16.0673 94.8839 16.0988 94.9154C16.2249 95.01 16.351 95.1046 16.4614 95.2149C19.0151 97.548 21.9157 99.2821 25.1474 100.496C28.4893 101.741 31.9574 102.388 35.5201 102.624C38.4837 102.829 41.4316 102.671 44.3637 102.34C47.3904 101.993 50.3856 101.363 53.3177 100.527C54.4055 100.212 55.4774 99.8811 56.5494 99.5343C56.8962 99.424 57.2587 99.3294 57.5583 98.9353C56.975 99.0299 56.5021 99.1087 56.0134 99.2032C53.2704 99.7235 50.496 100.023 47.69 100.07C45.483 100.102 43.2918 99.9442 41.1163 99.6447C38.4049 99.2821 35.7408 98.6988 33.1555 97.753C26.6449 95.3726 21.1118 91.5419 16.4614 86.4186C12.2839 81.8155 9.28871 76.503 7.28667 70.6545C6.15166 67.3441 5.15852 63.9706 4.11809 60.6286C2.96732 56.9398 1.8323 53.251 0.697291 49.5622C0.508122 48.9632 0.523886 48.9474 1.01257 48.5848C9.60399 42.1373 18.1954 35.6898 26.8026 29.2581C26.9602 29.1478 27.1179 29.0374 27.3228 28.8955C27.3543 29.3369 27.1494 29.6364 27.0075 29.9517C25.7149 32.8996 25.0055 36.0051 24.8478 39.221C24.6744 42.7364 25.1158 46.1887 25.9513 49.578C27.0233 53.8343 28.7258 57.8226 30.8224 61.669C32.1939 64.1913 33.7545 66.6032 35.4886 68.9047C35.6305 69.0781 35.7723 69.2515 35.9773 69.488C36.0561 69.0624 35.8984 68.8259 35.7723 68.5894C32.6195 62.9617 30.649 56.9713 30.0657 50.5396C29.7662 47.1976 29.9081 43.8872 30.4914 40.5925C31.4372 35.2642 33.392 30.3143 36.2137 25.6954C39.4296 20.3987 43.6386 16.0163 48.6673 12.4378C54.3266 8.41801 60.0017 4.44547 65.6768 0.441394C65.8975 0.283754 66.1339 0.141877 66.3704 0C66.5438 0.126113 66.6857 0.220697 66.8433 0.315281C71.0996 3.29469 75.3559 6.25833 79.5964 9.26927C84.1049 12.4536 88.6135 15.6852 93.1062 18.8853C93.2639 18.9957 93.4215 19.1218 93.5791 19.2479C93.3269 19.311 93.122 19.311 92.9328 19.2952C89.8746 18.9011 86.8479 19.1376 83.8527 19.8785C79.4072 20.982 75.3874 22.9682 71.6671 25.6008C66.3861 29.3369 61.988 33.9558 58.2519 39.221C58.11 39.4102 57.9839 39.6151 57.8735 39.82C57.842 39.8988 57.8893 40.025 57.9366 40.2614C58.1258 40.025 58.2361 39.9146 58.3307 39.7885C58.4411 39.6466 58.5514 39.5047 58.6775 39.3786C62.918 34.8543 67.8049 31.2286 73.4642 28.6906C77.6574 26.8147 82.0714 25.7112 86.6587 25.459C89.1179 25.3171 91.5771 25.3801 94.0205 25.6324C97.063 25.9476 100.042 26.5782 102.959 27.5083C108.051 29.1478 112.654 31.67 116.926 34.8543C122.38 38.9372 127.898 43.0359 133.415 47.1346Z"
              fill="#B52F27"
            />
          </svg>

          <h1 className="text-center text-[#232323] font-montserrat text-[20px] font-medium leading-[100%] tracking-[0.2px]">
            ФинансКредитБанк
          </h1>
        </div>

        {/* Login Form */}
        <div className="w-full flex flex-col items-center gap-10">
          <h2 className="text-[#1A1A1A] font-inter text-[32px] font-semibold leading-[130%] w-full">
            Вход
          </h2>

          <form className="w-full flex flex-col items-end gap-5" onSubmit={handleSubmit}>
            {/* ФИО Input */}
            <div className="w-full flex flex-col items-start gap-2">
              <label className="text-[#23262F] font-montserrat text-[14px] font-medium leading-[100%]">
                ФИО
              </label>
              <div className="w-full h-12 flex flex-col justify-center items-start rounded-[5px]">
                <input
                  type="text"
                  name="username"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Введите ваше ФИО"
                  autoComplete="username"
                  className="w-full h-full px-4 py-4 rounded-xl border border-[#D7D7D7] bg-[#F2F2F2] text-[#23262F] placeholder:text-[#9B9B9B] font-montserrat text-base leading-[100%] outline-none focus:border-[#B50000] transition-colors disabled:opacity-60"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="w-full flex flex-col items-start gap-2">
              <label className="text-[#23262F] font-montserrat text-[14px] font-medium leading-[100%]">
                Пароль
              </label>
              <div className="w-full h-12 flex flex-col justify-center items-start rounded-[5px]">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Введите ваш пароль"
                  autoComplete="current-password"
                  className="w-full h-full px-4 py-4 rounded-xl border border-[#D7D7D7] bg-[#F2F2F2] text-[#23262F] placeholder:text-[#9B9B9B] font-montserrat text-base leading-[100%] outline-none focus:border-[#B50000] transition-colors disabled:opacity-60"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {errorMessage && (
              <p
                className="w-full text-left text-[#B50000] font-montserrat text-sm leading-[120%]"
                role="alert"
              >
                {errorMessage}
              </p>
            )}
            {loginResponse && !errorMessage && (
              <p
                className="w-full text-left text-[#0B8F24] font-montserrat text-sm leading-[120%]"
                role="status"
              >
                Вход выполнен успешно.
              </p>
            )}
            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-12 px-[22px] py-4 flex justify-center items-center gap-2 rounded-xl bg-[#B50000] hover:bg-[#9a0000] active:bg-[#B50000] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitDisabled}
            >
              <span className="text-white font-montserrat text-[14px] font-medium leading-[100%]">
                {isSubmitting ? 'Входим…' : 'Войти'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Login;
