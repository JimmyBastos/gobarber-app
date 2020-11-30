import React, { useCallback, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'

import { useAuth } from "../../hooks/auth";

import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersListTitle,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText
 } from "./styles";

import Icon from 'react-native-vector-icons/Feather'

export interface Provider {
  id: string
  name: string
  avatar_url: string
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const { navigate } = useNavigation()

  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(
    function loadProviders () {
      api.get<Provider[]>('/providers').then(
        ({data: providers}) => {
          setProviders(providers)
        }
      )
    }, []
  )

  const goToProfile = useCallback(
    () => {
      navigate("Profile")
    },
    [navigate]
  )

  const goToCreateAppointment = useCallback(
    (providerId: string) => {
      navigate("CreateAppointment", { providerId })
    },
    [navigate]
  )



  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {'\n'}
          <UserName>
            {user.name}
          </UserName>
        </HeaderTitle>

        <ProfileButton onPress={goToProfile}>
          <UserAvatar source={{uri: user.avatar_url}} />
        </ProfileButton>
      </Header>

      <ProvidersList
        data={providers}
        keyExtractor={provider => provider.id}
        ListHeaderComponent={
          <ProvidersListTitle>
            Cabeleireiros
          </ProvidersListTitle>
        }
        renderItem={
          ({ item: provider }) => (
            <ProviderContainer
              onPress={() => goToCreateAppointment(provider.id)}
            >
              <ProviderAvatar source={{uri: provider.avatar_url}} />

              <ProviderInfo>
                <ProviderName>
                  {provider.name}
                </ProviderName>

                <ProviderMeta>
                  <Icon
                    name="calendar"
                    size={14}
                    color="#ff9000"
                  />
                  <ProviderMetaText>
                    Segunda à sexta
                  </ProviderMetaText>
                </ProviderMeta>

                 <ProviderMeta>
                  <Icon
                    name="clock"
                    size={14}
                    color="#ff9000"
                  />
                  <ProviderMetaText>
                    8h às 18h
                  </ProviderMetaText>
                </ProviderMeta>
              </ProviderInfo>
            </ProviderContainer>
          )
        }
      >

      </ProvidersList>
    </Container>
  )
}


export default Dashboard
