// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { FunctionsClient } from "chainlink/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from
    "chainlink/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract DelayShield is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    // TODO: immutable source for javascript function
    event InsuranceBought(address indexed insured, string flightCode);

    error InsufficientValue();

    mapping(bytes32 => uint256) public insuranceTimeRecord;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    bytes32 public donId; // DON ID for the Functions DON to which the requests are sent

    constructor(address router, bytes32 _donId) FunctionsClient(router) {
        donId = _donId;
    }

    function buyInsurance(string memory flightCode) external payable {
        if (msg.value != 0.1 ether) revert InsufficientValue();

        insuranceTimeRecord[keccak256(abi.encode(msg.sender, flightCode))] = block.timestamp;

        emit InsuranceBought(msg.sender, flightCode);
    }

    function claimInsurance(
        string calldata source,
        address insured,
        string calldata flightCode,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) external {
        uint256 insuranceTime = insuranceTimeRecord[keccak256(abi.encode(insured, flightCode))];

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
        req.setArgs([string(insuranceTime), flightCode]);
        s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, callbackGasLimit, donId);
    }

    function fulfillRequest(bytes32 requestId, bytes memory response, bytes memory err)
        internal
        override
    {
        s_lastResponse = response;
        s_lastError = err;
    }
}
