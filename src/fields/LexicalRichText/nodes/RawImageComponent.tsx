import * as React from "react";
import { LexicalEditor, NodeKey } from "lexical";
import { Suspense, useEffect, useState } from "react";

import { ExtraAttributes, RawImagePayload } from "./ImageNode";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import { useTranslation } from "react-i18next";
import { requests } from "payload/dist/admin/api";

const ImageComponent = React.lazy(() => import("./ImageComponent"));

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
  console.log("rawImagePayload1", rawImagePayload);
  const {
    collections,
    serverURL,
    routes: { api },
  } = useConfig();
  console.log("raw Image 1...");

  const { i18n } = useTranslation();
  console.log("raw Image 2...");

  const [imageData, setImageData] = useState<any>(null);
  console.log("raw Image 3...");

  useEffect(() => {
    console.log("UseEffect");

    async function loadImageData() {
      console.log("loadImageData", rawImagePayload);

      const relatedCollection = collections.find((coll) => {
        console.log(
          "coll.slug",
          coll.slug,
          "insertImagePayload.relationTo",
          rawImagePayload.relationTo
        );
        return coll.slug === rawImagePayload.relationTo;
      });

      console.log("relatedCollection", relatedCollection);

      const response = await requests.get(
        `${serverURL}${api}/${relatedCollection?.slug}/${rawImagePayload.value?.id}`,
        {
          headers: {
            "Accept-Language": i18n.language,
          },
        }
      );
      const json = await response.json();
      console.log("JSON", json);

      const imagePayload = {
        altText: json?.text,
        height:
          extraAttributes && extraAttributes.heightOverride
            ? extraAttributes.heightOverride
            : json?.height,
        maxWidth:
          extraAttributes && extraAttributes.widthOverride
            ? extraAttributes.widthOverride
            : json?.width,
        src: json?.url,
      };

      setImageData(imagePayload);
      console.log("image payload", imagePayload);

      console.log("relatedCollection", relatedCollection);
    }

    loadImageData();
  }, []);

  console.log("Caption", caption);

  return (
    <Suspense fallback={<p>Loading image...</p>}>
      {imageData ? (
        <ImageComponent
          src={imageData.src}
          altText={imageData.altText}
          width={undefined}
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
