import React from 'react'

const FilterRequests = ({ filter, setFilter }) => {
  return (
    <div className='fsearch-container'>
      <h1>Pending E-Scooter Registration Requests</h1>
      <p>Click the Buttons below to either Approve or Reject a Request</p>
      <p>Use the Search below to Filter</p>
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

export default FilterRequests