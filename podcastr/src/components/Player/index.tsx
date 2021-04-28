import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';

import { usePlayer } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss'


export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null); 
  const [progress, setProgress] = useState(0); //armazena quanto tempo já tocou
  
  const { 
    episodeList, 
    currentEpisodeIndex, 
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
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if(isPlaying) {
      audioRef.current.play();
    } else{
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0; //sempre que mudar de podcast 

    audioRef.current.addEventListener('timeupdate', () => { //retorna o tempo atual do player
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnder() {
    if(hasNext) {
      playNext();
    } else { // se não tiver proxima, limpa o status
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];



  return (
    <div className={ styles.playerContainer }>
      <header>
        <img src="/images/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? ( // se existe um episodio tocando
        <div className={ styles.currentEpisode }> 
          <Image 
            width={ 592 } 
            height={ 592 }
            src={ episode.thumbnail }
            objectFit="cover"
          />
          <strong>{ episode.title }</strong>
          <span>{ episode.members} </span>
        </div>
      ) : ( //se não existe
        <div className={ styles.emptyPlayer }>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) }
      
      <footer className={ !episode ? styles.empty : ''}> {/*só para a classe se não tiver um episodio*/}
        <div className={ styles.progress }>
          <span>{ convertDurationToTimeString(progress) }</span> 

          <div className={ styles.slider }>
            { episode ? (
              <Slider 
                max={ episode.duration } //valor maximo que pode chegar
                value={ progress }
                onChange={ handleSeek } //o que acontece quando o usuario arrasta
                trackStyle={{ backgroundColor: '#04d361' }} //muda a cor do progresso
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }} //bolinha do slider
              />
            ) : (
              <div className={ styles.emptySlider } />
            )}            
          </div> 
          
          <span>{ convertDurationToTimeString(episode?.duration ?? 0) }</span> {/*o ? verifica se o episodio existe antes de passar*/}
        </div>

        { episode && ( //pode ser colocado em qualquer lugar do arquivo
          <audio 
            src={ episode.url }
            ref={ audioRef }
            autoPlay //o audio já toca assim que carregar
            loop={ isLooping }
            onPlay={() => setPlayingState(true) } //dispara automaticamente quando o audio começa
            onEnded={ handleEpisodeEnder }
            onPause={() => setPlayingState(false) }
            onLoadedMetadata={ setupProgressListener } //dispara assim que o player carregar os dados dos episodios
          />
        ) }

        <div className={ styles.buttons }>
          <button 
            type="button" 
            className={ isShuffling ? styles.isActive : ''}
            onClick={ toggleShuffle }
            disabled={ !episode || episodeList.length == 1 }
          >
            <img src="/images/shuffle.svg" alt="Ordem aleatória" />
          </button>
          <button type="button" onClick={ playPrevious } disabled={ !episode || !hasPrevious }>
            <img src="/images/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button 
            type="button" 
            className={ styles.playButton } 
            disabled={ !episode }
            onClick={ togglePlay }
          >
            { isPlaying
              ? <img src="/images/pause.svg" alt="Pausar" />
              : <img src="/images/play.svg" alt="Tocar" />
            }
          </button>
          <button type="button" onClick={ playNext } disabled={ !episode || !hasNext }>
            <img src="/images/play-next.svg" alt="Tocar próxima" />
          </button>
          <button 
            type="button" 
            className={ isLooping ? styles.isActive : ''}
            onClick={ toggleLoop }
            disabled={ !episode }
          >
            <img src="/images/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}