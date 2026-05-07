import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../styles/loading.module.css';


const Loading = () => {


  return(
    <div className={styles.loadingPage}>
      <div className={styles.loadingMessage}>
        <h1>Loading <FontAwesomeIcon className='fas fa-spinner fa-spin'  icon={faSpinner} /></h1>
      </div>
    </div>
  )
}

export default Loading;