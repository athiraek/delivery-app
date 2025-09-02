import React from 'react'
import UserNavbar from '../UserNavbar/UserNavbar'
import MenuItemList from '../../MenuPage/components/MenuItemList/MenuItemList'
import Footer from '../../HomePage/Components/Footer/Footer'
const UserMenu = () => {
  return (
    <div>
        <UserNavbar />
        <MenuItemList />
        <Footer />
    </div>
  )
}

export default UserMenu