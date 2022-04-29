// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "../interfaces/IERC20.sol";
import "../interfaces/IUniswapV2Router01.sol";

contract MySwap {
    address public constant WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
    address public constant UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        uint256 _amountOutMin,
        address to
    ) external {
        IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn); //after this, contract has amountIn of tokenIn
        IERC20(_tokenIn).approve(UNISWAP_V2_ROUTER, _amountIn);

        address[] memory path;
        path = new address[](3);
        path[0] = _tokenIn;
        path[1] = WETH;
        path[2] = _tokenOut;

        IUniswapV2Router01(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
            _amountIn,
            _amountOutMin,
            path,
            to,
            block.timestamp + 5*60
        );
    }
}