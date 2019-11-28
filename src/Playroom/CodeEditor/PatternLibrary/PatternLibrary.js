import React, { useState } from 'react';
import styles from './PatternLibrary.less';
import fuzzysort from 'fuzzysort';

export default ({
  patterns: rawPatterns,
  onSelected,
  onCancel,
  onExit,
  onHighlight
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const calculatedHighlightedIndex =
    highlightedIndex === null && searchTerm.length > 0 ? 0 : highlightedIndex;

  const patterns = rawPatterns.map(pattern => ({
    ...pattern,
    searchTerm: `${pattern.category} ${pattern.name}`
  }));

  const filteredPatterns = searchTerm
    ? fuzzysort
        .go(searchTerm, patterns, {
          key: 'searchTerm'
        })
        .map(x => x.obj)
    : patterns;

  const highlight = index => {
    setHighlightedIndex(index);
    onHighlight(typeof index === 'number' ? filteredPatterns[index] : null);
  };

  return (
    <div className={styles.root}>
      <div
        style={{
          padding: 8
        }}
      >
        <div style={{ paddingBottom: 8 }}>
          <input
            className={styles.noFocus}
            autoFocus
            type="text"
            value={searchTerm}
            style={{
              boxSizing: 'border-box',
              height: 40,
              fontSize: 14,
              padding: '0 8px',
              lineHeight: '32px',
              border: '1px solid #ccc',
              borderRadius: 8,
              width: '100%'
            }}
            onBlur={() => {
              onHighlight(null);
              onCancel();
            }}
            onChange={e => {
              const { value } = e.target;

              const freshFilteredPatterns = value
                ? fuzzysort
                    .go(value, patterns, {
                      key: 'searchTerm'
                    })
                    .map(x => x.obj)
                : patterns;
              console.log('freshFilteredPatterns', freshFilteredPatterns);

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
                onCancel();
              }
            }}
          />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 8,
            right: 8,
            top: 56,
            bottom: 0,
            overflow: 'auto'
          }}
        >
          {filteredPatterns.map(({ category, name, code }, index) => {
            const isHighlighted = calculatedHighlightedIndex === index;

            return (
              <div
                key={code}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                  fontSize: '14px',
                  ...(isHighlighted
                    ? {
                        color: 'white',
                        background: '#5965E3'
                      }
                    : {
                        color: '#404040'
                      })
                }}
                onMouseEnter={() => highlight(index)}
                onMouseDown={() => {
                  onSelected(filteredPatterns[index]);
                  onExit();
                }}
              >
                <strong>{category}</strong>{' '}
                <span style={{ color: isHighlighted ? '#e1e5ff' : '#69768c' }}>
                  – {name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
