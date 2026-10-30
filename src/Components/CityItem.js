import { Link } from 'react-router-dom';
import styles from './CityItem.module.css'
import { useContext } from 'react';
import { CitiesContext } from '../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';

const formatDate = (date) =>
    new Intl.DateTimeFormat("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
    }).format(new Date(date));

function CityItem({ city }) {
    // Hooks:
    const navigate = useNavigate();

    // Context:
    const { currentCity, deleteCity } = useContext(CitiesContext)

    // Functions:
    function handleDel(e) {
        e.preventDefault(); // Prevent going to the link into the city details.
        deleteCity(city.id);
        navigate("/layout");
    }

    // Return:
    return (
        <li>
            <Link className={`${styles.cityItem} ${city.id === currentCity.id ? styles["cityItem--active"] : ""}`}
                to={`${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}>
                <span className={styles.emoji}>{city.emoji}</span>
                <h3 className={styles.name}>{city.cityName}</h3>
                <time className={styles.date}>({formatDate(city.date)})</time>
                <button className={styles.deleteBtn} onClick={handleDel}>&times;</button>
            </Link>
        </li>
    )
}

export default CityItem;