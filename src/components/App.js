import { useState, useEffect } from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import Countdown from 'react-countdown'
import Web3 from 'web3'
import Web3EthContract from "web3-eth-contract";
import twitter from '../images/socials/twitter.svg'
import os from '../images/socials/opensea.svg'
import showcase from '../images/showcase.gif'
import banner2 from '../images/banner2.png'
import '../App.css'
import Sk8Ratz from '../abis/SK8.json'
import config from '../config.json'

function App() {
	const [web3, setWeb3] = useState(null)
	const [sk8Ratz, setSk8Ratz] = useState(null)

	const [supplyAvailable, setSupplyAvailable] = useState(0)
	const [mintAmount, setMintAmount] = useState(1);

	const [account, setAccount] = useState(null)
	const [networkId, setNetworkId] = useState(null)
	const [ownerOf, setOwnerOf] = useState([])

	const [explorerURL, setExplorerURL] = useState('https://etherscan.io')
	const [openseaURL, setOpenseaURL] = useState('https://opensea.io')

	const [isMinting, setIsMinting] = useState(false)
	const [isError, setIsError] = useState(false)
	const [message, setMessage] = useState(null)

	const [currentTime, setCurrentTime] = useState(new Date().getTime())
	const [revealTime, setRevealTime] = useState(0)

	const loadBlockchainData = async (_web3, _account, _networkId) => {

		
		try {
			
			const sk8Ratz = new _web3.eth.Contract(Sk8Ratz, "0x3431406545AD80b6a216DA322736C2Bf56962b02")
			setSk8Ratz(sk8Ratz)

			

			const maxSupply = await sk8Ratz.methods.maxSupply().call()
			const totalSupply = await sk8Ratz.methods.totalSupply().call()
			setSupplyAvailable(maxSupply - totalSupply)


			
			if (_account) {
				const ownerOf = await sk8Ratz.methods.walletOfOwner(_account).call()
				setOwnerOf(ownerOf)
				console.log(ownerOf)
			} else {
				setOwnerOf([])
			}
		
		} catch (error) {
			setIsError(true)
			setMessage(
				<p className='pleaseConnect'>
				<center>Please connect to Ethereum Mainnet in your web3 wallet to see minting button.</center>
				</p>
				)
		}
	
	}


	const loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined') {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()
			console.log(accounts)

			if (accounts.length > 0) {
				setAccount(accounts[0])
			} else {
				setMessage('Please connect with MetaMask')
			}

			const networkId = await web3.eth.net.getId()
			setNetworkId(networkId)

			if (networkId !== 5777) {
				setExplorerURL(config.NETWORKS[networkId].explorerURL)
				setOpenseaURL(config.NETWORKS[networkId].openseaURL)
			}

			await loadBlockchainData(web3, accounts[0], networkId)

			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
				setMessage(null)
			})

			window.ethereum.on('chainChanged', (chainId) => {
				window.location.reload();
			})
		}
	}

	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}

	const mintNFTHandler = async () => {
		

		

		if (sk8Ratz && account) {
			var mintAmount= Number(document.querySelector("[name=inputAmt]").value);
			var mintRate = Number(await sk8Ratz.methods.cost().call());
			var totalAmount = mintAmount * mintRate;
			setIsMinting(true)
			setIsError(false)

			await sk8Ratz.methods.mint(mintAmount).send({ from: account, value: String(totalAmount) })
				.on('confirmation', async () => {
					const maxSupply = await sk8Ratz.methods.maxSupply().call()
					const totalSupply = await sk8Ratz.methods.totalSupply().call()
					setSupplyAvailable(maxSupply - totalSupply)

					const ownerOf = await sk8Ratz.methods.walletOfOwner(account).call()
					setOwnerOf(ownerOf)
				})
				.on('error', (error) => {
					window.alert(error)
					setIsError(true)
				})
		}

		setIsMinting(false)
	}

	
	
useEffect(() => {
		loadWeb3()
	}, [account]);

	return (
		<body>
					<row>
					<center>
					<a href="http://opensea.io/collection/sk8ratz" target="_blank"  rel="noopener noreferrer"> <img src={os} className="os-logo" alt=""></img>        
           			</a>

					<a href="http://www.twitter.com/sk8_ratz" target="_blank" rel="noopener noreferrer">
                	<img src={twitter} className="twitter-logo" alt=""></img> </a>
					
					<a href="http://www.sk8ratz.app/" target="_blank" rel="noopener noreferrer">
                	<img src={banner2} className="banner2" alt=""></img> </a>
					
					
		            {account ? (
		                <a
		                    href={`${explorerURL}/address/${account}`}
		                    target="_blank"
		                    rel="noopener noreferrer"
		                    className="button">
		                    {account.slice(0, 4) + '...' + account.slice(38, 42)}
		                </a>
		            ) : (
		                <button onClick={web3Handler} className="button">Connect</button>
		            )}

		            </center>
		           
		           </row>
		            

					<center>
					<img src={showcase} alt="Sk8 Ratz" className='showcase'></img>
					</center>

					


						<div>
				
							{isError ? (
								<p>{message}</p>
							) : (
								<div className="mintPortal">
								
								<center>
								<input class="qty2" type="number" name="inputAmt" placeholder="QTY" defaultValue="1" step="1" min="1" max="20" id="inputId"></input>
								
									{isMinting ? (
										<button className='mint-button mt-3'>
										<Spinner
									      as="span"
									      animation="border"
									      size="sm"
									      variant="light"
									    ></Spinner>
									    </button>
									) : (
										<button onClick={mintNFTHandler} className='mint-button mt-3'>Mint</button>
									)}
										</center>
								</div>

							)}

						<center>
						<p className="thesupply">
						2970 / 3000 remaining | 0.01 ☰
						</p>
						</center>
						
						<center>
						{ownerOf.length > 0 &&
										<p style={{ display: 'inline-block', fontSize:'20px' }}><small>VIEW YOUR
											<a
												href={`${openseaURL}/assets/${sk8Ratz._address}/${ownerOf[0]}`}
												target='_blank'
												style={{ display: 'inline-block',fontSize:'18px',marginLeft: '3px' }}>
												SK8 RATZ
											</a>
										</small></p>}

						</center>

						<Col style={{ marginTop: "15px" }}>
						<center>
							
							<a href="https://etherscan.io/address/0x3431406545AD80b6a216DA322736C2Bf56962b02" target="_blank" className="smartcontractaddress1" rel="noopener noreferrer">
							0x3431406545AD80b6a216DA322736C2Bf56962b02</a></center>
							
							<center>
							<p className ="smartcontractaddress2">
							<a href="https://etherscan.io/address/0x3431406545AD80b6a216DA322736C2Bf56962b02" target="_blank" rel="noopener noreferrer">
							[VERIFIED SMART CONTRACT ADDRESS]</a></p></center>
						</Col>
						
				</div>

			
			<footer>
				<hr></hr>
					<center> <p> 
						SK8 RATZ is icensed under
						<a href="https://creativecommons.org/licenses/by-sa/4.0/?ref=chooser-v1"> CC BY-SA 4.0</a>
					</p> </center>
			</footer>
				

		</body>

	)
}

export default App
