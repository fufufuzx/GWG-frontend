import { ethers } from 'ethers'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faSun, faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { useNetwork, useContractRead, useAccount } from 'wagmi'

import GWGABI from '../../pages/data/ABI/gwg.json'



const Pred = () => {

  const [isMounted, setIsMounted] = useState(false);
  const { chain } = useNetwork();
  const { address: owner } = useAccount()

  const [rounds, setRounds] = useState([]);

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const currentRound = rounds[currentRoundIndex];
  const [animating, setAnimating] = useState(false);

  const gwgContractAddress = '0xbc1a221F5076488C55bd940B12F890ffCF9e4172'


  const { data: roundsData } = useContractRead({
    address: gwgContractAddress,
    abi: GWGABI,
    functionName: 'getRounds',
    args: [[1, 2]],
    watch: false,
    onSuccess(data) {
      let parseData = data.map(round => ({
        roundId: parseInt(round[0]._hex),
        startTimestamp: parseInt(round[1]._hex),
        durationTimestamp: parseInt(round[2]._hex),
        endTimestamp: parseInt(round[3]._hex),
        betAward: parseInt(round[4]._hex),
        isOver: round[5],
        isRain: round[6],
      }));

      console.log('data', parseData)

      setRounds(parseData)
    }
  })

  const handlePrevious = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentRoundIndex((prevIndex) =>
        prevIndex === 0 ? rounds.length - 1 : prevIndex - 1
      );
      setAnimating(false);
    }, 500); // Animation duration
  };

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentRoundIndex((prevIndex) =>
        prevIndex === rounds.length - 1 ? 0 : prevIndex + 1
      );
      setAnimating(false);
    }, 500); // Animation duration
  };

  useEffect(() => {
    setIsMounted(true);
  }, [chain, owner]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='pb-20'>
        <div className='flex justify-center items-center'>
          <Image
            src="/logo.png"
            alt="logo"
            width={300}
            height={300}
          />
        </div>
        <div className='text-2xl font-semibold border-b-2'>
          Powered By Giza&WeatherXM
        </div>
      </div>

      {rounds.length > 0 ? (
        <div className='flex items-center justify-center mt-8'>
          <button onClick={handlePrevious} className='p-2 border text-2xl'>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <div className={`bg-gray-900 border-2 p-4 m-2 w-96 shadow-lg transform transition-transform duration-200 ${animating ? 'opacity-30' : 'opacity-100'}`}>
            <h3 className='text-xl font-bold mb-2 text-white'>Round {currentRound.roundId}</h3>
            <p className='text-white'>Start: {new Date(currentRound.startTimestamp * 1000).toLocaleString()}</p>
            <p className='text-white'>End: {new Date(currentRound.endTimestamp * 1000).toLocaleString()}</p>
            <p className='text-white'>Duration: {currentRound.durationTimestamp / 3600} hours</p>
            <p className='text-white'>Bet Award: {currentRound.betAward}</p>
            <p className='text-white'>{currentRound.isOver ? "Over" : "Active"}</p>
            <p className='text-white'>{currentRound.isRain ? "Rain Expected" : "No Rain"}</p>


            <div className='flex justify-between mt-4 space-x-2'>
              <button className='text-white text-3xl border-2 border-white p-2 w-full'>
                <FontAwesomeIcon icon={faSun} />
              </button>
              <button className='text-white text-3xl border-2 border-white p-2 w-full'>
                <FontAwesomeIcon icon={faCloudRain} />
              </button>
            </div>
            <div className='flex justify-center mt-4'>
              <button className='border-2 border-white text-white p-2 max-w-full w-full'>Claim</button>
            </div>

          </div>
          <button onClick={handleNext} className='p-2 border text-2xl'>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      ) : (
        <div className='text-2xl font-semibold'>Loading...</div>
      )}

    </div>
  )
}

export default Pred