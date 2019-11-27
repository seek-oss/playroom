import React, { useState } from 'react';

export default ({ patterns, onSelected, onExit, onHighlight }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(null);

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
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'ArrowDown' || e.key === 'Down') {
              if (highlightedIndex === null) {
                highlight(0);
              } else if (highlightedIndex < filteredPatterns.length - 1) {
                highlight(highlightedIndex + 1);
              }
            } else if (e.key === 'ArrowUp' || e.key === 'Up') {
              if (highlightedIndex === null) {
                highlight(filteredPatterns.length - 1);
              } else if (highlightedIndex > 0) {
                highlight(highlightedIndex - 1);
              }
            } else if (e.key === 'Enter') {
              if (highlightedIndex !== null) {
                onSelected(filteredPatterns[highlightedIndex]);
              }
              onExit();
            } else {
              highlight(null);
            }
          }}
        />
      </div>
      {filteredPatterns.map(({ name, code }, index) => (
        <div
          key={code}
          style={{
            background: highlightedIndex === index ? 'blue' : undefined
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
