import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'

import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api'

interface User {
  id: string
  name: string
  email: string
  avatar_url: string
}

interface SignInCredetials {
  email: string
  password: string
}

interface AuthData {
  token: string
  user: User
}

interface AuthContextData {
  user: User
  loading: boolean
  signIn(credentials: SignInCredetials): Promise<void>
  updateUser(user: User): void
  signOut(): void
}

const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
)

function useAuth (): AuthContextData {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useContext must be used within an AuthProvider')
  }

  return context
}

const AuthProvider: React.FC = ({ children }) => {
  const [authData, setAuthData] = useState<AuthData>({ } as AuthData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStoragedData (): Promise<void> {
      const [[, token], [, user]] = await AsyncStorage.multiGet([
        '@Gobarber:token',
        '@Gobarber:user'
      ])

      if (token && user) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`
        setAuthData({ token, user: JSON.parse(user) })
      }

      setLoading(false)
    }

    loadStoragedData()
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const { data } = await api.post<AuthData>('/sessions', {
      email,
      password
    })

    api.defaults.headers.common.Authorization = `Bearer ${data.token}`

    await AsyncStorage.multiSet([
      ['@Gobarber:token', data.token],
      ['@Gobarber:user', JSON.stringify(data.user)]
    ])

    setAuthData(data)
  }, [])

  const updateUser = useCallback(async (user: User) => {
    await AsyncStorage.multiSet([
      ['@Gobarber:user', JSON.stringify(user)]
    ])

    setAuthData(data => ({ token: data.token, user }))
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@Gobarber:token', '@Gobarber:user'])
    setAuthData({} as AuthData)
  }, [])

  useEffect(function onTokenExpires () {
    api.interceptors.response.use(
      (success) => success,
      (error) => {
        // if (error.response.status === 401) {
        //   // TODO: try to refresh the token before logout
        //   signOut()
        // }

        return Promise.reject(error)
      }
    )
  }, [signOut])

  return (
    <AuthContext.Provider value={{ user: authData.user, loading, updateUser, signIn, signOut }}>
      { children }
    </AuthContext.Provider>
  )
}

export { useAuth, AuthProvider }
