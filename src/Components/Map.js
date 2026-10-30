// React & React Router DOM imports:
import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

// CSS imports:
import styles from "./Map.module.css"

// Leaflet imports:
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';

// Contexts imports:
import { useContext } from "react";
import { CitiesContext } from "../contexts/CitiesContext";

// Custom hooks imports:
import useGeolocation from "../hooks/useGeolocation";

// Component imports:
import Button from "./Button";


function Map() {
    // States:
    const [mapPosition, setMapPosition] = useState([51.505, -0.09]);
    const [searchParams] = useSearchParams();

    // URL Params:
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    // Context:
    const { cities } = useContext(CitiesContext);

    // Custom hooks:
    const { isLoading, position, getPosition } = useGeolocation();

    // Effects:
    // Stay at the last city position:
    useEffect(() => {
        if (lat && lng) setMapPosition([lat, lng]);
    }, [lat, lng]);

    // Changing the map position to the user's position:
    useEffect(() => {
        if (position) setMapPosition([position.lat, position.lng]);
    }, [position]);

    return (
        <div className={styles.mapContainer}>
            {((!lat && !lng)) && (
                <Button type="position" onClick={getPosition}>
                    {isLoading ? "Loading..." : "Use your position"}
                </Button>
            )}
            <MapContainer center={mapPosition} zoom={10} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {cities.map((city) => (
                    <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                        <Popup>
                            <span>{city.emoji}</span> <span>{city.cityName}</span>
                        </Popup>
                    </Marker>
                ))}

                {/* Changing the map position to the current city if lat and lng are provided or
                    to the user's position if lat and lng are not provided */}
                {(lat && lng)
                    ? <ChangePosition position={[lat, lng]} />
                    : <ChangePosition position={mapPosition} />}

                {/* Detecting user click on the map */}
                <DetectClick />
            </MapContainer>
        </div>
    )
}

// ChangePosition component depending on the useMap hook provided by react-leaflet:
function ChangePosition({ position }) {
    const map = useMap();
    map.setView(position);
    return null
}

// DetectClick component depending on the useMapEvents hook provided by react-leaflet
// and the useNavigate hook provided by react-router-dom:
function DetectClick() {
    const navigate = useNavigate();
    useMapEvents({
        click: (e) => {
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
        }
    });
    return null
}

export default Map;