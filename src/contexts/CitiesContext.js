// Imports:
import { createContext, useEffect, useReducer, useCallback } from "react";

// Constants:
const CITIES_URL = `${process.env.PUBLIC_URL}/cities.json`;
const STORAGE_KEY = "worldwise-cities";

// Context:
const CitiesContext = createContext();

// Reducer vars:
const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
};

// Keep IDs consistent and Leaflet coordinates numeric.
function normalizeCity(city) {
    return {
        ...city,
        id: String(city.id),
        position: {
            lat: Number(city.position.lat),
            lng: Number(city.position.lng),
        },
    };
}

// Read saved cities. Return null when no saved data exists.
function readSavedCities() {
    try {
        const savedCities = localStorage.getItem(STORAGE_KEY);
        if (savedCities === null) return null;

        const parsedCities = JSON.parse(savedCities);
        if (!Array.isArray(parsedCities)) throw new Error("Invalid saved cities");

        return parsedCities.map(normalizeCity);
    } catch {
        // Ignore corrupted saved data and fall back to the initial JSON file.
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // localStorage may be unavailable in the browser.
        }
        return null;
    }
}

// Persist the complete list so it survives refreshes.
function saveCities(cities) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

// Generate an ID without depending on json-server.
function createCityId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return String(Date.now());
}

// Reducer function:
function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return { ...state, isLoading: true, error: "" };

        case "cities/loaded":
            return {
                ...state,
                isLoading: false,
                cities: action.payload,
                error: "",
            };

        case "city/loaded":
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload,
                error: "",
            };

        case "city/created":
            return {
                ...state,
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
                error: "",
            };

        case "city/deleted":
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter(
                    (city) => String(city.id) !== String(action.payload)
                ),
                currentCity: {},
                error: "",
            };

        case "rejected":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };

        default:
            throw new Error("Unknown action type");
    }
}

// Provider component:
function CitiesProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Destructuring state:
    const { cities, isLoading, currentCity, error } = state;

    // Load saved cities first. On the first visit, load the public JSON file.
    useEffect(() => {
        async function loadCities() {
            dispatch({ type: "loading" });

            const savedCities = readSavedCities();
            if (savedCities !== null) {
                dispatch({ type: "cities/loaded", payload: savedCities });
                return;
            }

            try {
                const response = await fetch(CITIES_URL);
                if (!response.ok) {
                    throw new Error(`Could not load cities (${response.status})`);
                }

                const data = await response.json();
                if (!Array.isArray(data.cities)) {
                    throw new Error("The cities.json file must contain a cities array");
                }

                const initialCities = data.cities.map(normalizeCity);

                // If storage is unavailable, the app can still use the fetched data
                // for this session; persistence will require browser storage.
                try {
                    saveCities(initialCities);
                } catch {
                    // Keep the app usable even if localStorage is blocked.
                }

                dispatch({ type: "cities/loaded", payload: initialCities });
            } catch {
                dispatch({
                    type: "rejected",
                    payload: "There was an error loading cities...",
                });
            }
        }

        loadCities();
    }, []);

    // Find a city from the already-loaded local array.
    const fetchCurrentCity = useCallback(
        function fetchCurrentCity(id) {
            if (String(id) === String(currentCity.id)) return;

            dispatch({ type: "loading" });

            const city = cities.find((city) => String(city.id) === String(id));

            if (!city) {
                dispatch({
                    type: "rejected",
                    payload: "The city could not be found.",
                });
                return;
            }

            dispatch({ type: "city/loaded", payload: city });
        },
        [cities, currentCity.id]
    );

    // Create a city and persist the updated list.
    function createCity(newCity) {
        dispatch({ type: "loading" });

        try {
            const city = normalizeCity({
                ...newCity,
                id: newCity.id ?? createCityId(),
            });

            const updatedCities = [...cities, city];
            saveCities(updatedCities);

            dispatch({ type: "city/created", payload: city });
        } catch {
            dispatch({
                type: "rejected",
                payload: "There was an error saving the city. Check your browser storage settings.",
            });
        }
    }

    // Delete a city and persist the updated list.
    function deleteCity(id) {
        dispatch({ type: "loading" });

        try {
            const updatedCities = cities.filter(
                (city) => String(city.id) !== String(id)
            );
            saveCities(updatedCities);

            dispatch({ type: "city/deleted", payload: id });
        } catch {
            dispatch({
                type: "rejected",
                payload: "There was an error deleting the city. Check your browser storage settings.",
            });
        }
    }

    // Return:
    return (
        <CitiesContext.Provider
            value={{
                cities,
                isLoading,
                currentCity,
                error,
                fetchCurrentCity,
                createCity,
                deleteCity,
            }}
        >
            {children}
        </CitiesContext.Provider>
    );
}

export { CitiesContext, CitiesProvider };
