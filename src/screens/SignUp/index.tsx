import React, { useRef, useCallback } from 'react'

import { useNavigation } from '@react-navigation/native'

import * as Yup from "yup";

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import Icon from 'react-native-vector-icons/Feather'

import api from '../../services/api'

import logoImage from '../../assets/logo.png'

import getValidationErrors from '../../utils/getValidationErrors'

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
} from "react-native"

import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText
} from './styles'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const emailInputRef = useRef<TextInput>(null)

  const navigation = useNavigation();

  const handleSignUp = useCallback(async (formData: SignUpFormData) => {
    try {
      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        name: Yup.string()
          .required('Nome obrigatório'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string()
          .min(6, 'No mínimo 6 digitos')
      })

      await schema.validate(formData, { abortEarly: false })

      api.post('users', formData)

      navigation.navigate('SignIn')

      Alert.alert(
        'Cadastro realizado com sucesso!',
        'Você já pode fazer login.'
      )

    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        formRef.current?.setErrors(
          getValidationErrors(error)
        )
      } else {
        console.error(error)

        Alert.alert(
          'Erro finalizar cadastro!',
          'Ocorreu um erro ao fazer seu cadastro, tente novamente.'
        )
      }
    }
  }, [navigation])


  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
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
                Crie Sua Conta
              </Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus()
                }}
              />

              <Input
                ref={emailInputRef}
                autoCapitalize="none"
                returnKeyType="next"
                autoCorrect={false}
                keyboardType="email-address"
                name="email"
                icon="mail"
                placeholder="E-mail"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                textContentType="newPassword"
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
                Criar Conta
              </Button>
            </Form>
            <BackToSignIn
              onPress={() => navigation.navigate('SignIn')}
            >
              <Icon name="arrow-left" size={20} color="#ff9000" />
              <BackToSignInText>
                Voltar Para o Login
              </BackToSignInText>
            </BackToSignIn>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}


export default SignUp
