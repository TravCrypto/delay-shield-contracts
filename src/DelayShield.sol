// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { FunctionsClient } from "chainlink/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from
    "chainlink/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import { Strings } from "openzeppelin-contracts/utils/Strings.sol";

import { IDelayShield } from "./interfaces/IDelayShield.sol";

/**
 * @title DelayShield Contract
 * @dev A decentralized insurance contract for delayed flights, using Chainlink Functions.
 */
contract DelayShield is IDelayShield, FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    // Mapping to store insurance purchase timestamp based on the user and flight code
    mapping(bytes32 => uint256) public insuranceTimeRecord;

    // Mapping to store reimbursement address based on Chainlink request ID
    mapping(bytes32 => address) public reimbursement;

    // Array to temporarily store function arguments
    string[] private args;

    // Variables to store the latest Chainlink request and response data
    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    // DON ID for the Functions DON to which the requests are sent
    bytes32 public donId;

    /**
     * @dev Constructor to initialize the contract with a router address and DON ID
     * @param router The address of the Chainlink Functions router.
     * @param _donId The DON ID for the Functions DON to which requests are sent.
     */
    constructor(address router, bytes32 _donId) FunctionsClient(router) {
        donId = _donId;
    }

    /**
     * @dev Allows users to buy insurance for a specific flight.
     * @param flightCode The unique code representing the flight. (IATA)
     */
    function buyInsurance(string calldata flightCode) public payable {
        // Check if the sent value is sufficient
        if (msg.value < 1e16) revert InsufficientValue();

        // Record the purchase timestamp for the user and flight
        insuranceTimeRecord[keccak256(abi.encode(msg.sender, flightCode))] = block.timestamp;

        // Emit an event to indicate that insurance has been bought
        emit InsuranceBought(msg.sender, flightCode);
    }

    /**
     * @dev Allows users to claim insurance using Chainlink Functions.
     * @param source The source code for the Chainlink Functions to run.
     * @param insured The address of the insured user.
     * @param flightCode The unique code representing the flight.
     * @param subscriptionId The subscription ID for Chainlink Functions.
     * @param callbackGasLimit The gas limit for the callback.
     */
    function claimInsurance(
        string calldata source,
        address insured,
        string calldata flightCode,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) external {
        // Retrieve the insurance purchase timestamp
        uint256 insuranceTime = insuranceTimeRecord[keccak256(abi.encode(insured, flightCode))];
        // Remove the insurance record to prevent double claims
        delete insuranceTimeRecord[keccak256(abi.encode(insured, flightCode))];

        // Prepare the arguments for the Chainlink Functions request
        args.push(Strings.toString(insuranceTime));
        args.push(flightCode);

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        req.setArgs(args);
        delete args;

        // Send the Chainlink Functions request and store the request ID
        reimbursement[_sendRequest(req.encodeCBOR(), subscriptionId, callbackGasLimit, donId)] =
            insured;
    }

    /**
     * @dev Function to fulfill Chainlink Functions requests.
     * @param requestId The Chainlink request ID.
     * @param response The response data from Chainlink Functions.
     * @param err The error data, if any.
     */
    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err)
        internal
        override
    {
        // Decode the Chainlink response to check eligibility for reimbursement
        bool isElegibleForReimbursement = abi.decode(response, (bool));
        if (isElegibleForReimbursement) {
            // If eligible, call the reimbursement address with a fixed value of 2e16 wei
            reimbursement[requestId].call{ value: 2e16 }("");
        }

        // Update the latest response and error data
        s_lastResponse = response;
        s_lastError = err;
    }

    // Fallback functions to receive and handle incoming payments
    receive() external payable { }

    fallback() external payable { }
}
