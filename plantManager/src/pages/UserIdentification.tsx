import React, { useState } from 'react';
import { SafeAreaView, 
         StyleSheet, 
         View, 
         Text, 
         TextInput, 
         KeyboardAvoidingView, 
         Platform, 
         TouchableWithoutFeedback, 
         Keyboard,
         Alert
       } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../components/Button';

import colors from '../styles/colors';
import fonts from '../styles/fonts';



export function UserIdentification() {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>();

  const navigation = useNavigation();


  function handleInputBlur() {
    setIsFocused(false);
    setIsFilled(!!name);
  }

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputChange(value: string) {
    setIsFilled(!!value); // !! transforma o value em conteudo logico
    setName(value);
  }

  async function handleSubmit() {
    if(!name) { //se o usuario não tiver preenchido o nome
      return Alert.alert('Me diz como chamar você 😢');
    }

    try {
      await AsyncStorage.setItem('@plantmanager:user', name); //salvar o nome do usuario no proprio celular => @nomedoaplicativo para evitar que os dados de outro app sobreescreva
      navigation.navigate('Confirmation', {
        title: 'Prontinho',
        subtitle: 'Agora vamos começar a cuidar das suas plantinha com muito cuidado',
        buttonTitle: 'Começar',
        icon: 'smile',
        nextScreen: 'PlantSelect'
      });
    }catch {
      return Alert.alert('Não foi possível salvar seu nome 😢');
    }  
  }


  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView 
        style={ styles.container }
        behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
      >
        <TouchableWithoutFeedback onPress={ Keyboard.dismiss }>

          <View style={ styles.content }>
          <View style={ styles.form }>
            <View style={ styles.header }>
              <Text style={ styles.emoji }>
                😄
              </Text>

              <Text style={ styles.title }>
                Como podemos {'\n'} chamar você?
              </Text>
            </View>

            <TextInput 
              style={ [styles.input, (isFocused || isFilled) && { borderColor: colors.green }] }
              placeholder="Digite seu nome"
              onBlur={ handleInputBlur }
              onFocus={ handleInputFocus }
              onChangeText={ handleInputChange }
            />            

            <View style={ styles.footer }>
              <Button title="Confirmar" onPress={ handleSubmit } />
            </View>

          </View>    
        </View> 
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around'
  },

  content: {
    flex: 1,
    width: '100%'
  },

  form: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 54,
    alignItems: 'center',
  },

  header: {
    alignItems: 'center'
  },

  emoji: {
    fontSize: 44
  },

  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20
  },

  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center'
  },

  footer: {
    marginTop: 40,
    width: '100%',
    paddingHorizontal: 20
  }
})