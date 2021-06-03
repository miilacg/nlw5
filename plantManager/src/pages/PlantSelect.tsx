import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/core';

import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { Load } from '../components/Load';

import { PlantProps } from '../libs/storage';
import api from '../services/api';
import colors from '../styles/colors';
import fonts from '../styles/fonts';



interface EnvironmentProps {
  key: string;
  title: string;
}


export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
  const [environmentSelected, setEnvironmentSelected] = useState('all'); //por padrão o card todo está ativo
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const navigation = useNavigation();


  function handleEnvironmentSelected(environment: string){
    setEnvironmentSelected(environment);

    if(environment == 'all') {
      return setFilteredPlants(plants);
    }
    
    const filtered = plants.filter(plant => //filtra se a planta tem o ambiente que eu estou querendo
      plant.environments.includes(environment)
    );

    setFilteredPlants(filtered);
  }

  async function fetchPlants() {
    const { data } = await api.get(`plants?_sort=name&order=asc&_page=${page}&_limit=8`);

    if(!data){
      return setLoading(true);
    }

    if(page > 1){
      setPlants(oldValue => [...oldValue, ...data]); //com o oldValue eu consigo pegar os dados que estavam armazenados anteriormente         
      setFilteredPlants(oldValue => [...oldValue, ...data])
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  function handleFetchMore(distance: number) { //quando chegar no final da rolagem ele carrega mais dados
    if(distance < 1) {
      return;
    }

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: PlantProps){
    navigation.navigate('PlantSave', { plant });
  }



  useEffect(() => {
    async function fetchEnvironment() {
      const { data } = await api.get('plants_environments?_sort=title&order=asc');
      setEnvironments([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data
      ]);
    }

    fetchEnvironment();
  }, [])

  useEffect(() => {
    fetchPlants();
  }, [])


  if(loading){
    return <Load />
  }

  return (
    <View style={ styles.container }>
      <View style={ styles.header }>
        <Header />

        <Text style={ styles.title }>Em qual ambiente </Text>
        <Text style={ styles.subtitle }>você quer colocar sua planta? </Text>
      </View>

      <View>
        <FlatList 
          data={ environments }
          keyExtractor={ (item) => String(item.key) } // boa pratica converter o key para string
          renderItem={({ item }) => ( //o que será renderizado
            <EnvironmentButton 
              title={ item.title }
              active={ item.key == environmentSelected }
              onPress={() => handleEnvironmentSelected(item.key) } 
            />
          )} 
          horizontal
          showsHorizontalScrollIndicator={ false } //tira a barra de rolagem
          contentContainerStyle={ styles.environmentList }
        />
      </View>

      <View style={ styles.plants }>
        <FlatList 
          data={ filteredPlants }
          keyExtractor={ (item) => String(item.id) }
          renderItem={({ item }) => (
            <PlantCardPrimary 
              data={ item } 
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={ false }
          numColumns={ 2 }
          onEndReachedThreshold={ 0.1 }
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListHeaderComponent={
            loadingMore ? <ActivityIndicator color={ colors.green } /> : <></>
          }
        />
      </View>     
    </View>    
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background    
  },

  header: {
    paddingHorizontal: 30
  },

  title: {
    fontSize: 17,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 20,
    marginTop: 15,
  },

  subtitle: {
    fontSize: 17,
    fontFamily: fonts.text,
    color: colors.heading,
    lineHeight: 20
  },

  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32
  },

  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  }
})