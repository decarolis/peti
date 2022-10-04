import { useEffect, useState } from 'react';
import ManhaCm from '../../assets/img/manhacm.jpeg';
import Peti1 from '../../assets/img/peti1.jpg';
import Peti2 from '../../assets/img/peti2.jpg';

/* css*/
import styles from './Peti.module.scss';
import stylesLoader from '../layout/Loader.module.scss';

function Peti() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (Peti1 && Peti2 && mounted) {
      setLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [loading]);

  return (
    <section>
      <h1>petí</h1>

      {!loading ? (
        <>
          <div className={styles.peti_container}>
            <img src={Peti1} alt="Petí" />
            <img src={Peti2} alt="Petí" />
          </div>
          <h1>Petí na Tv</h1>
          <div className={styles.peti_container}>
            <video
              src={`https://api.peti.pt/videos/peti.mp4`}
              width="100%"
              controls="controls"
              poster={ManhaCm}
              crossOrigin="anonymous"
            />
          </div>
        </>
      ) : (
        <div className={stylesLoader.loader}></div>
      )}
    </section>
  );
}

export default Peti;
