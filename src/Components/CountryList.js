// Imports:
import { useContext } from 'react';
import styles from './CountryList.module.css';
import Spinner from './Spinner';
import CountryItem from './CountryItem';
import Message from './Message';

// Contexts:
import { CitiesContext } from '../contexts/CitiesContext';

function CountryList() {
    // Contexts:
    const { isLoading, cities } = useContext(CitiesContext);

    // Is loading state:
    if (isLoading) return <Spinner />

    // No cities found:
    if (!cities.length) {
        return <Message message="Add your first city by clicking a city on the map" />
    }

    // Vars:
    const countries = [];
    /* Here we loop through the cities and then make a condition by creating another array
    of country names only while looping through cities and if the country name is not
    in the names array we push the country object into the countries array else we return
    the countries array */
    cities.map((city) => {
        if (!countries.map((el) => el.country).includes(city.country)) {
            return countries.push({ country: city.country, emoji: city.emoji, id: city.id });
        } else return countries;
    })
    console.log(cities);
    console.log(countries);

    return (
        <ul className={styles.countryList}>
            {countries.map((country) => (
                <CountryItem key={country.id} country={country} />
            ))}
        </ul>
    );
}

export default CountryList