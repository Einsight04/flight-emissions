import MapBoxMap from '../components/MapBoxMap';
import {useState} from "react";
import {useEffect} from "react";
import {api} from "../utils/api";


interface Location {
    from: { name: string, latitude: number, longitude: number },
    to: { name: string, latitude: number, longitude: number }
}

interface GeoCodeResponse {
    features: [{ center: [number, number] }]
}

const geoLocation = async (location: string) => {
    const mapboxAccessToken = 'pk.eyJ1IjoiZWluc2lnaHQiLCJhIjoiY2xkNmhzOXB0MGdmMzNucGRndnAxbWhoNSJ9.bcxIvSWS39DAGWGs87vJdQ';
    const geocodeURL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxAccessToken}`;


    const response = await fetch(geocodeURL);

    const data = await response.json() as GeoCodeResponse;

    const longitude = data.features[0].center[0];
    const latitude = data.features[0].center[1];

    return {longitude, latitude};
}


// const locationsTest = [
//     {
//         from: {name: 'Location 1', location: "Dallas/Fort Worth International"},
//         to: {name: 'Location 2', location: "San Francisco International"}
//     },
//     {
//         from: {name: 'Location 3', location: "Toronto Airport"},
//         to: {name: 'Location 4', location: "Los Angeles International"}
//     }
// ]

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
        // <div>
        //     {locations.map(location => {
        //         return (
        //             <div>
        //                 <p>{location.from.name}</p>
        //                 <p>{location.from.latitude}</p>
        //                 <p>{location.from.longitude}</p>
        //
        //                 <p>{location.to.name}</p>
        //                 <p>{location.to.latitude}</p>
        //                 <p>{location.to.longitude}</p>
        //             </div>
        //         )
        //     })}
        // </div>
    )

    // return <MapBoxMap locations={locations}/>;
};

export default MapWrapper;
