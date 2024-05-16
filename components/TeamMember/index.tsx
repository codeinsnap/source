import React from 'react'
import VINScan from './VINScan'
import VINCard from './VINCard'
import TeamMemberStallInfo from './TeamMemberStallInfo'

export default function TeamMemberWrapper() {
    return (
        <>
            <TeamMemberStallInfo />
            <VINCard/>
            <VINScan />
        </>
    )
}
