import React, { useState, useEffect, useMemo, useRef } from 'react';
import classnames from 'classnames';
import fuzzy from 'fuzzy';
import { useDebouncedCallback } from 'use-debounce';
import { PlayroomProps } from '../Playroom';
import { Snippet } from '../../../utils';
import SearchField from './SearchField/SearchField';
import { Strong } from '../Strong/Strong';
import { Text } from '../Text/Text';

// @ts-ignore
import styles from './Snippets.less';

type HighlightIndex = number | null;
type ReturnedSnippet = Snippet | null;
interface Props {
  snippets: PlayroomProps['snippets'];
  onHighlight?: (snippet: ReturnedSnippet) => void;
  onClose?: (snippet: ReturnedSnippet) => void;
}

const getLabel = (snippet: Snippet) => `${snippet.group}\n${snippet.name}`;

const filterSnippetsForTerm = (snippets: Props['snippets'], term: string) =>
  term
    ? fuzzy
        .filter(term, snippets, {
          extract: (snippet) => `${snippet.group} ${snippet.name}`,
        })
        .map(({ original, score }) => ({ ...original, score }))
    : snippets;

const scrollToHighlightedSnippet = (
  listEl: HTMLUListElement | null,
  highlightedEl: HTMLLIElement | null
) => {
  if (highlightedEl && listEl) {
    const scrollStep = Math.max(
      Math.ceil(listEl.offsetHeight * 0.25),
      highlightedEl.offsetHeight * 2
    );
    const currentListTop = listEl.scrollTop + scrollStep;
    const currentListBottom =
      listEl.offsetHeight + listEl.scrollTop - scrollStep;
    let top = 0;

    if (
      highlightedEl === listEl.firstChild ||
      highlightedEl === listEl.lastChild
    ) {
      highlightedEl.scrollIntoView(false);
      return;
    }

    if (highlightedEl.offsetTop >= currentListBottom) {
      top =
        highlightedEl.offsetTop -
        listEl.offsetHeight +
        highlightedEl.offsetHeight +
        scrollStep;
    } else if (highlightedEl.offsetTop <= currentListTop) {
      top = highlightedEl.offsetTop - scrollStep;
    } else {
      return;
    }

    if ('scrollBehavior' in window.document.documentElement.style) {
      listEl.scrollTo({
        left: 0,
        top,
        behavior: 'smooth',
      });
    } else {
      listEl.scrollTo(0, top);
    }
  }
};

export default ({ snippets, onHighlight, onClose }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<HighlightIndex>(
    null
  );
  const listEl = useRef<HTMLUListElement | null>(null);
  const highlightedEl = useRef<HTMLLIElement | null>(null);
  const closeHandler = (returnValue: ReturnedSnippet) => {
    if (typeof onClose === 'function') {
      onClose(returnValue);
    }
  };
  const [debouncedPreview] = useDebouncedCallback(
    (previewSnippet: ReturnedSnippet) => {
      if (typeof onHighlight === 'function') {
        onHighlight(previewSnippet);
      }
    },
    50
  );
  const [debounceScrollToHighlighted] = useDebouncedCallback(
    scrollToHighlightedSnippet,
    50
  );
  const filteredSnippets = useMemo(
    () => filterSnippetsForTerm(snippets, searchTerm),
    [searchTerm, snippets]
  );

  useEffect(() => {
    debouncedPreview(
      typeof highlightedIndex === 'number'
        ? filteredSnippets[highlightedIndex]
        : null
    );
  }, [debouncedPreview, filteredSnippets, highlightedIndex]);

  return (
    <div className={styles.root} data-testid="snippets">
      <div className={styles.fieldContainer}>
        <SearchField
          value={searchTerm}
          onChange={(e) => {
            const { value } = e.currentTarget;
            setSearchTerm(value);
          }}
          placeholder="Find a snippet..."
          onBlur={() => {
            setHighlightedIndex(null);
          }}
          onKeyUp={() => {
            debounceScrollToHighlighted(listEl.current, highlightedEl.current);
          }}
          onKeyDown={(event) => {
            if (/^(?:Arrow)?Down$/.test(event.key)) {
              if (
                highlightedIndex === null ||
                highlightedIndex === filteredSnippets.length - 1
              ) {
                setHighlightedIndex(0);
              } else if (highlightedIndex < filteredSnippets.length - 1) {
                setHighlightedIndex(highlightedIndex + 1);
              }
              event.preventDefault();
            } else if (/^(?:Arrow)?Up$/.test(event.key)) {
              if (highlightedIndex === null || highlightedIndex === 0) {
                setHighlightedIndex(filteredSnippets.length - 1);
              } else if (highlightedIndex > 0) {
                setHighlightedIndex(highlightedIndex - 1);
              }
              event.preventDefault();
            } else if (
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey &&
              /^[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]$/i.test(event.key)
            ) {
              // reset index when character typed in field
              setHighlightedIndex(0);
            } else if (event.key === 'Enter' && highlightedIndex !== null) {
              closeHandler(filteredSnippets[highlightedIndex]);
            } else if (event.key === 'Escape') {
              closeHandler(null);
            }
          }}
          data-testid="filterSnippets"
        />
      </div>
      <ul
        className={styles.snippetsContainer}
        data-testid="snippet-list"
        ref={listEl}
      >
        {filteredSnippets.map((snippet, index) => {
          const isHighlighted = highlightedIndex === index;

          return (
            <li
              ref={isHighlighted ? highlightedEl : undefined}
              key={`${snippet.group}_${snippet.name}_${index}`}
              className={classnames(styles.snippet, {
                [styles.highlight]: isHighlighted,
              })}
              onMouseMove={
                isHighlighted ? undefined : () => setHighlightedIndex(index)
              }
              onMouseDown={() => closeHandler(filteredSnippets[index])}
              title={getLabel(snippet)}
            >
              <Text size="large">
                <Strong>{snippet.group}</Strong>
                <span className={styles.snippetName}>{snippet.name}</span>
              </Text>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
