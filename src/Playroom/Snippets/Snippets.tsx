import React, { useState } from 'react';
import classnames from 'classnames';
import fuzzy from 'fuzzy';
import { useDebouncedCallback } from 'use-debounce';
import { PlayroomProps } from '../Playroom';
import { Snippet } from '../../../utils';
import SearchField from './SearchField/SearchField';

// @ts-ignore
import styles from './Snippets.less';

interface Props {
  snippets: PlayroomProps['snippets'];
  onHighlight?: (snippet: Snippet | null) => void;
  onClose?: (snippet: Snippet | null) => void;
}
type HighlightIndex = number | null;

const getLabel = (snippet: Snippet) => `${snippet.group}\n${snippet.name}`;

const filterSnippetsForTerm = (snippets: Props['snippets'], term: string) =>
  term
    ? fuzzy
        .filter(term, snippets, {
          extract: snippet => `${snippet.group} ${snippet.name}`
        })
        .map(({ original, score }) => ({ ...original, score }))
    : snippets;

export default ({ snippets, onHighlight, onClose }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<HighlightIndex>(
    null
  );
  const calculatedHighlightedIndex =
    highlightedIndex === null && searchTerm.length > 0 ? 0 : highlightedIndex;

  const [debouncedPreview] = useDebouncedCallback(previewSnippet => {
    if (typeof onHighlight === 'function') {
      onHighlight(previewSnippet);
    }
  }, 50);

  const filteredSnippets = filterSnippetsForTerm(snippets, searchTerm);

  const highlight = ({
    index,
    trigger
  }: {
    index: HighlightIndex;
    trigger?: 'mouse' | 'keyboard';
  }) => {
    setHighlightedIndex(index);

    debouncedPreview(
      typeof index === 'number' ? filteredSnippets[index] : null
    );

    setTimeout(() => {
      if (trigger === 'keyboard' && typeof index === 'number') {
        const highlightedEl: HTMLLIElement | null = document.querySelector(
          `.${styles.highlight}`
        );
        const listEl: HTMLUListElement | null = document.querySelector(
          `.${styles.snippetsContainer}`
        );

        if (highlightedEl && listEl) {
          const currentListTop = listEl.scrollTop + highlightedEl.offsetHeight;
          const currentListBottom =
            listEl.offsetHeight + listEl.scrollTop - highlightedEl.offsetHeight;

          if (
            highlightedEl.offsetTop === 0 ||
            (highlightedEl.offsetTop >= currentListTop &&
              highlightedEl.offsetTop + highlightedEl.offsetHeight <=
                currentListBottom)
          ) {
            return;
          }

          const scrollStep = highlightedEl.offsetHeight * 2;
          let top = 0;
          if (
            highlightedEl.offsetTop + highlightedEl.offsetHeight >
            currentListBottom
          ) {
            top = listEl.scrollTop + scrollStep;
          }
          if (
            highlightedEl.offsetTop - highlightedEl.offsetHeight <
            currentListTop
          ) {
            top = listEl.scrollTop - scrollStep;
          }

          if ('scrollBehavior' in window.document.documentElement.style) {
            listEl.scrollTo({
              left: 0,
              top,
              behavior: 'smooth'
            });
          } else {
            listEl.scrollTo(0, top);
          }
        }
      }
    });
  };

  const closeHandler = (returnValue: Snippet | null) => {
    if (typeof onClose === 'function') {
      onClose(returnValue);
    }
  };

  return (
    <div className={styles.root} data-testid="snippets">
      <div className={styles.fieldContainer}>
        <SearchField
          value={searchTerm}
          onChange={e => {
            const { value } = e.currentTarget;
            const freshFilteredSnippets = filterSnippetsForTerm(
              snippets,
              value
            );

            highlight({ index: freshFilteredSnippets.length > 0 ? 0 : null });
            setSearchTerm(value);
          }}
          placeholder="Find a snippet..."
          onBlur={() => {
            highlight({ index: null });
          }}
          onKeyDown={({ key }) => {
            if (/^(?:Arrow)?Down$/.test(key)) {
              if (calculatedHighlightedIndex === null) {
                highlight({ index: 0, trigger: 'keyboard' });
              } else if (
                calculatedHighlightedIndex <
                filteredSnippets.length - 1
              ) {
                highlight({
                  index: calculatedHighlightedIndex + 1,
                  trigger: 'keyboard'
                });
              }
            } else if (/^(?:Arrow)?Up$/.test(key)) {
              if (calculatedHighlightedIndex === null) {
                highlight({
                  index: filteredSnippets.length - 1,
                  trigger: 'keyboard'
                });
              } else if (calculatedHighlightedIndex > 0) {
                highlight({
                  index: calculatedHighlightedIndex - 1,
                  trigger: 'keyboard'
                });
              }
            } else if (key === 'Enter' && calculatedHighlightedIndex !== null) {
              closeHandler(filteredSnippets[calculatedHighlightedIndex]);
            } else if (key === 'Escape') {
              closeHandler(null);
            }
          }}
          data-testid="filterSnippets"
        />
      </div>
      <ul className={styles.snippetsContainer} data-testid="snippet-list">
        {filteredSnippets.map((snippet, index) => {
          const isHighlighted = calculatedHighlightedIndex === index;

          return (
            <li
              key={`${snippet.group}_${snippet.name}`}
              className={classnames(styles.snippet, {
                [styles.highlight]: isHighlighted
              })}
              onMouseMove={
                isHighlighted
                  ? undefined
                  : () => highlight({ index, trigger: 'mouse' })
              }
              onMouseDown={() => closeHandler(filteredSnippets[index])}
              title={getLabel(snippet)}
            >
              <strong>{snippet.group}</strong>
              <span className={styles.snippetName}>{snippet.name}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
