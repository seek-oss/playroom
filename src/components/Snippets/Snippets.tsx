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
import { Tooltip } from '../Tooltip/Tooltip';

import { snippetPreviewDebounce } from './snippetsPreviewDebounce';

import * as styles from './Snippets.css';

type ReturnedSnippet = Snippet | null;

const resolveSnippetId = (snippet: Snippet, index: number) =>
  `${snippet.group}${snippet.name}${snippet.description}${index}`;

type SnippetWithId = Snippet & { id: string };
const snippetsById: Record<string, SnippetWithId> = snippets.reduce(
  (acc, snippet, index) => {
    const id = resolveSnippetId(snippet, index);

    return {
      ...acc,
      [id]: {
        ...snippet,
        id,
      },
    };
  },
  {}
);

type SnippetsContentProps = {
  searchRef: RefObject<HTMLInputElement | null>;
  onSelect: (snippet: ReturnedSnippet) => void;
};

const snippetsByGroup = Object.entries(
  snippets.reduce((acc: Record<string, SnippetWithId[]>, snippet, index) => {
    const group = snippet.group || 'Other';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push({ ...snippet, id: resolveSnippetId(snippet, index) });
    return acc;
  }, {})
);

const SnippetsGroup = ({
  group,
  children,
  enableGroups,
}: {
  group: string;
  children: React.ReactNode;
  enableGroups: boolean;
}) =>
  enableGroups ? (
    <Command.Group
      heading={
        <div className={styles.groupHeading}>
          <Text size="small" weight="strong" tone="secondary">
            {group}
          </Text>
        </div>
      }
      className={styles.group}
    >
      <div className={styles.groupItems}>{children}</div>
    </Command.Group>
  ) : (
    <>{children}</>
  );

const initialMatchedSnippet = ' ';
const Content = ({ searchRef, onSelect }: SnippetsContentProps) => {
  const [matchedSnippet, setMatchedSnippet] = useState(initialMatchedSnippet);
  const [inputValue, setInputValue] = useState('');
  const [, dispatch] = useContext(StoreContext);
  const debouncedPreview = useDebouncedCallback((snippet: ReturnedSnippet) => {
    dispatch({ type: 'previewSnippet', payload: { snippet } });
  }, snippetPreviewDebounce);

  const hasGroups = snippetsByGroup.length > 1;

  return (
    <div className={styles.root}>
      <Command
        label="Search snippets"
        loop
        value={matchedSnippet}
        onValueChange={(v) => {
          debouncedPreview(snippetsById[v]);
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
          className={clsx({
            [styles.snippetsContainer]: true,
            [styles.noGroupsVerticalPadding]: !hasGroups,
          })}
          label="Filtered snippets"
        >
          {snippetsByGroup.map(([group, groupSnippets]) => (
            <SnippetsGroup key={group} enableGroups={hasGroups} group={group}>
              {groupSnippets.map((snippet) => (
                <Command.Item
                  key={snippet.id}
                  value={snippet.id}
                  onSelect={() => onSelect(snippet)}
                  className={styles.snippet}
                >
                  <Tooltip
                    delay={true}
                    open={
                      /**
                       * Only show tooltip if likely to truncate, i.e. > 60 characters.
                       */
                      [snippet.name, snippet.description].join(' ').length < 60
                        ? false
                        : undefined
                    }
                    side="right"
                    sideOffset={16}
                    label={
                      <>
                        {snippet.name}
                        <br />
                        {snippet.description}
                      </>
                    }
                    trigger={
                      <span>
                        <Text truncate>
                          <span className={styles.name}>{snippet.name}</span>{' '}
                          <Secondary>{snippet.description}</Secondary>
                        </Text>
                      </span>
                    }
                  />
                </Command.Item>
              ))}
            </SnippetsGroup>
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
