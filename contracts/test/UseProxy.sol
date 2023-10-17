// SPDX-License-Identifier: AGPL-3.0-only
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

// just for build
contract UseProxy is TransparentUpgradeableProxy {
    constructor(address _logic, address admin_, bytes memory _data) payable
    TransparentUpgradeableProxy(_logic, admin_, _data){

    }
}
