import { format, parseISO }  from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from './episode.module.scss';

type Episode = { //representa as partes visuais desse componente. coloca só o que vai aparecer na tela
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  description: string;
}

type EpisodeProps = {
  episode: Episode;
}



export default function Episode({ episode }: EpisodeProps) {  
  return (
    <div className={ styles.episode }>
      {/*<head>
        <title>{ episode.title } | Podcastr </title>
      </head>*/}

      <div className={ styles.thumbnailContainer }>
        <Link href="/">
          <button type="button">
            <img src="/images/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>

        <Image
          width={ 700 }
          height={ 160 }
          src={ episode.thumbnail }
          objectFit="cover"
        />

        <button type="button" onClick={() => play(episode)}>
          <img src="/images/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{ episode.title }</h1>
        <span>{ episode.members }</span>
        <span>{ episode.publishedAt }</span>
        <span>{ episode.durationAsString }</span>
      </header>

      <div className={ styles.description } dangerouslySetInnerHTML={{ __html: episode.description }} /> {/* obrigada a transformar o conteudo em html */}
    </div>
  )
}



// usar toda vez que tiver gerando de forma dinamina uma página estatica, ou seja, uma página estatica que tem paramentros 
export const getStaticPaths: GetStaticPaths = async () => { //toda rota que tiver [] vai precisar informar esse metodo
  const { data } = await api.get('episodes', { // coloca de forma estatica os dois primeiros episodios
    params: {
      _limit: 2,
      _sort: 'published_at',
      _order: 'desc'
    }
  }) 

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  })

  return { //retorna os episodios que eu quero gerar de forma estatica no momento da build
    //é uma boa colocar aqui as categorias mais acessadas
    paths, //paths: [], => se tiver vazio eu não quero retornar nenhum episodio nesse momento
    fallback: 'blocking' //roda no node, então quando a pessoa clicar no link ela só vai ser levada para ele quando ele já estiver carregado
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params; //tem que chamar slug por causa do nome do arquivo

  const { data } = await api.get(`/episodes/${slug}`);

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    url: data.file.url,
  } 

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, //carrega uma vez por dia
  }
}