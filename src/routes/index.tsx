import React from 'react'

import { ActivityIndicator, View, Platform } from 'react-native'

import { useAuth } from '../hooks/auth'

import AppRoutes from './app.routes'
import AuthRoutes from './auth.routes'

const Routes: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <ActivityIndicator
          size={Platform.OS === 'ios' ? 'large' : 40}
          color="#999"
        />
      </View>
    )
  }

  return user ? <AppRoutes /> : <AuthRoutes />
}


export default Routes
