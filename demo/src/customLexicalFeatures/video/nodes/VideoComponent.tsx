/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState, useRef } from 'react';
import VideoIcon from './icon';

import './VideoNode.scss';
import { VideoAttributes } from './VideoNode';

const baseClass = 'rich-text-video';

type Source = 'youtube' | 'vimeo';

const sourceLabels: Record<Source, string> = {
  youtube: 'YouTube',
  vimeo: 'Vimeo',
};

const Element = ({ attributes }: { attributes: VideoAttributes }) => {
  const { source, id } = attributes;

  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState(false);

  const divRef = useRef(null);

  // A function to handle clicks outside the div
  const handleOutsideClick = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setSelected(false);
    }
  };

  // Add and remove event listeners to handle clicks outside the div
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (source !== 'youtube') {
        setTitle(`${sourceLabels[source]} Video: ${id}`);
        return;
      }
      const data = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`
      );
      const json = await data.json();
      setTitle(json.title);
    };
    fetchData();
  }, [id, title]);

  return (
    <div
      className={[baseClass, selected && `${baseClass}--selected`].filter(Boolean).join(' ')}
      contentEditable={false}
      onClick={() => setSelected(true)}
      ref={divRef}
    >
      {source === 'youtube' && (
        <img src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} style={{ maxWidth: '100%' }} />
      )}
      <div className={`${baseClass}__wrap`}>
        <div className={`${baseClass}__label`}>
          <VideoIcon />
          <div className={`${baseClass}__title`}>{title}</div>
        </div>
      </div>
    </div>
  );
};

export default Element;
