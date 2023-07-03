import axios from 'axios';
import { useEffect, useState } from 'react';
import Spinner from './Spinner';
const { REACT_APP_CATAAS: CAT } = process.env;
const { REACT_APP_CATFACT: FACT } = process.env;
const { REACT_APP_CATSAYS: SAYS } = process.env;

export default function Home() {
  const [phrase, setPhrase] = useState(null);
  const [fistWord, setFirstWord] = useState(null);
  const [loader, setLoader] = useState(true);
  const [cambiar, setCambiar] = useState(false);
  const urlImg = `${SAYS}${fistWord}`;
  const obtengoFrase = new Promise((res, rej) => {
    axios.get(`${FACT}`).then((resp) => {
      if (resp.status === 200) {
        setTimeout(() => {
          res(resp.data.fact);
        }, 2000);
      } else {
        rej('Se produjo un error al obtener la Frase');
      }
    });
  });
  const obtengoImagen = new Promise((res, rej) => {
    axios.get(`${CAT}`).then((resp) => {
      if (resp.status === 200) {
        res(resp.data.file);
      } else {
        rej('Se produjo un error al querer cargar la imagen :(');
      }
    });
  });
  useEffect(() => {
    const initState = () => {
      obtengoFrase
        .then((res) => {
          setPhrase(res);
          setFirstWord(res.split(' ')[0]);
          return obtengoImagen;
        })
        .then((res) => {
          if (res) {
            setLoader(false);
            setCambiar(false);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    };
    initState();
  }, [cambiar]);
  const handleClick = (e) => {
    e.preventDefault();
    setCambiar(true);
    setLoader(true);
  };
  return (
    <>
      <div>
        {' '}
        {!loader ? (
          <h1>Phrase: "{phrase}"</h1>
        ) : (
          <>
            <img
              src={'https://media.giphy.com/media/xGdvlOVSWaDvi/giphy.gif'}
              alt=''
            />
          </>
        )}
      </div>
      <br />
      <hr />
      <div>
        <button type='button' className='btn btn-danger' onClick={handleClick}>
          OTHER CAT
        </button>
      </div>
      <div></div>
      <br />
      {!loader ? <img src={urlImg} alt={fistWord} /> : <Spinner />}
    </>
  );
}
