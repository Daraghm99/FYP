import React from 'react'

const FilterScooters = ({  filter, setFilter }) => {
  return (
    <div className='fsearch-container'>
      <h1>Your E-scooters</h1>
      <p>Click the button below to tranfer ownership of your E-scooter</p>
      <p>Has your E-Scooter been stolen? Click the button below to mark it as stolen.</p>
      <form onSubmit={(e) => e.preventDefault()}>
          <input 
              type='text'
              id='tableFilter'
              placeholder='Filter Table'
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
          />
      </form>
    </div>    
  )
}

export default FilterScooters