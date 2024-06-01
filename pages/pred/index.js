import { ethers } from 'ethers'
import React, { useState, useEffect } from 'react'


import { useNetwork, useContractRead, useAccount } from 'wagmi'


const Pred = () => {

  const [isMounted, setIsMounted] = useState(false);
  const { chain } = useNetwork();
  const { address: owner } = useAccount()

  useEffect(() => {
    setIsMounted(true);
  }, [chain, owner]);

  if (!isMounted) {
    return null;
  }
  return (
    <div className='flex items-center justify-center'>
      xxxxxxxxxx
    </div>
  )
}

export default Pred