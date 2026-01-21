import { Popover as BaseUIPopover } from '@base-ui/react/popover';
import clsx from 'clsx';
import { Command } from 'cmdk-base';
import { X } from 'lucide-react';
import {
  useState,
  useRef,
  useContext,
  type RefObject,
  type ComponentProps,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

import type { Snippet } from '../../../utils';
import snippets from '../../configModules/snippets';
import { StoreContext } from '../../contexts/StoreContext';
import { ButtonIcon } from '../ButtonIcon/ButtonIcon';
import { Secondary } from '../Secondary/Secondary';
import { Text } from '../Text/Text';

import { snippetPreviewDebounce } from './snippetsPreviewDebounce';

import * as styles from './Snippets.css';

type ReturnedSnippet = Snippet | null;

const getLabel = (snippet: Snippet) => `${snippet.group}\n${snippet.name}`;

const getValue = (snippet: Snippet) =>
  `${snippet.group ? `${snippet.group} ` : ''}${snippet.name}`;

const snippetsByValue: Record<string, Snippet> = snippets.reduce(
  (acc, snippet) => ({
    ...acc,
    [getValue(snippet)]: snippet,
  }),
  {}
);

type SnippetsContentProps = {
  searchRef: RefObject<HTMLInputElement | null>;
  onSelect: (snippet: ReturnedSnippet) => void;
};

const initialMatchedSnippet = ' ';
const Content = ({ searchRef, onSelect }: SnippetsContentProps) => {
  const [matchedSnippet, setMatchedSnippet] = useState(initialMatchedSnippet);
  const [inputValue, setInputValue] = useState('');
  const [, dispatch] = useContext(StoreContext);
  const debouncedPreview = useDebouncedCallback((snippet: ReturnedSnippet) => {
    dispatch({ type: 'previewSnippet', payload: { snippet } });
  }, snippetPreviewDebounce);

  return (
    <div className={styles.root}>
      <Command
        label="Search snippets"
        loop
        value={matchedSnippet}
        onValueChange={(v) => {
          debouncedPreview(snippetsByValue[v]);
          setMatchedSnippet(v);
        }}
      >
        <div className={styles.fieldContainer}>
          <Command.Input
            ref={searchRef}
            value={inputValue}
            onValueChange={(v) => {
              setInputValue(v);
              if (v.trim().length === 0) {
                setMatchedSnippet(initialMatchedSnippet);
              }
            }}
            placeholder="Find a snippet..."
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onSelect(null);
              }
            }}
            className={styles.searchField}
          />
          {inputValue.trim().length > 0 ? (
            <ButtonIcon
              onClick={() => {
                setMatchedSnippet(initialMatchedSnippet);
                setInputValue('');
                searchRef.current?.focus();
              }}
              variant="transparent"
              size="small"
              label="Clear search"
              icon={<X />}
            />
          ) : null}
        </div>
        <Command.List
          className={styles.snippetsContainer}
          label="Filtered snippets"
        >
          {snippets.map((snippet, index) => (
            <Command.Item
              key={`${snippet.group}_${snippet.name}_${index}`}
              value={getValue(snippet)}
              onSelect={() => onSelect(snippet)}
              title={getLabel(snippet)}
              className={styles.snippet}
            >
              <Text truncate>
                {snippet.group ? (
                  <>
                    <span className={styles.groupName}>{snippet.group}</span>{' '}
                    <Secondary>{snippet.name}</Secondary>
                  </>
                ) : (
                  snippet.name
                )}
              </Text>
            </Command.Item>
          ))}
        </Command.List>
      </Command>
    </div>
  );
};

type SnippetsProps = {
  trigger: ComponentProps<typeof BaseUIPopover.Trigger>['render'];
  sideOffset?: ComponentProps<typeof BaseUIPopover.Positioner>['sideOffset'];
};

export const Snippets = ({ trigger, sideOffset }: SnippetsProps) => {
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
          align="start"
          alignOffset={-12}
          sideOffset={sideOffset}
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
