// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import {IKyndlRegistry} from "./interfaces/IKyndlRegistry.sol";

contract KyndlCampaign is ReentrancyGuard {
    using SafeERC20 for IERC20;

    uint16 public constant BPS_DENOMINATOR = 10_000;

    IERC20 public immutable paymentToken;
    IKyndlRegistry public immutable registry;
    address public immutable creator;
    uint256 public immutable price;
    uint16 public immutable affiliateBps;
    string public name;
    string public metadataURI;

    bool public active = true;
    uint256 public totalSales;
    uint256 public totalVolume;

    event PurchaseSettled(
        address indexed buyer,
        address indexed creator,
        address indexed affiliate,
        uint256 totalAmount,
        uint256 creatorAmount,
        uint256 affiliateAmount
    );
    event CampaignStatusChanged(bool active);

    error InvalidCreator();
    error InvalidPrice();
    error InvalidAffiliateBps();
    error CampaignInactive();
    error InvalidAffiliate();
    error UnverifiedAffiliate();
    error OnlyCreator();

    constructor(
        address paymentToken_,
        address registry_,
        address creator_,
        uint256 price_,
        uint16 affiliateBps_,
        string memory name_,
        string memory metadataURI_
    ) {
        if (paymentToken_ == address(0) || registry_ == address(0) || creator_ == address(0)) {
            revert InvalidCreator();
        }
        if (price_ == 0) revert InvalidPrice();
        if (affiliateBps_ > BPS_DENOMINATOR) revert InvalidAffiliateBps();

        paymentToken = IERC20(paymentToken_);
        registry = IKyndlRegistry(registry_);
        creator = creator_;
        price = price_;
        affiliateBps = affiliateBps_;
        name = name_;
        metadataURI = metadataURI_;
    }

    function purchase(address affiliate) external nonReentrant {
        if (!active) revert CampaignInactive();

        uint256 affiliateAmount;
        address paidAffiliate = affiliate;

        if (affiliate == address(0)) {
            paidAffiliate = address(0);
        } else {
            if (affiliate == creator || affiliate == msg.sender) revert InvalidAffiliate();
            if (!registry.isAffiliateVerified(affiliate)) revert UnverifiedAffiliate();
            affiliateAmount = (price * affiliateBps) / BPS_DENOMINATOR;
        }

        uint256 creatorAmount = price - affiliateAmount;

        totalSales += 1;
        totalVolume += price;

        paymentToken.safeTransferFrom(msg.sender, address(this), price);
        paymentToken.safeTransfer(creator, creatorAmount);
        if (affiliateAmount > 0) {
            paymentToken.safeTransfer(paidAffiliate, affiliateAmount);
        }

        registry.recordPurchase(msg.sender, creator, paidAffiliate, address(this), price, creatorAmount, affiliateAmount);

        emit PurchaseSettled(msg.sender, creator, paidAffiliate, price, creatorAmount, affiliateAmount);
    }

    function setActive(bool active_) external {
        if (msg.sender != creator) revert OnlyCreator();
        active = active_;
        emit CampaignStatusChanged(active_);
    }
}
