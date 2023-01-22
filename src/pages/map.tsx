import MapBoxMap from '../components/MapBoxMap';
import {useState} from "react";
import {useEffect} from "react";
import {api} from "../utils/api";
import Sidebar from "../components/Sidebar";

interface GeoCodeResponse {
    features: [{ center: [number, number] }]
}

interface Location {
    from: { name: string, latitude: number, longitude: number },
    to: { name: string, latitude: number, longitude: number }
}

const geoLocation = async (location: string) => {
    const mapboxAccessToken = 'pk.eyJ1IjoiZWluc2lnaHQiLCJhIjoiY2xkNmhzOXB0MGdmMzNucGRndnAxbWhoNSJ9.bcxIvSWS39DAGWGs87vJdQ';
    const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxAccessToken}`;

    const response = await fetch(geocodeURL);

    const data = await response.json() as GeoCodeResponse;

    const [longitude, latitude] = data.features[0].center;

    return {longitude, latitude};
}


const MapWrapper = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const {data: flightsData} = api.flights.getLocations.useQuery();

    console.log(flightsData)
    useEffect(() => {
        if (!flightsData) return;

        void Promise.all(flightsData.map(async flightData => {
            const from = await geoLocation(flightData.from.location);
            const to = await geoLocation(flightData.to.location);

            return {
                from: {name: flightData.from.location, ...from},
                to: {name: flightData.to.location, ...to}
            }
        })).then(locations => {
            setLocations(locations);
        });
    }, [flightsData]);

    return (
        locations
            ? <MapBoxMap locations={locations}/>
            : <div>Loading...</div>
    )
};

export default MapWrapper;
