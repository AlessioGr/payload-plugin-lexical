import { EditorConfig, Feature } from '../../../types';
import SpeechToTextPlugin, { isSUPPORT_SPEECH_RECOGNITION, SPEECH_TO_TEXT_COMMAND } from './plugins';
import * as React from "react";
import { useState } from "react";
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function SpeechToTextAction(): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const [isSpeechToText, setIsSpeechToText] = useState(false);

    return (
        <>
            {isSUPPORT_SPEECH_RECOGNITION() && (
                <button
                    onClick={(event) => {
                        event.preventDefault();
                        editor.dispatchCommand(SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
                        setIsSpeechToText(!isSpeechToText);
                    }}
                    className={
                        `action-button action-button-mic ${isSpeechToText ? 'active' : ''}`
                    }
                    title="Speech To Text"
                    aria-label={`${isSpeechToText ? 'Enable' : 'Disable'
                        } speech to text`}
                >
                    <i className="mic" />
                </button>
            )}
        </>
    );
};

export function SpeechToTextFeature(props: {}): Feature {
    return {
        plugins: [
            {
                component: (<SpeechToTextPlugin key="speechtotext" />),
            }
        ],
        actions: [<SpeechToTextAction key="speechtotext"  />],

    }
}