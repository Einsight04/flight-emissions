import React, {useEffect, useRef} from 'react';
import MapboxGL from 'mapbox-gl';
import type {GeoJSON} from "geojson";

interface Location {
    from: { name: string, latitude: number, longitude: number },
    to: { name: string, latitude: number, longitude: number }
}

interface MapProps {
    locations: Location[]
    emissions: number
}

const Map: React.FC<MapProps> = ({locations, emissions}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        MapboxGL.accessToken = 'pk.eyJ1IjoiZWluc2lnaHQiLCJhIjoiY2xkNmhzOXB0MGdmMzNucGRndnAxbWhoNSJ9.bcxIvSWS39DAGWGs87vJdQ';

        const map = new MapboxGL.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/dark-v10',
            center: [-74.5, 40],
            zoom: 12,
        });

        map.dragRotate.disable();

        map.on('load', () => {
            // Convert the "from" and "to" locations into a single GeoJSON feature collection
            const lineData = {
                type: 'FeatureCollection',
                features: locations.map(location => {
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: [[location.from.longitude, location.from.latitude], [location.to.longitude, location.to.latitude]]
                        }
                    };
                })
            };

            // Add the line data as a new source for the map
            map.addSource('lines', {
                type: 'geojson',
                data: lineData as GeoJSON
            });

            // Add a new layer to the map to display the lines
            map.addLayer({
                id: 'lines',
                type: 'line',
                source: 'lines',
                paint: {
                    'line-width': 1,
                    'line-color': '#ffffff'
                }
            });


            // Convert the "from" locations into a GeoJSON feature collection
            const fromData = {
                type: 'FeatureCollection',
                features: locations.map(location => {
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [location.from.longitude, location.from.latitude]
                        },
                        properties: {
                            name: location.from.name
                        }
                    };
                })
            };

            // Add the "from" data as a new source for the map
            map.addSource('from', {
                type: 'geojson',
                data: fromData as GeoJSON
            });

            // Add a new layer to the map to display the "from" points
            map.addLayer({
                id: 'from',
                type: 'circle',
                source: 'from',
                paint: {
                    'circle-radius': 4,
                    'circle-color': '#f44336'
                }
            });

            // Convert the "to" locations into a GeoJSON feature collection
            const toData = {
                type: 'FeatureCollection',
                features: locations.map(location => {
                    return {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [location.to.longitude, location.to.latitude]
                        },
                        properties: {
                            name: location.to.name
                        }
                    };
                })
            };

            // Add the "to" data as a new source for the map
            map.addSource('to', {
                type: 'geojson',
                data: toData as GeoJSON
            });

            // Add a new layer to the map to display the "to" points
            map.addLayer({
                id: 'to',
                type: 'circle',
                source: 'to',
                paint: {
                    'circle-radius': 4,
                    'circle-color': '#4CAF50'
                }
            });
        });


        return () => {
            map.remove();
        };
    }, [locations]);

    return (
        <div className="overflow-hidden" ref={mapContainerRef} style={{height: '100vh', width: '100vw'}}>
            <div className="absolute top-8 left-0 right-0 mx-auto w-1/2 text-center text-white">
                <h1 className="text-4xl font-thin">{Math.round(emissions * 100) / 100} kg of CO2 emissions</h1>
            </div>
        </div>
    );
};

export default Map;
