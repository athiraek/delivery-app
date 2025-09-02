import React from 'react'
import MenuNavbar from './components/MenuNavbar/MenuNavbar'
import MenuItemList from './components/MenuItemList/MenuItemList'
import Footer from './../HomePage/Components/Footer/Footer'

function MenuPage() {
  return (
    <div>
        <MenuNavbar/>
        <MenuItemList />
        <Footer />
    </div>
  )
}

export default MenuPage