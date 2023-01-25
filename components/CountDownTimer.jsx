import React, { useEffect, useState } from "react";

import Countdown, { zeroPad } from "react-countdown";

import Icon from "components/shared/Icon";

const CountDownTimer = ({ handleResendVerificationCode, startDate }) => {
  const [key, setKey] = useState(1);
  
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [startDate]); 

  return (
    <Countdown
      key={key}
      date={startDate + 1000 * 60 * 3}
      renderer={(props) => (
        <Renderer
          setKey={setKey}
          {...props}
          handleResendVerificationCode={handleResendVerificationCode}
        />
      )}
    />
  );
};

const Renderer = (props) => {
  const { minutes, seconds, completed } = props;
  if (completed) {
    return (
      <div className="mt-2 flex justify-center">
        <Completionist {...props} />
      </div>
    );
  } else {
    return (
      <div className="ltr timer-container mt-2 flex items-baseline justify-center">
        <span className="mr-2 text-[11px]">مانده تا دریافت مجدد کد</span>
        <span>{zeroPad(minutes)}:</span>
        <span>{zeroPad(seconds)}</span>
      </div>
    );
  }
};

const Completionist = ({ setKey, handleResendVerificationCode }) => {
  const handleOnClick = () => {
    setKey((prev) => prev + 1);
    handleResendVerificationCode();
  };
  return (
    <button className="min-h-[24px] text-[11px]" onClick={handleOnClick}>
      ارسال مجدد
      <Icon className="ms-2" icon="resend" size={18} />
    </button>
  );
};

export default React.memo(CountDownTimer);
