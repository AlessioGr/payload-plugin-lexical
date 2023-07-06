import './EquationEditor.scss';
import * as React from 'react';
type BaseEquationEditorProps = {
    equation: string;
    inline: boolean;
    setEquation: (equation: string) => void;
};
declare const _default: React.ForwardRefExoticComponent<BaseEquationEditorProps & React.RefAttributes<HTMLInputElement | HTMLTextAreaElement>>;
export default _default;
