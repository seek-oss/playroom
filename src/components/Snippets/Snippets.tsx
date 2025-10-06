import { Popover as BaseUIPopover } from '@base-ui-components/react';
import clsx from 'clsx';
import { Command, useCommandState } from 'cmdk-base';
import { X } from 'lucide-react';
import {
  useState,
  useRef,
  useEffect,
  useContext,
  type RefObject,
  type ComponentProps,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

import type { Snippet } from '../../../utils';
import snippets from '../../configModules/snippets';
import { StoreContext } from '../../contexts/StoreContext';
import { Secondary } from '../Secondary/Secondary';
import { Text } from '../Text/Text';

import * as styles from './Snippets.css';

type ReturnedSnippet = Snippet | null;

const getLabel = (snippet: Snippet) => `${snippet.group}\n${snippet.name}`;

function getSnippetId(snippet: Snippet, index: number) {
  return `${snippet.group}_${snippet.name}_${index}`;
}

type SnippetsContentProps = {
  searchRef: RefObject<HTMLInputElement | null>;
  onSelect: (snippet: ReturnedSnippet) => void;
};

// Todo - migrate to event listener
/*
Using a Hook under <Command> so it can subscribe to cmdk store via
useCommandState avoiding issues with event handlers
*/
const useDebouncedPreview = () => {
  const [, dispatch] = useContext(StoreContext);
  const selectedValue = useCommandState((state) => state.value);
  const valueToSnippetRef = useRef<Map<string, Snippet> | null>(null);
  const debouncedPreview = useDebouncedCallback((snippet: ReturnedSnippet) => {
    dispatch({ type: 'previewSnippet', payload: { snippet } });
  }, 50);

  if (!valueToSnippetRef.current) {
    const map = new Map<string, Snippet>();

    for (const snippet of snippets) {
      const value = `${snippet.group ? `${snippet.group} ` : ''}${
        snippet.name
      }`;

      map.set(value, snippet);
    }
    valueToSnippetRef.current = map;
  }

  useEffect(() => {
    const snippet = selectedValue
      ? valueToSnippetRef.current?.get(selectedValue) ?? null
      : null;
    debouncedPreview(snippet);
  }, [selectedValue, debouncedPreview]);

  return debouncedPreview;
};

const Content = ({ searchRef, onSelect }: SnippetsContentProps) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedPreview = useDebouncedPreview();

  return (
    <div className={styles.root}>
      <div className={styles.fieldContainer}>
        <Command.Input
          ref={searchRef}
          placeholder="Find a snippet..."
          aria-label="Search snippets"
          value={searchTerm}
          onValueChange={setSearchTerm}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              onSelect(null);
            }
          }}
          className={styles.searchField}
        />
        {searchTerm ? (
          <button
            type="button"
            aria-label="Clear search"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => setSearchTerm('')}
            className={styles.clearButton}
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      <Command.List
        className={styles.snippetsContainer}
        aria-label="Filtered snippets"
      >
        {snippets.map((snippet, index) => {
          const value = `${snippet.group ? `${snippet.group} ` : ''}${
            snippet.name
          }`;
          return (
            <Command.Item
              id={getSnippetId(snippet, index)}
              key={`${snippet.group}_${snippet.name}_${index}`}
              value={value}
              onSelect={() => onSelect(snippet)}
              onMouseMove={() => debouncedPreview(snippet)}
              onFocus={() => debouncedPreview(snippet)}
              title={getLabel(snippet)}
              className={clsx(styles.snippet)}
            >
              <Text truncate>
                {snippet.group ? (
                  <>
                    <span className={styles.groupName}>{snippet.group}</span>
                    <Secondary>{snippet.name}</Secondary>
                  </>
                ) : (
                  snippet.name
                )}
              </Text>
            </Command.Item>
          );
        })}
      </Command.List>
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
      modal
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
            <Command>
              <Content searchRef={searchRef} onSelect={handleSelect} />
            </Command>
          </BaseUIPopover.Popup>
        </BaseUIPopover.Positioner>
      </BaseUIPopover.Portal>
    </BaseUIPopover.Root>
  );
};
