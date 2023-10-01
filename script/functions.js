const insuranceBuyTime = parseInt(args[0]);
const insuranceFlightCode = args[1];

const url =
  // "http://api.aviationstack.com/v1/flights?access_key=ae0f9a0a4e373646e027290f3609cc89&airline_iata=IB&flight_number=3009";
  // Will return isInsurancePeriodValid false
  // "https://mocki.io/v1/b0175427-e367-4995-9104-7d910e117c1d";
  // Will return true
  "https://mocki.io/v1/97266b37-f01c-43b0-83e0-a2f46d2384c7";

const response = await Functions.makeHttpRequest({
  url: url,
}).then((res) => res.data.data[0]);

const flightData = {
  code: response.flight.iata,
  delayOnArrival: response.arrival.delay,
  scheduledDeparture: parseInt(
    (new Date(response.departure.scheduled).getTime() / 1000).toFixed(0)
  ),
};

// Validate that is the insured flight
const isFlightInsured = insuranceFlightCode == flightData.code;
console.log("isFlightInsured: ", isFlightInsured);

// Validate that the user bought the ticket at least 1 day before the scheduled departure
const isInsurancePeriodValid =
  flightData.scheduledDeparture - insuranceBuyTime > 86400;
console.log("isInsurancePeriodValid: ", isInsurancePeriodValid);

// Validate delayed time to be elegible for issuance
const isDelayRelevant = flightData.delayOnArrival > 120;
console.log("isDelayRelevant: ", isDelayRelevant);

const finalResult =
  isFlightInsured && isInsurancePeriodValid && isDelayRelevant;

return Functions.encodeUint256(+finalResult);
