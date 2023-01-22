import { createTRPCRouter, publicProcedure } from "../trpc";

export const flightsRouter = createTRPCRouter({
  getFlights: publicProcedure.query(async () => {
    return await getFlights();
  })
});

async function getData() {
  try {
    const response = await fetch("http://api.aviationstack.com/v1/flights?access_key=f3ec6adc0f95e9606cba4a34043eeeab");
    return await response.json() as AllFlights;
  } catch (error) {
    console.log(error);
  }
}

async function getFlights() : Promise<FlightSigData[] | undefined> {
  const data: AllFlights | undefined = await getData();
  if (data === undefined) {
    console.log("data is undefined");
    return undefined
  }

  const flightData: FlightSigData[] = [];

  for (let i = 0; i < data.data.length; i++) {
    const flight: Flight | undefined = data.data[i];

    if (flight !== undefined) {
      const temp: FlightsData = {
        departure: flight.departure.airport,
        arrival: flight.arrival.airport,
        flight_number: flight.flight.number,
        airline_name: flight.airline.name,
        icao: flight.airline.icao
      };
      flightData.push(temp);
    }
  }
  return flightData;
}

interface FlightsData {
  departure: string,
  arrival: string,
  flight_number: string,
  airline_name: string,
  icao: string
}


interface FlightSigData {
  departure: string,
  arrival: string,
  flight_number: string,
  airline_name: string,
  icao: string
}

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
