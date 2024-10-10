import { useState, useEffect, useMemo, useRef } from 'react';
import classnames from 'classnames';
import fuzzy from 'fuzzy';
import { useDebouncedCallback } from 'use-debounce';
import type { PlayroomProps } from '../Playroom';
import type { Snippet } from '../../../utils';
import SearchField from './SearchField/SearchField';
import { Text } from '../Text/Text';
import { Stack } from '../Stack/Stack';

import * as styles from './Snippets.css';

type HighlightIndex = number | null;
type ReturnedSnippet = Snippet | null;
interface Props {
  isOpen: boolean;
  snippets: PlayroomProps['snippets'];
  onHighlight?: (snippet: ReturnedSnippet) => void;
  onClose?: (snippet: ReturnedSnippet) => void;
}

const getLabel = (snippet: Snippet) => `${snippet.group}\n${snippet.name}`;

function getSnippetId(snippet: Snippet, index: number) {
  return `${snippet.group}_${snippet.name}_${index}`;
}

const filterSnippetsForTerm = (snippets: Props['snippets'], term: string) =>
  term
    ? fuzzy
        .filter(term, snippets, {
          extract: (snippet) => `${snippet.group} ${snippet.name}`,
        })
        .map(({ original, score }) => ({ ...original, score }))
    : snippets;

export default ({ isOpen, snippets, onHighlight, onClose }: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] =
    useState<HighlightIndex>(null);
  const listEl = useRef<HTMLUListElement | null>(null);
  const highlightedEl = useRef<HTMLLIElement | null>(null);
  const closeHandler = (returnValue: ReturnedSnippet) => {
    if (typeof onClose === 'function') {
      onClose(returnValue);
    }
  };
  const debouncedPreview = useDebouncedCallback(
    (previewSnippet: ReturnedSnippet) => {
      if (typeof onHighlight === 'function') {
        onHighlight(previewSnippet);
      }
    },
    50
  );

  const filteredSnippets = useMemo(
    () => filterSnippetsForTerm(snippets, searchTerm),
    [searchTerm, snippets]
  );

  if (
    typeof highlightedIndex === 'number' &&
    filteredSnippets[highlightedIndex]
  ) {
    const highlightedItem = document.getElementById(
      getSnippetId(filteredSnippets[highlightedIndex], highlightedIndex)
    );

    highlightedItem?.scrollIntoView({ block: 'nearest' });
  }

  useEffect(() => {
    debouncedPreview(
      typeof highlightedIndex === 'number'
        ? filteredSnippets[highlightedIndex]
        : null
    );
  }, [debouncedPreview, filteredSnippets, highlightedIndex]);

  return (
    <div className={styles.root}>
      <div className={styles.fieldContainer}>
        <SearchField
          value={searchTerm}
          onChange={(e) => {
            const { value } = e.currentTarget;
            setSearchTerm(value);
          }}
          placeholder="Find a snippet..."
          aria-label="Search snippets"
          onBlur={() => {
            setHighlightedIndex(null);
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
        />
      </div>
      <ul
        className={styles.snippetsContainer}
        ref={listEl}
        aria-label="Filtered snippets"
      >
        {filteredSnippets.map((snippet, index) => {
          const isHighlighted = highlightedIndex === index;

          return (
            <li
              ref={isHighlighted ? highlightedEl : undefined}
              id={getSnippetId(snippet, index)}
              key={`${snippet.group}_${snippet.name}_${index}`}
              className={classnames(styles.snippet, {
                [styles.highlight]: isHighlighted,
              })}
              onMouseMove={
                isOpen && !isHighlighted
                  ? () => {
                      setHighlightedIndex(index);
                    }
                  : undefined
              }
              onMouseDown={() => closeHandler(filteredSnippets[index])}
              title={getLabel(snippet)}
            >
              <Stack space="none">
                <Text size="large" weight="strong">
                  {snippet.group}
                </Text>
                <Text size="large" tone="secondary">
                  {snippet.name}
                </Text>
              </Stack>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
