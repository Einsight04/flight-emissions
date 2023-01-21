import { createTRPCRouter, publicProcedure } from "../trpc";


export const flightsRouter = createTRPCRouter({
  getFlights: publicProcedure.query(async () => {
    try {

      const response = await fetch("http://api.aviationstack.com/v1/flights?access_key=f3ec6adc0f95e9606cba4a34043eeeab");
        return await response.json() as AllFlights
    } catch (error) {
      console.log(error);
    }
  })
});

interface Flight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    baggage: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string | null;
    estimated_runway: string | null;
    actual_runway: string | null;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared: string | null;
  };
  aircraft: {
    registration: string;
    iata: string;
    icao: string;
    icao24: string;
  };
  live: {
    updated: string;
    latitude: number;
    longitude: number;
    altitude: number;
    direction: number;
    speed_horizontal: number;
    speed_vertical: number;
    is_ground: boolean;
  };
}

interface AllFlights {
  pagination: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
  data: Flight[];
}
