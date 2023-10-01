import axios from "axios";

const main = async () => {
  const insuranceBuyTime = 1695023922;
  const insuranceFlightCode = "AD7372";

  const response = await axios
    .get(
      "https://mocki.io/v1/b0175427-e367-4995-9104-7d910e117c1d"
      // "http://api.aviationstack.com/v1/flights?access_key=ae0f9a0a4e373646e027290f3609cc89&airline_iata=IB&flight_number=3009"
    )
    .then((res) => res.data.data[0]);

  const flightData = {
    flightCode: response.flight.iata,
    delayOnArrival: response.arrival.delay,
  };
  console.log(JSON.stringify(flightData));

  const scheduledDeparture = parseInt(
    (new Date(response.departure.scheduled).getTime() / 1000).toFixed(0)
  );

  // Validate that is the insured flight
  const isFlightInsured = insuranceFlightCode == response.flight.iata;
  console.log("isFlightInsured: ", isFlightInsured);

  // Validate that the user bought the ticket at least 1 day before the scheduled departure
  const isInsurancePeriodValid = scheduledDeparture - insuranceBuyTime > 86400;
  console.log("isInsurancePeriodValid: ", isInsurancePeriodValid);

  // Validate delayed time to be elegible for issuance
  const isDelayRelevant = response.arrival.delay > 120;
  console.log("isDelayRelevant: ", isDelayRelevant);

  const finalResult =
    isFlightInsured && isInsurancePeriodValid && isDelayRelevant;

  return finalResult;
  // TODO: pricing based in time flight * delay
};

main();
