import React from 'react'

const FilterTable = ({ filter, setFilter }) => {
  return (
    <div className='fsearch-container'>
      <h1>All Participants Active on the Network</h1>
      <p>Click the Remove button beside a Participant to remove them from the Network</p>
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

export default FilterTable