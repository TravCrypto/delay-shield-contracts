// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { FunctionsClient } from "chainlink/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import { FunctionsRequest } from
    "chainlink/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract DelayShield is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;

    // TODO: immutable source for javascript function

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;

    bytes32 public donId; // DON ID for the Functions DON to which the requests are sent

    constructor(address router, bytes32 _donId) FunctionsClient(router) {
        donId = _donId;
    }

    function sendRequest(
        string calldata source,
        FunctionsRequest.Location secretsLocation,
        bytes calldata encryptedSecretsReference,
        string[] calldata args,
        bytes[] calldata bytesArgs,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) external {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);
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
