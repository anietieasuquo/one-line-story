import { StorySentence } from '../../../shared/core';
import './Sentence.css';

const Sentence = ({ content, username, self }: StorySentence) => (
    <div className={'sentence' + (self ? ' sentence-self' : '')}>
        <div className="sentence-username">{username}</div>
        <div className="sentence-content">{content}</div>
    </div>
);

export { Sentence };
