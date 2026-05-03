// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IKyndlRegistry {
    function isAffiliateVerified(address affiliate) external view returns (bool);

    function recordPurchase(
        address buyer,
        address creator,
        address affiliate,
        address campaign,
        uint256 totalAmount,
        uint256 creatorAmount,
        uint256 affiliateAmount
    ) external;
}
