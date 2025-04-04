'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Photo } from '@/lib/interfaces/photo';
import { StarButton } from './star-button';
import { Profile } from '@/lib/interfaces/activity';
import { UseMutationResult } from '@tanstack/react-query';
import { DeleteButton } from './delete-button';

interface MasonryImageListProps {
  photos: Photo[];
  isCurrentUser: boolean;
  profile?: Profile;
  setMainPhoto: UseMutationResult<Photo, Error, Photo, unknown>;
  deletePhoto: UseMutationResult<void, Error, string, unknown>;
  gap?: number;
  className?: string;
}

export function MasonryImageList({
  photos,
  isCurrentUser,
  profile,
  setMainPhoto,
  gap = 4,
  className,
  deletePhoto,
}: MasonryImageListProps) {
  const [columns, setColumns] = useState(3);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [imageDimensions, setImageDimensions] = useState<
    Record<string, { width: number; height: number }>
  >({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Initialize loading state for all images
  useEffect(() => {
    const initialLoadingState: Record<string, boolean> = {};
    photos.forEach((photo) => {
      initialLoadingState[photo.id] = true;
    });
    setLoading(initialLoadingState);
  }, [photos]);

  // Preload images to get their dimensions
  useEffect(() => {
    let mounted = true;
    const dimensions: Record<string, { width: number; height: number }> = {};
    let loadedCount = 0;

    photos.forEach((photo) => {
      const img = new Image();
      img.src = photo.url;

      img.onload = () => {
        if (!mounted) return;

        dimensions[photo.id] = {
          width: img.naturalWidth,
          height: img.naturalHeight,
        };

        setLoading((prev) => ({ ...prev, [photo.id]: false }));
        loadedCount++;

        if (loadedCount === photos.length) {
          setImageDimensions(dimensions);
          setImagesLoaded(true);
        }
      };

      img.onerror = () => {
        if (!mounted) return;

        // Set default dimensions for failed images
        dimensions[photo.id] = { width: 300, height: 300 };
        setLoading((prev) => ({ ...prev, [photo.id]: false }));
        loadedCount++;

        if (loadedCount === photos.length) {
          setImageDimensions(dimensions);
          setImagesLoaded(true);
        }
      };
    });

    return () => {
      mounted = false;
    };
  }, [photos]);

  // Determine number of columns based on container width
  useEffect(() => {
    const updateColumns = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.offsetWidth;

      if (width < 640) {
        setColumns(1);
      } else if (width < 768) {
        setColumns(2);
      } else if (width < 1024) {
        setColumns(3);
      } else {
        setColumns(4);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);

    return () => {
      window.removeEventListener('resize', updateColumns);
    };
  }, []);

  // Distribute images into columns
  const getColumnImages = () => {
    if (!imagesLoaded) {
      // Distribute evenly before we know dimensions
      const columnPhotos: Photo[][] = Array.from({ length: columns }, () => []);
      photos.forEach((photo, index) => {
        const columnIndex = index % columns;
        columnPhotos[columnIndex].push(photo);
      });
      return columnPhotos;
    }

    const columnPhotos: Photo[][] = Array.from({ length: columns }, () => []);

    // Sort photos by height (tallest first) for better distribution
    const sortedPhotos = [...photos].sort((a, b) => {
      const aDimensions = imageDimensions[a.id] || { width: 300, height: 300 };
      const bDimensions = imageDimensions[b.id] || { width: 300, height: 300 };
      return (
        bDimensions.height / bDimensions.width -
        aDimensions.height / aDimensions.width
      );
    });

    // Distribute photos to columns (shortest column first)
    sortedPhotos.forEach((photo) => {
      // Find the column with the least height
      const columnHeights = columnPhotos.map((column) =>
        column.reduce((height, p) => {
          const dims = imageDimensions[p.id] || { width: 300, height: 300 };
          return height + dims.height / dims.width;
        }, 0)
      );

      const shortestColumnIndex = columnHeights.indexOf(
        Math.min(...columnHeights)
      );
      columnPhotos[shortestColumnIndex].push(photo);
    });

    return columnPhotos;
  };

  const columnPhotos = getColumnImages();

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <div
        className='grid'
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: `${gap * 0.25}rem`,
        }}
      >
        {columnPhotos.map((column, columnIndex) => (
          <div key={columnIndex} className='flex flex-col gap-4'>
            {column.map((photo) => {
              const dimensions = imageDimensions[photo.id] || {
                width: 300,
                height: 300,
              };
              const aspectRatio = dimensions.width / dimensions.height;

              return (
                <div
                  key={photo.id}
                  className='relative overflow-hidden rounded-md group mb-4'
                  style={{
                    aspectRatio: aspectRatio,
                    width: '100%',
                  }}
                >
                  {loading[photo.id] && (
                    <Skeleton className='absolute inset-0' />
                  )}
                  <img
                    src={photo.url || '/placeholder.svg'}
                    alt={`Photo ${photo.id}`}
                    width={dimensions.width}
                    height={dimensions.height}
                    className={cn(
                      'w-full h-full object-cover transition-all duration-300 group-hover:scale-105',
                      loading[photo.id] ? 'opacity-0' : 'opacity-100'
                    )}
                    loading='lazy'
                  />
                  {isCurrentUser && (
                    <>
                      <div className='absolute top-2 left-2 z-10'>
                        <StarButton
                          onClick={() => setMainPhoto.mutate(photo)}
                          isSelected={photo.url === profile?.imageUrl}
                        />
                      </div>
                      {profile?.imageUrl !== photo.url && (
                        <div className='absolute top-2 right-2 z-10'>
                          <DeleteButton
                            onClick={() => deletePhoto.mutate(photo.id)}
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4'>
                    <p className='text-white text-sm font-medium truncate'>
                      Photo {photo.id}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { cn } from '@/lib/utils';
// import { Skeleton } from '@/components/ui/skeleton';

// interface MasonryImageListProps {
//   images: {
//     id: string;
//     url: string;
//     alt?: string;
//     width?: number;
//     height?: number;
//   }[];
//   gap?: number;
//   className?: string;
// }

// export function MasonryImageList({
//   images,
//   gap = 4,
//   className,
// }: MasonryImageListProps) {
//   const [columns, setColumns] = useState(3);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState<Record<string, boolean>>({});

//   // Initialize loading state for all images
//   useEffect(() => {
//     const initialLoadingState: Record<string, boolean> = {};
//     images.forEach((image) => {
//       initialLoadingState[image.id] = true;
//     });
//     setLoading(initialLoadingState);
//   }, [images]);

//   // Handle image load
//   const handleImageLoad = (id: string) => {
//     setLoading((prev) => ({ ...prev, [id]: false }));
//   };

//   // Determine number of columns based on container width
//   useEffect(() => {
//     const updateColumns = () => {
//       if (!containerRef.current) return;

//       const width = containerRef.current.offsetWidth;

//       if (width < 640) {
//         setColumns(1);
//       } else if (width < 768) {
//         setColumns(2);
//       } else if (width < 1024) {
//         setColumns(3);
//       } else {
//         setColumns(4);
//       }
//     };

//     updateColumns();
//     window.addEventListener('resize', updateColumns);

//     return () => {
//       window.removeEventListener('resize', updateColumns);
//     };
//   }, []);

//   // Distribute images into columns
//   const getColumnImages = () => {
//     const columnImages: (typeof images)[] = Array.from(
//       { length: columns },
//       () => []
//     );

//     // Sort images by height (tallest first) for better distribution
//     const sortedImages = [...images].sort(
//       (a, b) =>
//         (b.height || 30) / (b.width || 30) - (a.height || 30) / (a.width || 30)
//     );

//     // Distribute images to columns (shortest column first)
//     sortedImages.forEach((image) => {
//       // Find the column with the least height
//       const columnHeights = columnImages.map((column) =>
//         column.reduce(
//           (height, img) => height + (img.height || 30) / (img.width || 30),
//           0
//         )
//       );
//       const shortestColumnIndex = columnHeights.indexOf(
//         Math.min(...columnHeights)
//       );

//       columnImages[shortestColumnIndex].push(image);
//     });

//     return columnImages;
//   };

//   const columnImages = getColumnImages();

//   return (
//     <div ref={containerRef} className={cn('w-full', className)}>
//       <div
//         className='grid'
//         style={{
//           gridTemplateColumns: `repeat(${columns}, 1fr)`,
//           gap: `${gap * 0.25}rem`,
//         }}
//       >
//         {columnImages.map((column, columnIndex) => (
//           <div key={columnIndex} className='flex flex-col gap-4'>
//             {column.map((image) => (
//               <div
//                 key={image.id}
//                 className='relative overflow-hidden rounded-md group mb-4'
//                 style={{
//                   aspectRatio: `${image.width} / ${image.height}`,
//                   width: '100%',
//                 }}
//               >
//                 {loading[image.id] && <Skeleton className='absolute inset-0' />}
//                 <img
//                   //   src={
//                   //     image.url.replace(
//                   //       '/upload/',
//                   //       '/upload/w_164,h_164,c_crop,f_auto,dpr_2,g_face/'
//                   //     ) || '/placeholder.svg'
//                   //   }
//                   src={image.url || '/placeholder.svg'}
//                   alt={image.alt}
//                   width={image.width || 30}
//                   height={image.height || 30}
//                   className={cn(
//                     'w-full h-full object-cover transition-all duration-300 group-hover:scale-105',
//                     loading[image.id] ? 'opacity-0' : 'opacity-100'
//                   )}
//                   onLoad={() => handleImageLoad(image.id)}
//                   loading='lazy'
//                 />
//                 <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4'>
//                   <p className='text-white text-sm font-medium truncate'>
//                     {image.alt || image.id || 'Image user'}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
