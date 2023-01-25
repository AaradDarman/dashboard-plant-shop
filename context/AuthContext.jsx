import React, { useState } from "react";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import SignupVerificationModal from "components/modals/SignupVerificationModal";
import LoadingComponent from "components/shared/LoadingComponent";
import {
  changePhoneNumber,
  resendVerificationCode,
  signup,
  verify,
  userCheck,
  signupVerify,
  resetPassword,
} from "redux/slices/user";
import { authContext } from "./auth-context";

const AuthContext = ({ children }) => {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [personalCode, setPersonalCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isEditPhoneNumberModalOpen, setIsEditPhoneNumberModalOpen] =
    useState(false);
  const [userId, setUserId] = useState("");
  const [tokenCreateDate, setTokenCreateDate] = useState("");
  const [otpSentDate, setOtpSentDate] = useState(null);
  const [forgotPassPageState, setForgotPassPageState] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state);
  const router = useRouter();

  const openVerifyModal = () => {
    setIsVerifyModalOpen(true);
  };
  const closeVerifyModal = () => {
    setIsVerifyModalOpen(false);
  };

  const openEditPhoneNumberModal = () => {
    setIsEditPhoneNumberModalOpen(true);
  };
  const closeEditPhoneNumberModal = () => {
    setIsEditPhoneNumberModalOpen(false);
  };

  const handleSignup = () => {
    const payload = {
      fName,
      lName,
      email,
      personalCode,
      phoneNumber,
      password,
    };
    dispatch(signup(payload))
      .unwrap()
      .then((originalPromiseResult) => {
        setUserId(originalPromiseResult.user._id);
        setTokenCreateDate(originalPromiseResult.tokenCreateDate);
        openVerifyModal();
      });
  };

  const handleVerify = ({ verificationCode }) => {
    dispatch(signupVerify(verificationCode))
      .unwrap()
      .then((originalPromiseResult) => {
        closeVerifyModal();
        router.replace("/users/login");
      });
  };

  const handleCheckUser = ({ username }) => {
    dispatch(userCheck({ username }))
      .unwrap()
      .then((originalPromiseResult) => {
        setForgotPassPageState("otp");
        setOtpSentDate(
          new Date(originalPromiseResult.tokenCreateDate).getTime()
        );
      });
  };

  const handleVerifyUser = ({ otp }) => {
    dispatch(verify({ otp }))
      .unwrap()
      .then((originalPromiseResult) => {
        setForgotPassPageState("");
        router.push(`/users/password/reset?tk=${originalPromiseResult.token}`);
      });
  };

  const handleResetPassword = ({ newPassword, tk }) => {
    dispatch(resetPassword({ newPassword, tk }))
      .unwrap()
      .then((originalPromiseResult) => {
        router.replace("/");
      });
  };

  const handleResendVerificationCode = () => {
    dispatch(resendVerificationCode(userId))
      .unwrap()
      .then((originalPromiseResult) => {
        setTokenCreateDate(originalPromiseResult.tokenCreateDate);
      });
  };

  const handleChangePhoneNumber = (newPhoneNumber) => {
    dispatch(changePhoneNumber(newPhoneNumber))
      .unwrap()
      .then((originalPromiseResult) => {
        closeEditPhoneNumberModal();
      });
  };

  return (
    <authContext.Provider
      value={{
        fName,
        setFName,
        lName,
        setLName,
        email,
        setEmail,
        personalCode,
        setPersonalCode,
        phoneNumber,
        setPhoneNumber,
        password,
        setPassword,
        userId,
        setUserId,
        handleSignup,
        handleResendVerificationCode,
        tokenCreateDate,
        openEditPhoneNumberModal,
        handleCheckUser,
        otpSentDate,
        forgotPassPageState,
        setForgotPassPageState,
        handleVerifyUser,
        handleResetPassword,
      }}
    >
      {children}
      <SignupVerificationModal
        open={isVerifyModalOpen}
        onClose={closeVerifyModal}
        onVerify={handleVerify}
        onResendOtp={handleResendVerificationCode}
      />
      <LoadingComponent show={user?.status === "loading"} />
    </authContext.Provider>
  );
};

export default AuthContext;
