import React, {
  useEffect,
  useRef,
  useCallback,
  useState,
  useImperativeHandle,
  forwardRef
} from 'react'

import { Container, TextInput, Icon } from './styles'
import { TextInputProps } from 'react-native'

import { useField } from '@unform/core'

interface InputProps extends TextInputProps {
  name: string
  icon: string
  containerStyle?: object
}

interface InputValueReference {
  value: string
}

interface InputRef {
  focus(): void
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = ({ children, containerStyle, name, icon, ...props }, ref) => {
  const {
    defaultValue = '',
    registerField,
    fieldName,
    error
  } = useField(name)

  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  const inputElementRef = useRef<any>(null)
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue })

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [setIsFocused])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!inputValueRef.current.value)
  }, [setIsFocused])

  useImperativeHandle(ref, () => ({
    focus () {
      inputElementRef.current.focus()
    }
  }))

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue (ref: any, value) {
        inputValueRef.current.value = value
        inputElementRef.current.setNativeProps({
          text: value
        })
      },
      clearValue () {
        inputValueRef.current.value = ''
        inputElementRef.current.clar()
      }
    })
  }, [registerField, fieldName, inputValueRef])

  return (
    <Container
      style={containerStyle}
      isFocused={isFocused}
      hasError={!!error}
    >
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#ff9000' : '#666360' }
      />
      <TextInput
        ref={inputElementRef}
        keyboardAppearance="dark"
        placeholderTextColor="#666360"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onChangeText={value => {
          inputValueRef.current.value = value
        }}
        {...props}
      />
    </Container>
  )
}

export default forwardRef(Input)
