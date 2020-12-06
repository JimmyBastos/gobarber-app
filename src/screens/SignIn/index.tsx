import React, { useCallback, useRef } from 'react'

import { useNavigation } from '@react-navigation/native'

import * as Yup from 'yup'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import Icon from 'react-native-vector-icons/Feather'

import getValidationErrors from '../../utils/getValidationErrors'

import logoImage from '../../assets/logo.png'

import { useAuth } from '../../hooks/auth'

import Input from '../../components/Input'
import Button from '../../components/Button'

import {
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert
} from 'react-native'

import {
  Container,
  Title,
  ForgotPassword,
  ForgotPasswordText,
  CreateAccountButton,
  CreateAccountButtonText
} from './styles'

interface SignInFormData {
  email: string,
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const passwordInputRef = useRef<TextInput>(null)

  const { signIn } = useAuth()

  const navigation = useNavigation()

  const handleSignIn = useCallback(async (formData: SignInFormData) => {
    try {
      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string()
          .required('Senha obrigatória')
      })

      await schema.validate(formData, { abortEarly: false })

      await signIn({
        email: formData.email,
        password: formData.password
      })
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        formRef.current?.setErrors(
          getValidationErrors(error)
        )
      } else {
        console.error(error)

        Alert.alert(
          'Erro na autenticação!',
          'Não foi possível fazer login. Verifique seu e-mail e senha.'
        )
      }
    }
  }, [signIn])

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImage} />

            <View>
              <Title>
                Faça Seu Login
              </Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignIn}>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                name="email"
                keyboardType="email-address"
                icon="mail"
                placeholder="E-mail"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />

              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                returnKeyType="send"
                onSubmitEditing={() => {
                  formRef.current?.submitForm()
                }}
              />

              <Button
                style={{ marginTop: 16 }}
                onPress={() => {
                  formRef.current?.submitForm()
                }}
              >
                Entrar
              </Button>
            </Form>
            <ForgotPassword>
              <ForgotPasswordText>
                Esqueci minha senha
              </ForgotPasswordText>
            </ForgotPassword>

            <CreateAccountButton
              onPress={() => navigation.navigate('SignUp')}
            >
              <Icon name="log-in" size={20} color="#ff9000" />
              <CreateAccountButtonText>
                Criar uma conta
              </CreateAccountButtonText>
            </CreateAccountButton>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default SignIn
