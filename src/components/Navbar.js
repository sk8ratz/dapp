import React, { useState } from 'react';
import Web3 from 'web3';
import twitter from '../images/socials/twitter.svg';
import os from '../images/socials/opensea.svg';
import ratz from '../images/socials/ratz.png';
import github from '../images/socials/github.png';
import { Link } from 'react-router-dom';
import Sk8Ratz from '../abis/SK8.json';
import config from '../config.json';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [explorerURL, setExplorerURL] = useState('https://etherscan.io');
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);

  const handleClick = () => {
    setNav(!nav);
  };

  const web3Handler = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const _web3 = new Web3(window.ethereum);
        setWeb3(_web3);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } else {
        window.alert('Please install and connect to Metamask to mint SK8 RATZ.');
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };

  return (
    <div>
      <div className="nav-col-og">
        <a href="http://medium.com/@sk8ratz/about" target="_blank" rel="noopener noreferrer">
          <img src={ratz} className="ratz-face" alt="" />
        </a>
        <a href="http://opensea.io/collection/sk8ratz" target="_blank" rel="noopener noreferrer">
          <img src={os} className="os-logo" alt="" />
        </a>
        <a href="http://twitter.com/sk8_ratz" target="_blank" rel="noopener noreferrer">
          <img src={twitter} className="twitter-logo" alt="" />
        </a>
        <a href="http://github.com/sk8ratz" target="_blank" rel="noopener noreferrer">
          <img src={github} className="github-logo" alt="" />
        </a>
      </div>

      <div className={`hamburger ${nav ? 'active' : ''}`} onClick={handleClick}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
        {nav && <span className="exit-icon" onClick={handleClick}></span>}
      </div>

      <ul className={`nav-menu ${nav ? 'active' : ''}`}>
        <div className="nav-menu-text">
        <li className="nav-item">
            <a href="#" onClick={web3Handler}>
              {account ? `${account.slice(0, 4)}...${account.slice(38, 42)}` : "CONNECT"}
            </a>
          </li>
          <li className="nav-item">
            <a href="http://medium.com/@sk8ratz/about" target="_blank" rel="noopener noreferrer" onClick={handleClick}>
              ABOUT
            </a>
          </li>
          <li className="nav-item">
            <a href="http://opensea.io/collection/sk8ratz" target="_blank" rel="noopener noreferrer" onClick={handleClick}>
              OPENSEA
            </a>
          </li>
          <li className="nav-item">
            <a href="http://twitter.com/sk8_ratz" target="_blank" rel="noopener noreferrer" onClick={handleClick}>
              TWITTER
            </a>
          </li>
          <li className="nav-item">
            <a href="http://github.com/sk8ratz" target="_blank" rel="noopener noreferrer" onClick={handleClick}>
              GITHUB
            </a>
          </li>
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
