import React from 'react'
import Header from './Components/Header/Header'
import MenuRandomList from '../MenuPage/components/MenuRandomList/MenuRandomList'
import HomeNavbar from './Components/Navbar/HomeNavbar'
import Footer from './../HomePage/Components/Footer/Footer'
function HomePage() {

  return (
    <div>
      <HomeNavbar/>
      <Header />
      <MenuRandomList />
      <Footer />
    </div>
  )
}

export default HomePage