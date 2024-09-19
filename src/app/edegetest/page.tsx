'use client';
 
import { useState } from 'react';

import { useEdgeStore } from '@/lib/edgestore';
import Image from 'next/image';
 
export default function Page() {
  const [file, setFile] = useState<File>();
  const { edgestore } = useEdgeStore();
  const [image,setImage]= useState<string>();
 
  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files?.[0]);
        }}
      />
      <button
        onClick={async () => {
          if (file) {
            const res = await edgestore.publicFiles.upload({
              file,
              onProgressChange: (progress) => {
                // you can use this to show a progress bar
                console.log(progress);
              },
            });
            // you can run some server action or api here
            // to add the necessary data to your database
            console.log(res);
            setImage(res.url);
          }
        }}
      >
        Upload

        {image && <Image src={image} alt='' height={160} width={160}></Image>}
      </button>
    </div>
  );
}