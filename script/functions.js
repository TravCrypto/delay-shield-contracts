const url =
  // "http://api.aviationstack.com/v1/flights?access_key=ae0f9a0a4e373646e027290f3609cc89&airline_iata=IB&flight_number=3009";
  "https://mocki.io/v1/b0175427-e367-4995-9104-7d910e117c1d";

const response = Functions.makeHttpRequest({
  url: url,
}).then((res) => res.data.data[0]);

const flightData = {
  flightCode: response.flight.iata,
  delayOnArrival: response.arrival.delay,
};

return Functions.encodeString(JSON.stringify(flightData));
