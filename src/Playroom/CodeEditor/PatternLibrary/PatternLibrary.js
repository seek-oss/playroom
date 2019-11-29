import React, { useState } from 'react';
import styles from './PatternLibrary.less';
import SearchSvg from '../../../assets/icons/SearchSvg';
import ReturnSvg from '../../../assets/icons/ReturnSvg';
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
      <div>
        <div className={styles.fieldContainer}>
          <SearchSvg className={styles.searchIcon} />
          <input
            className={`${styles.noFocus} ${styles.field}`}
            placeholder="Search for..."
            autoFocus
            type="text"
            value={searchTerm}
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
        <div className={styles.patternsContainer}>
          {filteredPatterns.map(({ category, name, code }, index) => {
            const isHighlighted = calculatedHighlightedIndex === index;

            return (
              <div
                key={code}
                className={styles.pattern}
                style={{
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
                <div>
                  <strong>{category}</strong>{' '}
                  <span
                    style={{ color: isHighlighted ? '#e1e5ff' : '#69768c' }}
                  >
                    – {name}
                  </span>
                </div>
                <ReturnSvg className={styles.returnIcon} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
