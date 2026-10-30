// Imports:
import { useContext } from 'react';
import styles from './CityList.module.css';
import Spinner from './Spinner';
import CityItem from './CityItem';
import Message from './Message';

// Contexts:
import { CitiesContext } from '../contexts/CitiesContext';

function CityList() {
    // Contexts:
    const { isLoading, cities } = useContext(CitiesContext);

    // Is loading state:
    if (isLoading) return <Spinner />

    // No cities found:
    if (!cities.length) {
        return <Message message="Add your first city by clicking a city on the map" />
    }

    return (
        <ul className={styles.cityList}>
            {cities.map((city) => (
                <CityItem key={city.id} city={city} />
            ))}
        </ul>
    );
}

export default CityList