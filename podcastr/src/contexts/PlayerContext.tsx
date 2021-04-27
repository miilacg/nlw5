import { createContext } from 'react';

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
  isPlaying: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
}


//o valor inicial serve mais para mostrar o formato dos dados que serão utilizado
export const PlayerContext = createContext({} as PlayerContextData);  //tem o formato do PlayerContextData