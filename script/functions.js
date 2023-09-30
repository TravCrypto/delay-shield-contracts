const url = "https://mocki.io/v1/cec57aeb-4eeb-45ae-98a3-9478f144faa7";

const flightrequest = Functions.makeHttpRequest({
  url: url,
});

const flightResponse = await flightrequest;

if (flightResponse.error) {
  throw Error("Request failedd");
}

const latestFlightData = flightResponse.data;

const flightData = {
  flightCode: latestFlightData.flight.iata,
  delayOnArrival: latestFlightData.arrival.delay,
  status: latestFlightData.flight_status,
};

return Functions.encodeString(JSON.stringify(flightData));
