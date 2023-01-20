/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  AutoEmbedOption,
  EmbedConfig,
  EmbedMatchResult,
  LexicalAutoEmbedPlugin,
  URL_MATCHER,
} from '@lexical/react/LexicalAutoEmbedPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {useMemo, useState} from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Button from 'payload/dist/admin/components/elements/Button';
import { DialogActions } from '../../ui/Dialog';
import {EditorConfig} from "../../../../types";
import { OPEN_MODAL_COMMAND } from '../ModalPlugin';
import { Drawer, formatDrawerSlug } from 'payload/dist/admin/components/elements/Drawer';
import { useEditDepth } from 'payload/components/utilities';
import { useModal } from '@faceless-ui/modal';
import { Gutter } from 'payload/dist/admin/components/elements/Gutter';
import X from 'payload/dist/admin/components/icons/X';
import './modal.scss';

export interface PlaygroundEmbedConfig extends EmbedConfig {
  // Human readable name of the embeded content e.g. Tweet or Google Map.
  contentName: string;

  // Icon for display.
  icon?: JSX.Element;

  // An example of a matching url https://twitter.com/jack/status/20
  exampleUrl: string;

  // For extra searching.
  keywords: Array<string>;

  // Embed a Figma Project.
  description?: string;
}

export function getEmbedConfigs(editorConfig: EditorConfig) {
  const embedConfigs = [];

  for(const feature of editorConfig.features){
    if(feature.embedConfigs && feature.embedConfigs.length > 0){
      embedConfigs.push(...feature.embedConfigs);
    }
  }

  return embedConfigs;
}



function AutoEmbedMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: AutoEmbedOption;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={`typeahead-item-${index}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="text">{option.title}</span>
    </li>
  );
}

function AutoEmbedMenu({
  options,
  selectedItemIndex,
  onOptionClick,
  onOptionMouseEnter,
}: {
  selectedItemIndex: number | null;
  onOptionClick: (option: AutoEmbedOption, index: number) => void;
  onOptionMouseEnter: (index: number) => void;
  options: Array<AutoEmbedOption>;
}) {
  return (
    <div className="typeahead-popover">
      <ul>
        {options.map((option: AutoEmbedOption, i: number) => (
          <AutoEmbedMenuItem
            index={i}
            isSelected={selectedItemIndex === i}
            onClick={() => onOptionClick(option, i)}
            onMouseEnter={() => onOptionMouseEnter(i)}
            key={option.key}
            option={option}
          />
        ))}
      </ul>
    </div>
  );
}
const debounce = (callback: (text: string) => void, delay: number) => {
  let timeoutId: number;
  return (text: string) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(text);
    }, delay);
  };
};


const baseClass = "rich-text-autoembed";
export function AutoEmbedDrawer({
  embedConfig,
}: {
  embedConfig: PlaygroundEmbedConfig;
}): JSX.Element {
  const [text, setText] = useState('');
  const [editor] = useLexicalComposerContext();

  const [embedResult, setEmbedResult] = useState<EmbedMatchResult | null>(null);

  const validateText = useMemo(
    () =>
      debounce((inputText: string) => {
        const urlMatch = URL_MATCHER.exec(inputText);
        if (embedConfig != null && inputText != null && urlMatch != null) {
          Promise.resolve(embedConfig.parseUrl(inputText)).then(
            (parseResult) => {
              setEmbedResult(parseResult);
            },
          );
        } else if (embedResult != null) {
          setEmbedResult(null);
        }
      }, 200),
    [embedConfig, embedResult],
  );

  const onClick = () => {
    if (embedResult != null) {
      embedConfig.insertNode(editor, embedResult);
      toggleModal(autoEmbedDrawerSlug);
    }
  };
  const editDepth = useEditDepth();

  const autoEmbedDrawerSlug = formatDrawerSlug({
    slug: `lexicalRichText-autoembed-${embedConfig.type}`,
    depth: editDepth,
  });

  const {
    toggleModal,
  } = useModal();
  
  return (
    <Drawer slug={autoEmbedDrawerSlug} key={autoEmbedDrawerSlug} formatSlug={false} className={baseClass}>
      <Gutter className={`${baseClass}__template`}>
        <header className={`${baseClass}__header`}>
          <h2 className={`${baseClass}__header-text`}>Add Embed</h2>
          <Button
            className={`${baseClass}__header-close`}
            buttonStyle="none"
            onClick={() => {
              toggleModal(autoEmbedDrawerSlug);
            }}
          >
            <X />
          </Button>
        </header>
        

        <div className="Input__wrapper">
        <input
          type="text"
          className="Input__input"
          placeholder={embedConfig.exampleUrl}
          value={text}
          data-test-id={`${embedConfig.type}-embed-modal-url`}
          onChange={(e) => {
            setText(e.target.value);
            const {value} = e.target;
            setText(value);
            validateText(value);
          }}
        />
      </div>
      <DialogActions>
        <Button
          disabled={!embedResult}
          onClick={onClick}
          data-test-id={`${embedConfig.type}-embed-modal-submit-btn`}
        >
          Embed
        </Button>
      </DialogActions>


      </Gutter>
    </Drawer>
  );
}

export default function AutoEmbedPlugin(props: {editorConfig: EditorConfig}): JSX.Element {
  const editorConfig = props.editorConfig;

  const [editor] = useLexicalComposerContext();

  const openEmbedModal = (embedConfig: PlaygroundEmbedConfig) => {
    editor.dispatchCommand(OPEN_MODAL_COMMAND, "autoembed-"+embedConfig.type);
  };

  const getMenuOptions = (
    activeEmbedConfig: PlaygroundEmbedConfig,
    embedFn: () => void,
    dismissFn: () => void,
  ) => {
    return [
      new AutoEmbedOption('Dismiss', {
        onSelect: dismissFn,
      }),
      new AutoEmbedOption(`Embed ${activeEmbedConfig.contentName}`, {
        onSelect: embedFn,
      }),
    ];
  };

  return (
    <React.Fragment>
      <LexicalAutoEmbedPlugin<PlaygroundEmbedConfig>
        embedConfigs={getEmbedConfigs(editorConfig)}
        onOpenEmbedModalForConfig={openEmbedModal}
        getMenuOptions={getMenuOptions}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, options, selectOptionAndCleanUp, setHighlightedIndex },
        ) => (anchorElementRef.current
          ? ReactDOM.createPortal(
            <div
              className="typeahead-popover auto-embed-menu"
              style={{
                marginLeft: anchorElementRef.current.style.width,
                width: 200,
              }}
            >
              <AutoEmbedMenu
                options={options}
                selectedItemIndex={selectedIndex}
                onOptionClick={(option: AutoEmbedOption, index: number) => {
                  setHighlightedIndex(index);
                  selectOptionAndCleanUp(option);
                }}
                onOptionMouseEnter={(index: number) => {
                  setHighlightedIndex(index);
                }}
              />
            </div>,
            anchorElementRef.current,
          )
          : null)}
      />
    </React.Fragment>
  );
}
