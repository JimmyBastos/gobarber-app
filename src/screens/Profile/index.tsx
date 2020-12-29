import React, { useRef, useCallback } from 'react'

import ImagePicker from 'react-native-image-picker'

import * as Yup from 'yup'

import { useNavigation } from '@react-navigation/native'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import Icon from 'react-native-vector-icons/Feather'

import api from '../../services/api'

import { useAuth } from '../../hooks/auth'

import getValidationErrors from '../../utils/getValidationErrors'

import Input from '../../components/Input'
import Button from '../../components/Button'

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert
} from 'react-native'

import {
  Container,
  Title,
  BackButton,
  UserAvatarUpload,
  UserAvatar
} from './styles'

interface ProfileFormData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth()

  const navigation = useNavigation()

  const goBack = useCallback(navigation.goBack, [navigation])

  const formRef = useRef<FormHandles>(null)
  const emailInputRef = useRef<TextInput>(null)
  const oldPasswordInputRef = useRef<TextInput>(null)
  const passwordInputRef = useRef<TextInput>(null)
  const confirmPasswordInputRef = useRef<TextInput>(null)

  const handleProfile = useCallback(async (formData: ProfileFormData) => {
    try {
      formRef.current?.setErrors({})

      const requirePassword = {
        is: (val: string) => !!val,
        then: Yup.string().required('Campo Obrigatório'),
        otherwise: Yup.string()
      }

      const schema = Yup.object().shape({
        name: Yup.string()
          .required('Nome obrigatório'),
        email: Yup.string()
          .required('Email obrigatório')
          .email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string()
          .when('old_password', requirePassword),
        password_confirmation: Yup.string()
          .when('old_password', requirePassword)
          .oneOf([Yup.ref('password'), undefined], 'As senhas não coicidem')
      })

      await schema.validate(formData, { abortEarly: false })

      const { name, email, old_password } = formData

      const profileData = old_password ? formData : { name, email }

      const { data: updatedUserData } = await api.put('profile', profileData)

      updateUser(updatedUserData)

      navigation.navigate('Dashboard')

      Alert.alert(
        'Cadastro atualizado com sucesso!'
      )
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        formRef.current?.setErrors(
          getValidationErrors(error)
        )
      } else {
        console.error(error)

        Alert.alert(
          'Erro atualizar perfil!',
          'Ocorreu um erro ao atualizar seu perfil, tente novamente.'
        )
      }
    }
  }, [navigation, updateUser])

  const handleAvatarChange = useCallback(async () => {
    ImagePicker.showImagePicker({
      title: 'Selecione uma foto',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Câmera',
      chooseFromLibraryButtonTitle: 'Escolher da galeria'
    }, async (response) => {
      if (response.didCancel) return

      if (response.error) {
        Alert.alert('Erro ao atualizar a foto do perfil')
      }

      const data = new FormData()

      data.append('avatar', {
        type: response.type,
        name: response.fileName,
        uri: response.uri
      } as any)

      const { data: user } = await api.patch('/users/avatar', data)

      updateUser(user)

      Alert.alert(
        'Foto do perfil atualizada!'
      )
    })
  }, [updateUser])

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, height: 'auto' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <BackButton onPress={goBack}>
              <Icon
                name="chevron-left"
                color="#999491"
                size={24}
              />
            </BackButton>

            <UserAvatarUpload
              onPress={handleAvatarChange}
            >
              <UserAvatar source={{ uri: user.avatar_url }} />
            </UserAvatarUpload>

            <Title>
              Meu Perfil
            </Title>

            <Form
              ref={formRef}
              initialData={user}
              onSubmit={handleProfile}
            >
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
                  oldPasswordInputRef.current?.focus()
                }}
              />

              <Input
                ref={oldPasswordInputRef}
                containerStyle={{ marginTop: 16 }}
                name="old_password"
                icon="lock"
                placeholder="Senha Atual"
                secureTextEntry
                textContentType="password"
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />

              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Nova Senha"
                secureTextEntry
                textContentType="password"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus()
                }}
              />

              <Input
                ref={confirmPasswordInputRef}
                name="password_confirmation"
                icon="lock"
                placeholder="Confirmar Senha"
                secureTextEntry
                textContentType="password"
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
                Confirmar Mudanças
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default Profile
