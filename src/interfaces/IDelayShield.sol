// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/**
 * @title IDelayShield Interface
 * @dev Interface for the DelayShield contract, a decentralized insurance contract for delayed flights.
 */
interface IDelayShield {
    /**
     * @dev Emitted when insurance is bought for a flight.
     * @param insured The address of the insured user.
     * @param flightCode The unique code representing the flight.
     */
    event InsuranceBought(address indexed insured, string flightCode);

    /**
     * @dev Custom error to be thrown when there is insufficient value sent with a function call.
     */
    error InsufficientValue();

    /**
     * @dev Allows users to buy insurance for a specific flight.
     * @param flightCode The unique code representing the flight.
     */
    function buyInsurance(string calldata flightCode) external payable;

    /**
     * @dev Allows users to claim insurance for a delayed flight.
     * @param source The source code for the Chainlink Function request.
     * @param insured The address of the insured user.
     * @param flightCode The unique code representing the flight.
     * @param subscriptionId The subscription ID for Chainlink Function.
     * @param callbackGasLimit The gas limit for the callback.
     */
    function claimInsurance(
        string calldata source,
        address insured,
        string calldata flightCode,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) external;

    /**
     * @dev Fallback function to receive Ether payments.
     */
    receive() external payable;

    /**
     * @dev Fallback function to receive Ether payments.
     */
    fallback() external payable;
}
