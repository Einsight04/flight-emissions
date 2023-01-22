import {createTRPCRouter, publicProcedure} from "../trpc";
import type {FlightSigData, LocationData, AllFlights} from "../../types/flights";
import {FlightsData, Flight} from "../../types/flights";


const extractLocation = (flightData: FlightSigData[]): LocationData[] => {
    return flightData.map((flight) => ({
        from: {
            flight_number: flight.flight_number,
            location: `${flight.departure} Airport`,
        },
        to: {
            flight_number: flight.flight_number,
            location: `${flight.arrival} Airport`,
        },
    }));
}


const getFlights = async (): Promise<FlightSigData[]> => {
    const response = await fetch(
        "http://api.aviationstack.com/v1/flights?access_key=f3ec6adc0f95e9606cba4a34043eeeab"
    );

    const allFlights = await response.json() as AllFlights;

    return allFlights.data.map((flight) => ({
        departure: flight.departure.airport,
        arrival: flight.arrival.airport,
        flight_number: flight.flight.number,
        airline_name: flight.airline.name,
        icao: flight.airline.icao,
    }));
}

export const flightsRouter = createTRPCRouter({
    getFlights: publicProcedure.query(async () => await getFlights()),
    getLocations: publicProcedure.query(async () => extractLocation(await getFlights())),
});
