import { GetStaticProps } from 'next'; // tipagem (dos parametros) e do retorno da função getStaticProps
import Image from 'next/image'; //usar para otimizar a imagem
import Head from 'next/head';
import Link from 'next/link'; //muda só o que precisa ao inves de recarregar tudo
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import { usePlayer } from '../contexts/PlayerContext';

import styles from './home.module.scss';

type Episode = { //tem que falar qual o formato do array
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
} 

type HomeProps = { //propriedades que o componente Home recebe (pode ser feito com interface)
  //episodes = Array<Episode>; ou
  latestEpisodes: Episode[]; //tem que falar qual o formato do array
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];

  return (
    <div className={ styles.homepage }>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      
      <section className={ styles.latestEpisodes }>
        <h2>Últimos lançamentos</h2>

        <ul>
          { latestEpisodes.map((episode, index) => { //para cada episodio eu vou retornar uma coisa
            return (
              <li key={ episode.id }>
                <Image
                  width={192} //altura e largura que a imagem vai ser carregada e não que sera apresentada
                  height={192} 
                  src={ episode.thumbnail } 
                  alt={ episode.title } 
                  objectFit="cover" //cobre o espaço da imagem sem distorcer
                />

                <div className={ styles.episodeDetails }>
                  <Link href={ `/episodes/${ episode.id }` }>
                    <a>{ episode.title }</a>
                  </Link>
                  <p>{ episode.members }</p>
                  <span>{ episode.publishedAt }</span>
                  <span>{ episode.durationAsString }</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}> {/* tem que fazer dessa forma quando a função tiver parametros */}
                  <img src="/images/play-green.svg" alt="Tocas episodio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={ styles.allEpisodes }>
          <h2>Todos episódios</h2>

          <table cellSpacing={ 0 }>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              { allEpisodes.map((episode, index) => {
                return (
                  <tr key={ episode.id }>
                    <td style={{ width:72 }}>
                      <Image 
                        width={ 120 }
                        height={ 120 }
                        src={ episode.thumbnail }
                        objectFit="cover"
                      />
                    </td> 
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{ episode.title }</a>
                      </Link>                      
                    </td>    
                    <td>
                      { episode.members }
                    </td> 
                    <td style={{ width: 100 }}>
                      { episode.publishedAt }
                    </td>
                    <td>
                      { episode.durationAsString }
                    </td>
                    <td>
                      <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}> {/* soma pro primeiro item ser a partir do item que eu clicar*/}
                        <img src="/images/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
      </section>
    </div>   
  )
}

export const getStaticProps: GetStaticProps = async () => { 
  const { data } = await api.get('episodes'/*?_limit=12&_sort=published_at&_order=desc'*/, { //vai carregar apenas 12 episodios na ordem descrescente de publicação
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  }) 

  //é melhor formatar os dados antes deles chegarem no componente
  const episodes = data.map(episode => { //map percorre os episodios
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  }) 
    
  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);
  
  return {
    props: { 
      latestEpisodes,
      allEpisodes, 
    },
    revalidate: 60 * 60 * 8, //só executa 3 vezes por dia
  }
}