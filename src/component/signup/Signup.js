import React, { useState, useEffect } from "react";
import "./Signup.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ErrorIcon from "@mui/icons-material/Error";

const Signup = () => {
  const navigate = useNavigate();
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
  const [checkBoxChecked, setCheckBoxChecked] = useState(false);
  const [matchPassword, setMatchPassword] = useState(false);
  const [emailExist, setEmailExist] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const buttonVariants = {
    hover: {
      x: [10, 0, 10, 0, 10, 0, 10, 0],
      opacity: 1,
      transition: {
        duration: 0.9,
        yoyo: Infinity,
      },
    },
  };

  useEffect(() => {
    localStorage.setItem("token", "");
  }, []);

  const handleSignupName = (e) => {
    setSignUpName(e.target.value);
  };

  const handleSignupEmail = (e) => {
    setSignUpEmail(e.target.value);
    if (e.target.value.endsWith("@gmail.com")) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };

  const handleSignupPassword = (e) => {
    setSignUpPassword(e.target.value);
  };

  const handleSignUpConfirmPassword = (e) => {
    setSignUpConfirmPassword(e.target.value);
  };

  const handleSignUpBtn = () => {
    if (!checkBoxChecked) {
      console.log("Accept terms and conditions first");
    } else if (signUpPassword !== signUpConfirmPassword) {
      setMatchPassword(true);
      console.log("Password does not match the confirm password!!");
    } else if (
      checkBoxChecked &&
      signUpPassword === signUpConfirmPassword &&
      !emailError
    ) {
      const sendData = {
        sendName: signUpName,
        sendEmail: signUpEmail,
        sendPassword: signUpPassword,
      };

      axios
        .post("http://localhost:5000/signup", sendData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          // console.log(res.data);
          // console.log("auth is ", res.data.auth);
          if (res.data.userExist === "exist") {
            setEmailExist(true);
          } else {
            const authToken = res.data.auth;
            localStorage.setItem("token", authToken);
            navigate("/home");
          }
        })
        .catch((err) => console.log("Error found in handleSignUpBtn", err));
    } else {
      console.log("Error is something else");
    }
  };

  const handleVisible = () => {
    setVisible(!visible);
  };

  const handleConfirmVisible = () => {
    setVisibleConfirmPassword(!visibleConfirmPassword);
  };

  const handlCheckBoxCheck = () => {
    setCheckBoxChecked(!checkBoxChecked);
  };

  useEffect(() => {
    if (matchPassword) {
      const taskId = setTimeout(() => {
        setMatchPassword(false);
      }, 3000);
      return () => clearTimeout(taskId);
    }

    if (emailExist) {
      const taskId = setTimeout(() => {
        setEmailExist(false);
      }, 3000);
      return () => clearTimeout(taskId);
    }
  }, [matchPassword, emailExist]);

  return (
    <div className="signup">
      <h1 className="main-up-header">Sign Up</h1>
      <div className="signup-wrapper">
        <h1 className="up-headers">Name</h1>
        <input
          className="up-input"
          type="text"
          placeholder="example"
          onChange={handleSignupName}
        />
        <h1 className="up-headers">Email</h1>
        <input
          className="up-input"
          type="email"
          placeholder="example@gmail.com"
          onChange={handleSignupEmail}
        />
        {emailError && (
          <motion.div
            variants={buttonVariants}
            animate="hover"
            className="hold-error"
          >
            <ErrorIcon className="icon-error" fontSize="20px" />
            <h1 className="err-password">Email Is Not Valid</h1>
          </motion.div>
        )}
        {emailExist && (
          <motion.div
            variants={buttonVariants}
            animate="hover"
            className="hold-error"
          >
            <ErrorIcon className="icon-error" fontSize="20px" />
            <h1 className="err-password">Email Already In Use!!</h1>
          </motion.div>
        )}
        <h1 className="up-headers">Password</h1>
        <div className="hold">
          <input
            className="up-input"
            type={visible ? "text" : "password"}
            placeholder="example123"
            onChange={handleSignupPassword}
          />
          {visible ? (
            <VisibilityIcon
              className="icon"
              onClick={handleVisible}
              fontSize="20px"
            />
          ) : (
            <VisibilityOffIcon
              className="icon"
              onClick={handleVisible}
              fontSize="50px"
            />
          )}
        </div>
        <h1 className="up-headers">Confirm Password</h1>
        <div className="hold">
          <input
            className="up-input"
            type={visibleConfirmPassword ? "text" : "password"}
            placeholder="example123"
            onChange={handleSignUpConfirmPassword}
          />
          {visibleConfirmPassword ? (
            <VisibilityIcon className="icon" onClick={handleConfirmVisible} />
          ) : (
            <VisibilityOffIcon
              className="icon"
              onClick={handleConfirmVisible}
            />
          )}
        </div>
        {matchPassword && (
          <motion.div
            variants={buttonVariants}
            animate="hover"
            className="hold-error"
          >
            <ErrorIcon className="icon-error" fontSize="20px"/>
            <h1 className="err-password">Passoword Is Not Matching</h1>
          </motion.div>
        )}
        <button
          className={checkBoxChecked ? "signup-btn" : "signup-btn-false"}
          onClick={handleSignUpBtn}
        >
          Signup
        </button>
        <div className="hold-checkbox">
          <input
            type="checkbox"
            className="checkbox"
            onChange={handlCheckBoxCheck}
          />
          <h3 className="checkbox-header">Accept Terms & Condition</h3>
        </div>
      </div>
    </div>
  );
};

export default Signup;
