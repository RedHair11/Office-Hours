import React from 'react'
import Header from '../components/Header'
import DepartmentMenu from '../components/DepartmentMenu'
import AvailableProfessors from '../components/AvailableProfessors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
       {/* ----------- Header Section ----------- */}
      {/* This section typically contains the website title/logo, navigation links, and possibly a search bar */}
      <Header />

      {/* ----------- Department Menu ----------- */}
      {/* A menu or dropdown that might allow users to select a department to view related information */}
      <DepartmentMenu />

      {/* ----------- Available Professors Section ----------- */}
      {/* A section showcasing the top or most popular professors, possibly based on ratings or availability */}
      <AvailableProfessors />
      
      {/* ----------- Banner Section ----------- */}
      {/* A promotional or informational banner that could display announcements or other important information */}
      <Banner />
    </div>
  )
}

export default Home