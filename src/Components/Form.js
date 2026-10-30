// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
/* The previous URL was the one that we can through fetch cities data from the map
   but it stopped working suddenly so we replaced it down below in the BASE_URL */

// Imports:
import { useEffect, useState } from "react";
import Button from "./Button";
import Spinner from "./Spinner";
import Message from "./Message";
import styles from "./Form.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Contexts imports:
import { useContext } from "react";
import { CitiesContext } from "../contexts/CitiesContext";

// Functions:
// convertToEmoji function:
export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  // Hooks:
  const navigate = useNavigate();

  // Context:
  const { createCity, isLoading: isLoadingCities } = useContext(CitiesContext);

  // States:
  const [searchParams] = useSearchParams();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [geocodingError, setGeocodingError] = useState("");

  // URL Params:
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  // Vars:
  const BASE_URL = "https://nominatim.openstreetmap.org/reverse";

  // Effects:
  useEffect(() => {
    async function fetchCityData() {
      try {
        setIsLoading(true);
        setGeocodingError("");

        // Fetching:
        const res = await fetch(`${BASE_URL}?lat=${lat}&lon=${lng}&format=json`);
        const data = await res.json();
        console.log(data);

        // Checking:
        if (!data.address) {
          throw new Error("That doesn't seem to be a city. Click somewhere else");
        }

        // Setting:
        setCityName(data.address.town || data.address.city || data.address.village || "");
        setCountry(data.address.country);
        setEmoji(convertToEmoji(data.address.country_code));
      } catch (error) {
        setGeocodingError(error.message);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCityData();
  }, [lat, lng]);

  // Functions:
  // handleSubmit function:
  function handleSubmit(e) {
    e.preventDefault();

    if (!cityName || !date) {
      return;
    } else {
      const newCity = {
        cityName,
        country,
        emoji,
        date: date.toISOString(),
        notes,
        position: {
          lat,
          lng,
        },
      };
      createCity(newCity);
      navigate("/layout");
    };
  }

  // Conditions with early returns:
  if (isLoading) return <Spinner />;
  if (geocodingError) return <Message message={geocodingError} />;

  return (
    <form className={`${styles.form} ${isLoadingCities ? styles.loading : ""}`} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        <DatePicker
          id="date"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={date => setDate(date)}
          placeholderText="Click to select date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <Button type="back" onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}>&larr; Back</Button>
      </div>
    </form>
  );
}

export default Form;
