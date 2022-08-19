/* eslint-disable no-undef */
import jwtDecode from 'jwt-decode'
import { TOKEN_KEY } from '../../infrastructure/appConstants'

export const setToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token)
}

export const getJwt = () => localStorage.getItem(TOKEN_KEY)

export const getDecodedToken = () => {
  try {
    return jwtDecode(getJwt())
  } catch (error) {
    return null
  }
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

