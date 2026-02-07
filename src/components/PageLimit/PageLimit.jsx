import React from 'react'

export default function PageLimit({limit , setLimit , setPage}) {
  return (
    <div className="d-flex align-items-center gap-1">
            <span>Show:</span>
            <select
              className="form-select form-select-sm w-auto"
              value={limit}
              onChange={(e) => {
                setLimit(parseInt(e.target.value));
                setPage(1)
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
  )
}
