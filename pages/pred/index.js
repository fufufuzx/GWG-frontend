import { ethers } from 'ethers'
import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faCaretLeft, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faSun, faCloudRain, faQuestion, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { useNetwork, useContractRead, useContractWrite, useAccount } from 'wagmi'

import GWGABI from '../../pages/data/ABI/gwg.json'



const Pred = () => {

  const [isMounted, setIsMounted] = useState(false);
  const { chain } = useNetwork();
  const { address: owner } = useAccount()

  const [rounds, setRounds] = useState([]);
  const [bets, setBets] = useState([]);


  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const currentRound = rounds[currentRoundIndex];
  const currentBet = bets[currentRoundIndex];
  const [animating, setAnimating] = useState(false);

  const gwgContractAddress = '0x7EF2CFc86513ec79b8C8DE742a0991be2798A8e9'

  const [queryRoundIds, setQueryRoundIds] = useState([9,6,7,8])

  const { data: roundsData } = useContractRead({
    address: gwgContractAddress,
    abi: GWGABI,
    functionName: 'getRounds',
    args: [queryRoundIds],
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

  const { data: betsData } = useContractRead({
    address: gwgContractAddress,
    abi: GWGABI,
    functionName: 'getBets',
    args: [owner, queryRoundIds],
    watch: false,
    onSuccess(data) {
      let parseData = data.map(bet => ({
        isParticipated: bet[0],
        isBetRain: bet[1],
        isOver: bet[2],
      }));

      console.log('dataBet', parseData)

      setBets(parseData)
    }
  })

  const handlePlaceBet = (roundId, prediction) => {
    placeBet({ recklesslySetUnpreparedArgs: [roundId, prediction] });
  };


  const { write: placeBet } = useContractWrite({
    address: gwgContractAddress,
    abi: GWGABI,
    functionName: 'placeBet',
    onError(e) {
      console.log('error', e)
    },
    onClick(e) {
      console.log('eeee')
    }
  })



  const handleClaimReward = (roundId) => {
    claimReward({ recklesslySetUnpreparedArgs: [roundId] });
  };

  const { write: claimReward } = useContractWrite({
    address: gwgContractAddress,
    abi: GWGABI,
    functionName: 'claimReward',
    onError(e) {
      console.log('error', e)
    },
    onClick(e) {
      console.log('eeee')
    }
  })



  const handlePrevious = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentRoundIndex((prevIndex) =>
        prevIndex === 0 ? rounds.length - 1 : prevIndex - 1
      );
      setAnimating(false);
    }, 200);
  };

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentRoundIndex((prevIndex) =>
        prevIndex === rounds.length - 1 ? 0 : prevIndex + 1
      );
      setAnimating(false);
    }, 200);
  };

  const renderIcons = () => {
    const icons = [];
    if (!currentRound.isOver) {
      for (let i = 0; i < 5; i++) {
        icons.push(<FontAwesomeIcon key={i} icon={faCircleQuestion} className='text-white mx-1' />);
      }
    } else {
      const icon = currentRound.isRain ? faCloudRain : faSun;
      for (let i = 0; i < 5; i++) {
        icons.push(<FontAwesomeIcon key={i} icon={icon} className='text-white mx-1' />);
      }
    }
    return icons;
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
        <div className='flex flex-col items-center justify-center mt-8'>
          <div className='flex items-center justify-center'>
            <button onClick={handlePrevious} className='p-2 text-5xl'>
              <FontAwesomeIcon icon={faCaretLeft} />
            </button>
            <div className={`bg-gray-900 border-2 p-4 m-2 w-96 shadow-lg transform transition-transform duration-200 ${animating ? 'opacity-30' : 'opacity-100'} text-center`}>
              <h3 className='text-xl font-bold mb-2 text-white pt-5'>Round  {new Date(currentRound.endTimestamp * 1000).toLocaleDateString()}</h3>
              <p className='text-white pt-5'>{"Location: Los Angeles"}</p>
              <p className='text-white'>Start Time: {new Date(currentRound.startTimestamp * 1000).toLocaleString()}</p>
              <p className='text-white'>End Time: {new Date(currentRound.endTimestamp * 1000).toLocaleString()}</p>


              <div className='flex justify-between mt-4 space-x-2 pt-10'>
                <button
                  onClick={() => handlePlaceBet(currentRound.roundId, false)}
                  disabled={currentRound.isOver}
                  className={`text-white border-2 p-2 w-full flex justify-center space-x-3 items-center h-10 ${currentBet?.isParticipated && !currentBet?.isBetRain ? 'bg-gray-700' : ''}`}
                >
                  <FontAwesomeIcon icon={faSun} />
                  <p className='text-white'>{currentRound.betAward}</p>
                </button>
                <button
                  onClick={() => handlePlaceBet(currentRound.roundId, true)}
                  disabled={currentRound.isOver}
                  className={`text-white border-2 p-2 w-full flex justify-center space-x-3 items-center h-10 ${currentBet?.isParticipated && currentBet?.isBetRain ? 'bg-gray-700' : ''}`}
                >
                  <FontAwesomeIcon icon={faCloudRain} />
                  <p className='text-white'>{100 - currentRound.betAward}</p>
                </button>
              </div>


              <div className='flex justify-center mt-4'>

                <button
                  onClick={() => handleClaimReward(currentRound.roundId)}
                  disabled={currentBet?.isOver || (currentRound.isRain !== currentBet?.isBetRain)}
                  className={`border-2 text-white p-2 max-w-full w-full flex justify-center space-x-3 items-center h-10 ${currentBet?.isOver ? 'bg-gray-700 text-black cursor-not-allowed' : 'bg-gray-900'}`}
                >
                  {renderIcons()}
                </button>
              </div>

            </div>
            <button onClick={handleNext} className='p-2 text-5xl'>
              <FontAwesomeIcon icon={faCaretRight} />
            </button>
          </div>
        </div>

      ) : (
        <div className='text-2xl font-semibold'>Loading...</div>
      )}

    </div>
  )
}

export default Pred