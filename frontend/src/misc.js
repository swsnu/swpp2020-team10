import React, { useEffect, useState } from 'react';
import { Image as SUImage, Placeholder } from 'semantic-ui-react';


export const getFormattedDate = () => {
  const dateObject = new Date();
  const year = dateObject.getFullYear();
  const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
  const date = ('0' + dateObject.getDate()).slice(-2);

  return `${year}-${month}-${date}`;
};


export const validateImageUrl = (imageUrl) => {
  return new Promise((resolve, reject) => {
    // blank url indicates image omission
    if (!imageUrl) {
      resolve();
    }

    // construct HTMLImageElement for test
    const testImage = new Image();

    // install callbacks
    testImage.onload = resolve;
    testImage.onerror = reject;

    // try loading image
    testImage.src = imageUrl;
  });
};


export const ImageWrapper = ({ src, length }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    validateImageUrl(src)
      .then(() => setLoaded(true));
  }, []);

  if (!src) {
    return null;
  }

  if (!loaded) {
    return (
      <Placeholder>
        <Placeholder.Image
          square={!length}
          rectangular={Boolean(length)}
          style={length && { width: length, height: length }}
        />
      </Placeholder>
    );
  }

  return (
    <SUImage src={src} />
  );
};