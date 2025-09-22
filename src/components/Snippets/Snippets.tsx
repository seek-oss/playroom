import { Popover as BaseUIPopover } from '@base-ui-components/react';
import clsx from 'clsx';
import Fuse from 'fuse.js';
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useContext,
  type RefObject,
  type ComponentProps,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

import type { Snippet } from '../../../utils';
import snippets from '../../configModules/snippets';
import { StoreContext } from '../../contexts/StoreContext';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

import SearchField from './SearchField/SearchField';

import * as styles from './Snippets.css';

type HighlightIndex = number | null;
type ReturnedSnippet = Snippet | null;

const getLabel = (snippet: Snippet) => `${snippet.group}\n${snippet.name}`;

function getSnippetId(snippet: Snippet, index: number) {
  return `${snippet.group}_${snippet.name}_${index}`;
}

const fuse = new Fuse(snippets, {
  threshold: 0.3,
  keys: [
    { name: 'group', weight: 2 },
    { name: 'name', weight: 1 },
  ],
});

type SnippetsContentProps = {
  searchRef: RefObject<HTMLInputElement | null>;
  onSelect: (snippet: ReturnedSnippet) => void;
};

const Content = ({ searchRef, onSelect }: SnippetsContentProps) => {
  const [, dispatch] = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] =
    useState<HighlightIndex>(null);

  const listEl = useRef<HTMLUListElement | null>(null);
  const highlightedEl = useRef<HTMLLIElement | null>(null);

  const filteredSnippets = useMemo(
    () =>
      searchTerm
        ? fuse.search(searchTerm).map((result) => result.item)
        : snippets,
    [searchTerm]
  );

  const debouncedPreview = useDebouncedCallback((snippet: ReturnedSnippet) => {
    dispatch({ type: 'previewSnippet', payload: { snippet } });
  }, 50);

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
          ref={searchRef}
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
              setHighlightedIndex(0);
            } else if (event.key === 'Enter' && highlightedIndex !== null) {
              onSelect(filteredSnippets[highlightedIndex]);
            } else if (event.key === 'Escape') {
              onSelect(null);
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
              className={clsx(styles.snippet, {
                [styles.highlight]: isHighlighted,
              })}
              onMouseMove={
                !isHighlighted ? () => setHighlightedIndex(index) : undefined
              }
              onMouseDown={() => onSelect(filteredSnippets[index])}
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

type SnippetsProps = {
  trigger: ComponentProps<typeof BaseUIPopover.Trigger>['render'];
};

export const Snippets = ({ trigger }: SnippetsProps) => {
  const [{ snippetsOpen }, dispatch] = useContext(StoreContext);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const handleSelect = (snippet: ReturnedSnippet) => {
    if (snippet) {
      dispatch({ type: 'persistSnippet', payload: { snippet } });
    } else {
      dispatch({ type: 'closeSnippets' });
    }
  };

  return (
    <BaseUIPopover.Root
      open={snippetsOpen}
      onOpenChange={(open) =>
        dispatch({ type: open ? 'openSnippets' : 'closeSnippets' })
      }
    >
      <BaseUIPopover.Trigger render={trigger} />
      <BaseUIPopover.Portal>
        <BaseUIPopover.Positioner
          sideOffset={10}
          side="top"
          positionMethod="fixed"
        >
          <BaseUIPopover.Popup
            className={clsx(styles.popup, styles.popupWidth)}
            aria-label="Select a snippet"
            initialFocus={searchRef}
          >
            <Content searchRef={searchRef} onSelect={handleSelect} />
          </BaseUIPopover.Popup>
        </BaseUIPopover.Positioner>
      </BaseUIPopover.Portal>
    </BaseUIPopover.Root>
  );
};
