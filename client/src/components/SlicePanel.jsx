import { useState } from 'react'
import { SLICES, MAX_SLICES } from '../constants'

export default function SlicePanel({ slices, qty, setQty, addSlice, removeSlice, reorderSlice }) {
  const atMax = slices.length >= MAX_SLICES
  const [dragIndex, setDragIndex] = useState(null)
  const [overIndex, setOverIndex] = useState(null)

  function handleDragStart(e, i) {
    setDragIndex(i)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e, i) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (i !== overIndex) setOverIndex(i)
  }

  function handleDrop(e, i) {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== i) {
      reorderSlice(dragIndex, i)
    }
    setDragIndex(null)
    setOverIndex(null)
  }

  function handleDragEnd() {
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="slice-panel">
      <div className="panel-section glass">
        <p className="section-label">Add Ingredients</p>
        {atMax && <p className="limit-msg">⚠ Max {MAX_SLICES} slices reached</p>}
        <div className="slice-buttons">
          {SLICES.map(s => (
            <button
              key={s.name}
              className="slice-btn"
              onClick={() => addSlice(s)}
              disabled={atMax}
            >
              <span className="dot" style={{ background: s.color }} />
              {s.name}
              <span className="price-tag">₹{s.price}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section glass">
        <p className="section-label">Your Stack — drag to reorder</p>
        <ul className="stack-list">
          {slices.map((slice, i) => {
            const isBoundary = i === 0 || i === slices.length - 1
            return (
              <li
                key={i}
                className={[
                  'stack-item',
                  isBoundary ? 'boundary' : 'draggable',
                  dragIndex === i ? 'dragging' : '',
                  overIndex === i && dragIndex !== i ? 'drag-over' : '',
                ].join(' ')}
                draggable={!isBoundary}
                onDragStart={isBoundary ? undefined : e => handleDragStart(e, i)}
                onDragOver={isBoundary ? undefined : e => handleDragOver(e, i)}
                onDrop={isBoundary ? undefined : e => handleDrop(e, i)}
                onDragEnd={handleDragEnd}
              >
                {!isBoundary && (
                  <span className="drag-handle" title="Drag to reorder">⠿</span>
                )}
                <span className="stack-dot" style={{ background: slice.color }} />
                <span className="stack-name">{slice.name}</span>
                {slice.price > 0 && (
                  <span className="stack-price">₹{slice.price}</span>
                )}
                <button
                  className="remove-btn"
                  onClick={() => removeSlice(i)}
                  disabled={isBoundary}
                  title="Remove"
                >✕</button>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="panel-section glass">
        <p className="section-label">Quantity</p>
        <div className="qty-controls">
          <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
          <span className="qty-display">{qty}</span>
          <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
        </div>
      </div>
    </div>
  )
}
