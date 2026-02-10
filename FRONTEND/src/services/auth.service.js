import api from './api'

export const login = async (username, password) => {
  const response = await api.post('/auth/login', {
    username,
    password,
  })

  const { token, user } = response.data

  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))

  return user
}

export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}
