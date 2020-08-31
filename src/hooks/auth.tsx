import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'

import AsyncStorage from "@react-native-community/async-storage";
import api from '../services/api'

interface SignInCredetials {
  email: string
  password: string
}

interface AuthData {
  token: string
  user: object
}

interface AuthContextData {
  user: object
  loading: boolean
  signIn(credentials: SignInCredetials): Promise<void>
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
      async function loadStoragedData(): Promise<void> {
        const [[, token], [, user]] = await AsyncStorage.multiGet([
          '@Gobarber:token',
          '@Gobarber:user'
        ])

        if(token && user) {
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

    await AsyncStorage.multiSet([
      ['@Gobarber:token', data.token],
      ['@Gobarber:user', JSON.stringify(data.user)]
    ])

    setAuthData(data)
  }, [])

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@Gobarber:token', '@Gobarber:user'])
    setAuthData({} as AuthData)
  }, [])

  return (
    <AuthContext.Provider value={{ user: authData.user, loading, signIn, signOut }}>
      { children }
    </AuthContext.Provider>
  )
}

export { useAuth, AuthProvider }
