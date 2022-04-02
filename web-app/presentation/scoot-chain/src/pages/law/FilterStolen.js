import React from 'react'

const FilterStolen = ({ filter, setFilter }) => {
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

export default FilterStolen