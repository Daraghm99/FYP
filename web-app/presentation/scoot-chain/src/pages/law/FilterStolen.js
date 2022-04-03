import React from 'react'

const FilterStolen = ({ filter, setFilter }) => {
  return (
    <div className='fsearch-container'>
      <h1>All E-Scooters Marked as Stolen on the Network</h1>
      <p>Review these Stolen Assets</p>
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

export default FilterStolen