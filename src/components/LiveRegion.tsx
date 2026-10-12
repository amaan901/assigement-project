import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
  isLoading: boolean;
  isFetching: boolean;
  totalRecords?: number;
  currentPage?: number;
  totalPages?: number;
  error?: string | null;
  searchQuery?: string;
}

/**
 * Screen Reader Live Region.
 * Dynamically announces state changes to assistive tech using aria-live="polite".
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  isLoading,
  isFetching,
  totalRecords,
  currentPage,
  totalPages,
  error,
  searchQuery,
}) => {
  const [announcement, setAnnouncement] = useState<string>('');

  useEffect(() => {
    if (error) {
      setAnnouncement(`Error: ${error}`);
    } else if (isLoading) {
      setAnnouncement('Loading tickets from server...');
    } else if (!isFetching && totalRecords !== undefined) {
      const searchContext = searchQuery ? ` for "${searchQuery}"` : '';
      if (totalRecords === 0) {
        setAnnouncement(`No tickets found${searchContext}.`);
      } else {
        setAnnouncement(
          `Showing ${totalRecords.toLocaleString()} tickets${searchContext}. Page ${currentPage} of ${totalPages}.`
        );
      }
    }
  }, [isLoading, isFetching, totalRecords, currentPage, totalPages, error, searchQuery]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};
