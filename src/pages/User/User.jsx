import React from 'react'
import UserDashboard from './Dashboard/UserDashboard'
import UserNavbar from './UserNavbar/UserNavbar'

function User() {
  return (
    <div>
        <UserNavbar />
        <UserDashboard/>
    </div>
  )
}

export default User