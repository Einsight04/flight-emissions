import MapBoxMap from '../components/MapBoxMap';
import {useState} from "react";
import {useEffect} from "react";
import {api} from "../utils/api";


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

const totalEmissions = (locations: Location[]) => {
    // take distance between locations and multiply by emissions per km
    return locations.reduce((total, location) => {
        const from = location.from
        const to = location.to

        const distance = Math.sqrt(Math.pow(from.latitude - to.latitude, 2) + Math.pow(from.longitude - to.longitude, 2))
        const emissions = distance * 9.2

        return total + emissions
    }, 0)
}


const Home = () => {
    const [locations, setLocations] = useState<Location[] | null>(null);
    const {data: flightsData} = api.flights.getLocations.useQuery();

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
            ? <div>
                <MapBoxMap locations={locations} emissions={totalEmissions(locations)}/>
            </div>
            : <div>Loading...</div>
    )
};

export default Home;
