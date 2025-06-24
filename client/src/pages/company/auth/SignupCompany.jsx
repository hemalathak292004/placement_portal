import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  RESET,
  companyStaffSignUp,
} from "../../../redux/features/company/auth/authSlice";
import { SET_GLOBAL } from "../../../redux/features/common/globalSlice";
import CommonSignupForm from "../../../components/CommonSignupForm";

const SignupCompany = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isLoading, isLoggedIn, isError, isSuccess, message } = useSelector(
    (state) => state.companyAuth
  );

  function handleCompanyStaffSignUp(data) {
    const { cpass, emailID, firstName, lastName, password, phone, staffID } = data;
    dispatch(
      companyStaffSignUp({
        personalDetail: {
          cpass,
          emailID,
          firstName,
          lastName,
          password,
          phone,
          staffID,
        },
        company: data.company,
      })
    );
  }

  useEffect(() => {
    if (isLoggedIn && isSuccess) {
      // Set global auth state before navigation
      dispatch(SET_GLOBAL("company"));
      navigate("/company/");
    }

    if (isSuccess && !isLoggedIn && message === "Company Already Exists!") {
      toast.info("Please Sign In", {
        position: toast.POSITION.TOP_RIGHT,
      });
      navigate("/signin/company");
    }

    // Only reset if we have a success or error state
    if (isSuccess || isError) {
      dispatch(RESET());
    }
  }, [isSuccess, isLoggedIn, isError, message, navigate, dispatch]);

  return (
    <CommonSignupForm
      isLoading={isLoading}
      signupHeading={"Company Signup"}
      userType={"company"}
      onSignupFormSubmitHandler={handleCompanyStaffSignUp}
    />
  );
};

export default SignupCompany;
