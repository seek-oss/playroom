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

const Content = ({ searchRef, onSelect }: SnippetsContentProps) => {
  const [, dispatch] = useContext(StoreContext);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const valueToSnippetRef = useRef<Map<string, Snippet> | null>(null);

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

  const debouncedPreview = useDebouncedCallback((snippet: ReturnedSnippet) => {
    dispatch({ type: 'previewSnippet', payload: { snippet } });
  }, 50);

  // Todo - migrate to event listener
  /*
  Using a component under <Command> so it can subscribe to cmdk store via
  useCommandState
  Avoiding issues with event handlers
  */
  const SelectedPreviewEffect = () => {
    const selectedValue = useCommandState((state) => state.value);
    const previewRef = useRef(debouncedPreview);
    previewRef.current = debouncedPreview;

    useEffect(() => {
      const snippet = selectedValue
        ? valueToSnippetRef.current?.get(selectedValue) ?? null
        : null;
      previewRef.current(snippet);
    }, [selectedValue]);
    return null;
  };

  return (
    <div className={styles.root}>
      <Command>
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
        <SelectedPreviewEffect />
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
                <div className={styles.snippetRow}>
                  {snippet.group ? <Text truncate>{snippet.group}</Text> : null}
                  <Text tone={snippet.group ? 'secondary' : 'neutral'} truncate>
                    {snippet.name}
                  </Text>
                </div>
              </Command.Item>
            );
          })}
        </Command.List>
      </Command>
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
