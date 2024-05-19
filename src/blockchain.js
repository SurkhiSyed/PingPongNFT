import { ethers } from 'ethers';

let provider;
let signer;

export async function connectMetamask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            signer = provider.getSigner();
            console.log('Account address:', await signer.getAddress());

            const balance = await signer.getBalance();
            const convertToEth = 1e18;
            console.log('Account balance in ether:', balance.toString() / convertToEth);
        } catch (error) {
            console.error('Error connecting to Metamask', error);
        }
    } else {
        console.error('Metamask is not installed');
    }
}

export async function claimTokens(totalGAVAXScore) {
    const runTokenContractAddress = 'replace-with-contract-address';
    const runTokenContractAbi = [
        'function mintTokens(address account, uint256 amount) public',
    ];
    const runTokenContract = new ethers.Contract(runTokenContractAddress, runTokenContractAbi, provider);
    const convertToWei = 1000000000;
    const amountToClaim = totalGAVAXScore * convertToWei;
    try {
        await runTokenContract.connect(signer).mintTokens(await signer.getAddress(), amountToClaim.toString());
    } catch (error) {
        console.error('Error claiming tokens', error);
    }
}

export async function claimNft(totalNFTScore) {
    const nftContractAddress = 'replace-with-contract-address';
    const mintContractAbi = [
        'function mint(uint256 amount) public',
    ];
    const nftContract = new ethers.Contract(nftContractAddress, mintContractAbi, provider);
    try {
        await nftContract.connect(signer).mint(totalNFTScore.toString());
    } catch (error) {
        console.error('Error claiming NFT', error);
    }
}
