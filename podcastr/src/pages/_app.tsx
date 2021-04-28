import Header from "../components/Header";
import Player from "../components/Player";
import { PlayerContextProvider } from "../contexts/PlayerContext";

import styles from '../styles/app.module.scss'
import '../styles/global.scss';

export default function MyApp({ Component, pageProps }) {
  return(
    //colocar em volta de todos os componentes que forem usar o PlayerContext
    <PlayerContextProvider>
      <div className={ styles.wrapper }> 
        <main>
          <Header />
          <Component {...pageProps} />
        </main>     
        <Player />
      </div>
    </PlayerContextProvider>
  )
}