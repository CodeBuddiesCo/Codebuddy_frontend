import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const Loading = () => {


  return(
    <div class="loading-page">
      <div class="loading-message">
        <h1>Loading <FontAwesomeIcon className='fas fa-spinner fa-spin'  icon={faSpinner} /></h1>
      </div>
    </div>
  )
}

export default Loading;