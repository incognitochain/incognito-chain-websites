import axios from 'axios';
import { API } from '../constants'

export const login = async (email, password) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: API.USER_LOGIN,
    data: {Email: email, Password: password}
  };

  const response = await axios(options);
  return response
}

export const register = async (firstName, lastName, email, newPassword, confirmPassword) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: API.USER_REGISTER,
    data: {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: newPassword,
      ConfirmPassword: confirmPassword,
      Type: "borrower",
      PublicKey: "",
      checkAuth: false,
      redirect: ""
    }
  };

  const response = await axios(options);
  return response
}

export const verifyEmail = async (emailToken) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    url: API.USER_VERIFY_EMAIL,
    data: {
      "Token": emailToken,
    }
  };

  const response = await axios(options);
  return response
}

export const profile = async (token) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`
    },
    url: API.USER_PROFILE,
  };

  const response = await axios(options);
  return response
}

export const update = async (token, data = {}) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Authorization: `Bearer ${token}`
    },
    url: API.USER_UPDATE,
    data
  };

  const response = await axios(options);
  return response
}