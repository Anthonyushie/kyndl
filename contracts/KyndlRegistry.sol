// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

import {KyndlCampaign} from "./KyndlCampaign.sol";

contract KyndlRegistry is Ownable {
    struct CampaignInfo {
        address campaign;
        address creator;
        string name;
        string metadataURI;
        uint256 price;
        uint16 affiliateBps;
        bool active;
        uint256 createdAt;
        uint256 totalSales;
        uint256 totalVolume;
    }

    struct Reputation {
        uint256 sales;
        uint256 volume;
        uint256 earned;
    }

    address public immutable paymentToken;
    address[] private campaignList;

    mapping(address campaign => CampaignInfo info) public campaigns;
    mapping(address campaign => bool valid) public isKyndlCampaign;
    mapping(address affiliate => bool verified) public isAffiliateVerified;
    mapping(address creator => Reputation reputation) public creatorReputation;
    mapping(address affiliate => Reputation reputation) public affiliateReputation;

    event CampaignCreated(
        address indexed campaign,
        address indexed creator,
        string name,
        uint256 price,
        uint16 affiliateBps,
        string metadataURI
    );
    event AffiliateVerificationChanged(address indexed affiliate, bool verified);
    event ReputationUpdated(
        address indexed buyer,
        address indexed creator,
        address indexed affiliate,
        address campaign,
        uint256 totalAmount,
        uint256 creatorAmount,
        uint256 affiliateAmount
    );

    error InvalidPaymentToken();
    error InvalidCampaign();
    error InvalidAffiliate();
    error OnlyCampaign();

    constructor(address paymentToken_, address owner_) Ownable(owner_) {
        if (paymentToken_ == address(0)) revert InvalidPaymentToken();
        paymentToken = paymentToken_;
    }

    function createCampaign(
        string calldata name,
        string calldata metadataURI,
        uint256 price,
        uint16 affiliateBps
    ) external returns (address campaign) {
        KyndlCampaign deployed = new KyndlCampaign(
            paymentToken,
            address(this),
            msg.sender,
            price,
            affiliateBps,
            name,
            metadataURI
        );

        campaign = address(deployed);
        campaignList.push(campaign);
        isKyndlCampaign[campaign] = true;
        campaigns[campaign] = CampaignInfo({
            campaign: campaign,
            creator: msg.sender,
            name: name,
            metadataURI: metadataURI,
            price: price,
            affiliateBps: affiliateBps,
            active: true,
            createdAt: block.timestamp,
            totalSales: 0,
            totalVolume: 0
        });

        emit CampaignCreated(campaign, msg.sender, name, price, affiliateBps, metadataURI);
    }

    function setAffiliateVerified(address affiliate, bool verified) external onlyOwner {
        if (affiliate == address(0)) revert InvalidAffiliate();
        isAffiliateVerified[affiliate] = verified;
        emit AffiliateVerificationChanged(affiliate, verified);
    }

    function recordPurchase(
        address buyer,
        address creator,
        address affiliate,
        address campaign,
        uint256 totalAmount,
        uint256 creatorAmount,
        uint256 affiliateAmount
    ) external {
        if (!isKyndlCampaign[msg.sender] || msg.sender != campaign) revert OnlyCampaign();

        CampaignInfo storage info = campaigns[campaign];
        if (info.campaign == address(0)) revert InvalidCampaign();

        info.totalSales += 1;
        info.totalVolume += totalAmount;

        Reputation storage creatorStats = creatorReputation[creator];
        creatorStats.sales += 1;
        creatorStats.volume += totalAmount;
        creatorStats.earned += creatorAmount;

        if (affiliate != address(0) && affiliateAmount > 0) {
            Reputation storage affiliateStats = affiliateReputation[affiliate];
            affiliateStats.sales += 1;
            affiliateStats.volume += totalAmount;
            affiliateStats.earned += affiliateAmount;
        }

        emit ReputationUpdated(buyer, creator, affiliate, campaign, totalAmount, creatorAmount, affiliateAmount);
    }

    function setCampaignActive(address campaign, bool active) external {
        CampaignInfo storage info = campaigns[campaign];
        if (info.campaign == address(0)) revert InvalidCampaign();
        if (msg.sender != info.creator) revert InvalidCampaign();
        info.active = active;
    }

    function campaignCount() external view returns (uint256) {
        return campaignList.length;
    }

    function getCampaigns() external view returns (address[] memory) {
        return campaignList;
    }
}
