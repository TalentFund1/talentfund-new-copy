import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Location } from "./types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";

interface LocationsTableProps {
  locations: Location[];
}

type SortConfig = {
  key: keyof Location;
  direction: 'asc' | 'desc';
} | null;

export const LocationsTable = ({ locations }: LocationsTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

  const handleSort = (key: keyof Location) => {
    setSortConfig((currentSort) => {
      if (!currentSort || currentSort.key !== key) {
        return { key, direction: 'asc' };
      }
      if (currentSort.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const getSortedLocations = () => {
    if (!sortConfig) return locations;

    return [...locations].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  };

  const getSortIcon = (key: keyof Location) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUp className="h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowDown className="h-4 w-4" />
      : <ArrowUp className="h-4 w-4" />;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-secondary">
          <TableHead 
            className="font-medium text-sm text-primary py-4 w-[200px] border-r border-border cursor-pointer"
            onClick={() => handleSort('name')}
          >
            <div className="flex items-center gap-1">
              Location
              {getSortIcon('name')}
            </div>
          </TableHead>
          <TableHead 
            className="text-right font-medium text-sm text-primary py-4 border-r border-border cursor-pointer"
            onClick={() => handleSort('profiles')}
          >
            <div className="flex items-center justify-end gap-1">
              Number of Profiles
              {getSortIcon('profiles')}
            </div>
          </TableHead>
          <TableHead 
            className="text-right font-medium text-sm text-primary py-4 border-r border-border cursor-pointer"
            onClick={() => handleSort('uniqueJobs')}
          >
            <div className="flex items-center justify-end gap-1">
              Number of Unique Jobs
              {getSortIcon('uniqueJobs')}
            </div>
          </TableHead>
          <TableHead 
            className="text-right font-medium text-sm text-primary py-4 border-r border-border cursor-pointer"
            onClick={() => handleSort('medianCompensation')}
          >
            <div className="flex items-center justify-end gap-1">
              Median Compensation
              {getSortIcon('medianCompensation')}
            </div>
          </TableHead>
          <TableHead 
            className="text-right font-medium text-sm text-primary py-4 border-r border-border cursor-pointer"
            onClick={() => handleSort('totalDiversity')}
          >
            <div className="flex items-center justify-end gap-1">
              Total Diversity
              {getSortIcon('totalDiversity')}
            </div>
          </TableHead>
          <TableHead 
            className="text-right font-medium text-sm text-primary py-4 border-r border-border cursor-pointer"
            onClick={() => handleSort('percentDiversity')}
          >
            <div className="flex items-center justify-end gap-1">
              Percent Diversity
              {getSortIcon('percentDiversity')}
            </div>
          </TableHead>
          <TableHead 
            className="text-right font-medium text-sm text-primary py-4 border-r border-border cursor-pointer"
            onClick={() => handleSort('postingIntensity')}
          >
            <div className="flex items-center justify-end gap-1">
              Posting Intensity
              {getSortIcon('postingIntensity')}
            </div>
          </TableHead>
          <TableHead 
            className="text-right font-medium text-sm text-primary py-4 cursor-pointer"
            onClick={() => handleSort('medianDuration')}
          >
            <div className="flex items-center justify-end gap-1">
              Median Duration
              {getSortIcon('medianDuration')}
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {getSortedLocations().map((location) => (
          <TableRow key={location.name} className="border-b border-gray-200">
            <TableCell className="font-medium text-sm py-4 border-r border-border">{location.name}</TableCell>
            <TableCell className="text-right text-sm py-4 border-r border-border">{location.profiles.toLocaleString()}</TableCell>
            <TableCell className="text-right text-sm py-4 border-r border-border">{location.uniqueJobs}</TableCell>
            <TableCell className="text-right text-sm py-4 border-r border-border">${location.medianCompensation.toLocaleString()}</TableCell>
            <TableCell className="text-right text-sm py-4 border-r border-border">{location.totalDiversity.toLocaleString()}</TableCell>
            <TableCell className="text-right text-sm py-4 border-r border-border">{location.percentDiversity}</TableCell>
            <TableCell className="text-right text-sm py-4 border-r border-border">{location.postingIntensity}</TableCell>
            <TableCell className="text-right text-sm py-4">{location.medianDuration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};