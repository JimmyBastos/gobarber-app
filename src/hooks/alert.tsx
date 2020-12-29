import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'

import AwesomeAlert, { AwesomeAlertProps } from 'react-native-awesome-alerts'

interface AlertOptions extends AwesomeAlertProps {
  type: 'success' | 'error' | 'info'
}

interface AlertContextData {
  alert(options: AlertOptions): void
}

const AlertContext = createContext<AlertContextData>(
  {} as AlertContextData
)

function useAlert (): AlertContextData {
  const context = useContext(AlertContext)

  if (!context) {
    throw new Error('useContext must be used within an AlertProvider')
  }

  return context
}

const AlertProvider: React.FC = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState(true)
  const [options, setAlertOptions] = useState<AlertOptions>({ type: 'info' })

  const color = {
    info: '#ff9000',
    success: '#ff9000',
    error: '#ff9000'
  }

  const alert = useCallback(
    (options: AlertOptions) => {
      setAlertOptions(options)
      setAlertVisible(true)
    }, []
  )

  return (
    <AlertContext.Provider value={{ alert }}>
      { children }
      <AwesomeAlert
        { ...options }
        show={alertVisible}
        confirmButtonColor={color[options.type]}
        title="Cadastro confirmado com sucesso"
        message="Você já pode fazer login"
        contentContainerStyle={{
          backgroundColor: '#312e38'
        }}
        titleStyle={{
          textAlign: 'center',
          marginBottom: '24px',
          fontFamily: 'RobotoSlab-Medium',
          color: '#f4ede8'
        }}
        messageStyle={{
          textAlign: 'center',
          fontFamily: 'RobotoSlab-Regular',
          color: '#999591'
        }}
        onCancelPressed={() => {
          setAlertVisible(false)
          options?.onCancelPressed()
        }}
        onConfirmPressed={() => {
          setAlertVisible(false)
          options?.onConfirmPressed()
        }}
      />
    </AlertContext.Provider>
  )
}

export { useAlert, AlertProvider }
