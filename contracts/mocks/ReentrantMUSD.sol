// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IReentrantPurchaseTarget {
    function purchase(address affiliate) external;
}

contract ReentrantMUSD is ERC20 {
    IReentrantPurchaseTarget public purchaseTarget;
    bool public attackEnabled;

    constructor() ERC20("Reentrant Mock Mezo USD", "rMUSD") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function setAttack(address target_, bool enabled_) external {
        purchaseTarget = IReentrantPurchaseTarget(target_);
        attackEnabled = enabled_;
    }

    function transferFrom(address from, address to, uint256 value) public override returns (bool) {
        bool ok = super.transferFrom(from, to, value);
        if (attackEnabled && address(purchaseTarget) != address(0)) {
            purchaseTarget.purchase(address(0));
        }
        return ok;
    }
}
