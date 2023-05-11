export function getPreferredSize(
  preferred: string,
  doc: Record<string, unknown>
): {
  width?: number;
  height?: number;
  mimeType: string;
  filesize: number;
  filename: string;
  url: string;
} | null {
  if (doc.mimeType === 'image/svg+xml' && doc.url != null) {
    return {
      mimeType: doc.mimeType as string,
      filesize: doc.filesize as number,
      filename: doc.filename as string,
      url: doc.url as string,
    };
  } else if (doc.sizes?.[preferred] != null) {
    return doc.sizes[preferred];
  } else if (doc.url != null) {
    return {
      width: doc.with as number,
      height: doc.height as number,
      mimeType: doc.mimeType as string,
      filesize: doc.filesize as number,
      filename: doc.filename as string,
      url: doc.url as string,
    };
  } else {
    return null;
  }
}
