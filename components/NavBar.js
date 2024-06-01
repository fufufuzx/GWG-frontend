import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

import Link from 'next/link'

const NavBar = () => {
    return (
        <div className="navbar p-4 bg-black border-b-4">
            <div className="navbar-start">
                <a className="btn btn-ghost normal-case text-xl">Giza Weather Game</a>
            </div>
            <div className="navbar-center">
            </div>
            <div className="navbar-end">
                <ConnectButton />
            </div>
        </div >

    )
}

export default NavBar