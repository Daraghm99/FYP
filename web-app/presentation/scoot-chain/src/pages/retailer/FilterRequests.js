import React from 'react'

const FilterRequests = ({ filter, setFilter }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
        <input 
            type='text'
            id='tableFilter'
            placeholder='Filter Table'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
        />
    </form>
  )
}

export default FilterRequests