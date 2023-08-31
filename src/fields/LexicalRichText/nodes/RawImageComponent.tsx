import * as React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { requests } from 'payload/dist/admin/api';
import { useConfig } from 'payload/dist/admin/components/utilities/Config/index';

import { type LexicalEditor, type NodeKey } from 'lexical';

import { type ExtraAttributes, type RawImagePayload } from './ImageNode';

const ImageComponent = React.lazy(async () => await import('./ImageComponent'));

export default function RawImageComponent({
  rawImagePayload,
  nodeKey,
  extraAttributes,
  showCaption,
  caption,
  captionsEnabled,
}: {
  rawImagePayload: RawImagePayload;
  nodeKey: NodeKey;
  extraAttributes: ExtraAttributes;
  showCaption: boolean;
  caption: LexicalEditor;
  captionsEnabled: boolean;
}): JSX.Element {
  const {
    collections,
    serverURL,
    routes: { api },
  } = useConfig();

  const { i18n } = useTranslation();

  const [imageData, setImageData] = useState<any>(null);

  useEffect(() => {
    async function loadImageData(): Promise<void> {
      const relatedCollection = collections.find((coll) => {
        return coll.slug === rawImagePayload.relationTo;
      });

      const response = await requests.get(
        `${serverURL}${api}/${relatedCollection?.slug}/${rawImagePayload.value?.id}`,
        {
          headers: {
            'Accept-Language': i18n.language,
          },
        }
      );
      const json = await response.json();

      const imagePayload = {
        altText: json?.text,
        height:
          extraAttributes?.heightOverride != null ? extraAttributes.heightOverride : json?.height,
        maxWidth:
          extraAttributes?.widthOverride != null ? extraAttributes.widthOverride : json?.width,
        src: json?.url,
      };

      setImageData(imagePayload);
    }

    void loadImageData();
  }, []);

  return (
    <Suspense fallback={<p>Loading image...</p>}>
      {imageData != null ? (
        <ImageComponent
          src={imageData.src}
          altText={imageData.altText}
          // TODO: eslint typescript - not sure what this does? was set to undefined
          width="inherit"
          height={imageData.height}
          maxWidth={imageData.maxWidth}
          nodeKey={nodeKey}
          showCaption={showCaption}
          caption={caption}
          captionsEnabled={captionsEnabled}
          resizable
        />
      ) : (
        <p>Loading image...</p>
      )}
    </Suspense>
  );
}
