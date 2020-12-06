import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import CreateAppointment from '../screens/CreateAppointment'
import AppointmentCreated from '../screens/AppointmentCreated'

const App = createStackNavigator()

import Dashboard from '../screens/Dashboard'

const AppRoutes: React.FC = () => {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: '#312e38'
        }
      }}
    >
      <App.Screen name="Dashboard" component={Dashboard}/>
      <App.Screen name="CreateAppointment" component={CreateAppointment}/>
      <App.Screen name="AppointmentCreated" component={AppointmentCreated}/>

    </App.Navigator>
  )
}


export default AppRoutes
