import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';



export interface PlantProps{
	id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  },
	dateTimeNotification: Date;
  hour: string;
}

export interface StoragePlantProps { // sempre que centraliza alguma coisa pra aproveitar em outro local é importante colocar o export
  [id: string]: {
    data: PlantProps;
    notificationId: string;
  }
}


export async function savePlant(plant: PlantProps): Promise<void> {
  try {
    const nextTime = new Date(plant.dateTimeNotification);
    const now = new Date();

    const { times, repeat_every } = plant.frequency;

    if(repeat_every == 'week') {
      const interval = Math.trunc(7 / times);
      nextTime.setDate(now.getDate() + interval);
    } else {
      nextTime.setDate(nextTime.getDate() + 1) //lembrar no dia seguinte
    }

    const seconds = Math.abs(
      Math.ceil(now.getTime() - nextTime.getTime()) / 1000
    );

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Heeey 🌱',
        body: `Está na hora de cuidar da sua ${plant.name}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        data: {
          plant
        },
      },
      trigger: { // quando a notificação tem que ser executada
        seconds: seconds < 60 ? 60 : seconds,
        repeats: true
      }
    });

    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const oldPlants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    const newPlant = {
      [plant.id]: {
        data: plant,
        notificationId
      }
    }

    await AsyncStorage.setItem('@plantmanager:plants', 
      JSON.stringify({
        ...newPlant,
        ...oldPlants
      })
    )

  } catch(error) {
    throw new Error(error); //como não tem interface eu posso jogar o erro pra frente
  }
}

export async function loadPlant(): Promise<PlantProps[]> {
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

    const plantSorted = Object.keys(plants).map((plant) => {
        return {
          ...plants[plant].data,
          hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
        }
      })
      .sort((a, b) => 
        Math.floor(
          new Date(a.dateTimeNotification).getTime() / 100 - 
          Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
        )
      );

      return plantSorted;

  } catch(error) {
    throw new Error(error);
  }
}

export async function removePlants(id: string): Promise<void> {
  const data = await AsyncStorage.getItem('@plantmanager:plants');
  const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

  await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId);

  delete plants[id];

  await AsyncStorage.setItem(
    '@plantmanager:plants',
    JSON.stringify(plants)
  );  
}