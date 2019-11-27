import React, { useState } from 'react';

export default ({ patterns, onSelected, onExit, onHighlight }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const calculatedHighlightedIndex =
    highlightedIndex === null && searchTerm.length > 0 ? 0 : highlightedIndex;

  const filteredPatterns = searchTerm
    ? patterns.filter(({ name }) =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : patterns;

  const highlight = index => {
    setHighlightedIndex(index);
    onHighlight(typeof index === 'number' ? filteredPatterns[index] : null);
  };

  return (
    <div>
      <div style={{ paddingBottom: 8 }}>
        <input
          autoFocus
          type="text"
          value={searchTerm}
          style={{
            height: 32,
            fontSize: 16,
            lineHeight: '32px',
            border: '1px solid #ccc',
            borderRadius: 8,
            width: '100%'
          }}
          onBlur={() => {
            onHighlight(null);
            onExit();
          }}
          onChange={e => {
            const { value } = e.target;

            const freshFilteredPatterns = value
              ? patterns.filter(({ name }) =>
                  name.toLowerCase().includes(value.toLowerCase())
                )
              : patterns;

            if (value.length > 0 && freshFilteredPatterns.length > 0) {
              setHighlightedIndex(0);
              onHighlight(freshFilteredPatterns[0]);
            } else {
              setHighlightedIndex(null);
              onHighlight(null);
            }

            setSearchTerm(value);
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown' || e.key === 'Down') {
              if (calculatedHighlightedIndex === null) {
                highlight(0);
              } else if (
                calculatedHighlightedIndex <
                filteredPatterns.length - 1
              ) {
                highlight(calculatedHighlightedIndex + 1);
              }
            } else if (e.key === 'ArrowUp' || e.key === 'Up') {
              if (calculatedHighlightedIndex === null) {
                highlight(filteredPatterns.length - 1);
              } else if (calculatedHighlightedIndex > 0) {
                highlight(calculatedHighlightedIndex - 1);
              }
            } else if (e.key === 'Enter') {
              if (calculatedHighlightedIndex !== null) {
                onSelected(filteredPatterns[calculatedHighlightedIndex]);
              }
              onExit();
            } else if (e.key === 'Escape') {
              onExit();
            }
          }}
        />
      </div>
      {filteredPatterns.map(({ name, code }, index) => (
        <div
          key={code}
          style={{
            background:
              calculatedHighlightedIndex === index ? 'blue' : undefined
          }}
          onMouseEnter={() => highlight(index)}
          onMouseDown={() => {
            onSelected(filteredPatterns[index]);
            onExit();
          }}
        >
          {name}
        </div>
      ))}
    </div>
  );
};
