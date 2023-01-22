export interface LocationData {
    from: { flight_number: string; location: string };
    to: { flight_number: string; location: string };
}

export interface FlightsData {
    departure: string;
    arrival: string;
    flight_number: string;
    airline_name: string;
    icao: string;
}

export interface FlightSigData {
    departure: string;
    arrival: string;
    flight_number: string;
    airline_name: string;
    icao: string;
}

export interface Flight {
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

export interface AllFlights {
    pagination: {
        limit: number;
        offset: number;
        count: number;
        total: number;
    };
    data: Flight[];
}
