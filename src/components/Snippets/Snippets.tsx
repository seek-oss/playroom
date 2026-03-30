import { Popover as BaseUIPopover } from '@base-ui/react/popover';
import clsx from 'clsx';
import { Command } from 'cmdk-base';
import { X } from 'lucide-react';
import {
  useMemo,
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

const SnippetItem = ({
  snippet,
  onSelect,
}: {
  snippet: SnippetWithId;
  onSelect: (snippet: SnippetWithId) => void;
}) => (
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
         * Only show tooltip if likely to truncate, i.e. > 50 characters.
         */
        [snippet.name, snippet.description].join(' ').length < 50
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
        <span className={styles.tooltipTrigger}>
          <Text truncate>
            <span className={styles.name}>{snippet.name}</span>{' '}
            <Secondary>{snippet.description}</Secondary>
          </Text>
        </span>
      }
    />
  </Command.Item>
);

const resolveScore = (
  item: string,
  search: string,
  modifier: number = 0
): number => {
  const lowerItem = item.toLowerCase();

  if (lowerItem === search) {
    // Is exact match
    return 1 + modifier;
  } else if (
    lowerItem.split(/\s+/).some((word) => word === search) ||
    /*
     * Compare to unmodified item, allowing PascalCase to be treated as separate words.
     * Regex also handles uppercase acronyms, e.g., 'MyHTMLComponent' => ['My', 'HTML', 'Component']
     */
    item
      .split(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/)
      .some((word) => word.toLowerCase() === search)
  ) {
    // Contains word that is exact match
    return 0.95 + modifier;
  } else if (lowerItem.startsWith(search)) {
    // Starts with match
    return 0.9 + modifier;
  } else if (lowerItem.split(/\s+/).some((word) => word.startsWith(search))) {
    // Contains word that starts with match
    return 0.85 + modifier;
  } else if (lowerItem.includes(search)) {
    // Contains search character sequence
    return 0.75 + modifier;
  }

  return 0;
};

const scoreSnippet = (snippet: SnippetWithId, search: string): number => {
  const name = snippet.name;
  const description = snippet.description;
  const searchTerm = search.toLowerCase().trim();

  if (!searchTerm) {
    return 1;
  }

  const scoreForName = resolveScore(name, searchTerm);
  if (scoreForName > 0) {
    return scoreForName;
  }

  if (description) {
    const scoreForDescription = resolveScore(description, searchTerm, -0.04);
    if (scoreForDescription > 0) {
      return scoreForDescription;
    }
  }

  // Loose subsequence: every character of search must appear in order in value
  let position = 0;
  for (const char of searchTerm) {
    const idx = `${name}${description ? ` ${description}` : ''}`
      .toLowerCase()
      .indexOf(char, position);
    if (idx === -1) {
      return 0;
    }
    position = idx + 1;
  }
  return 0.3;
};

const allSnippets: SnippetWithId[] = snippetsByGroup.flatMap(
  ([, items]) => items
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
  const filteredSnippets = useMemo(() => {
    const s = inputValue.trim();
    if (!s) return null;
    return allSnippets
      .map((snippet) => ({ snippet, score: scoreSnippet(snippet, s) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ snippet }) => snippet);
  }, [inputValue]);
  const isFiltering = filteredSnippets !== null;

  return (
    <div className={styles.root}>
      <Command
        label="Search snippets"
        loop
        shouldFilter={false}
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
            [styles.noGroupsVerticalPadding]: !hasGroups || isFiltering,
            [styles.groupHeaderScrollPadding]: hasGroups,
          })}
          label="Filtered snippets"
        >
          <Command.Empty className={styles.empty}>
            <Text tone="secondary">No snippets matching “{inputValue}”</Text>
          </Command.Empty>

          {isFiltering
            ? filteredSnippets.map((snippet) => (
                <SnippetItem
                  key={snippet.id}
                  snippet={snippet}
                  onSelect={onSelect}
                />
              ))
            : snippetsByGroup.map(([group, groupSnippets]) => (
                <SnippetsGroup
                  key={group}
                  enableGroups={hasGroups}
                  group={group}
                >
                  {groupSnippets.map((snippet) => (
                    <SnippetItem
                      key={snippet.id}
                      snippet={snippet}
                      onSelect={onSelect}
                    />
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
