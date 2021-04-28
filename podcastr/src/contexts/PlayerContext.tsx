import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = { //só as informações que o player vai usar
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  url: string;
}

type PlayerContextData = { //informações que eu quero salvar dentro do contexto
  episodeList: Episode[]; //qual episodio eu to tocando (quais tão na fila pra tocar)
  currentEpisodeIndex: number; //index do episodio que ta tocando
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  isLooping: boolean; 
  toggleLoop: () => void;
  isShuffling: boolean; 
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  clearPlayerState: () => void;
  playNext: () => void;
  hasNext: boolean;
  playPrevious: () => void;
  hasPrevious: boolean;
}

type PlayerContextProviderProps = {
  children: ReactNode; //quando pode ser qualquer elemento
}


//o valor inicial serve mais para mostrar o formato dos dados que serão utilizado
export const PlayerContext = createContext({} as PlayerContextData);  //tem o formato do PlayerContextData


//poderia colocar essa parte em outro arquivo 
export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;


  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) { //ouvir uma lista de episodios
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true); //para caso a pessoa pause manualmente e queira começar de outro episodio
  }

  function togglePlay() { //se tiver tocando pausa e vice-versa
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() { 
    setIsLooping(!isLooping);
  }

  function toggleShuffle() { 
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  function playNext() {   
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else {
      if (hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1);
      }
    }   
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }



  return (
    //fica em volta de todos os componentes que forem usar o PlayerContext
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        play, 
        playList,
        isPlaying, 
        togglePlay, 
        isLooping, 
        toggleLoop,
        isShuffling, 
        toggleShuffle,
        setPlayingState,
        clearPlayerState,
        playNext,
        hasNext,
        playPrevious,
        hasPrevious 
      }}> 

      { children }

    </PlayerContext.Provider>
  )
}



//usada para não precisar importar duas coisas quando for usar o PlayerContext
export const usePlayer = () => { 
  return useContext(PlayerContext);
}