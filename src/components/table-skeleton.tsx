import { Skeleton } from "./ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const TableSkeleton = () => {
  return (
    <div className="w-full">
      <Table>
        <TableHeader className="border border-0">
          <TableRow className="border border-0">
            <TableHead className="w-[100px]">
              <Skeleton className="bg-primary/10 w-full h-full" />
            </TableHead>
            <TableHead>
              <Skeleton className="bg-primary/10 w-full h-full" />
            </TableHead>
            <TableHead>
              <Skeleton className="bg-primary/10 w-full h-full" />
            </TableHead>
            <TableHead className="text-right ">
              <Skeleton className="bg-primary/10 w-full h-full" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {new Array(4).fill("").map((item, idx) => {
            return (
              <TableRow key={idx} className="border border-0">
                <TableCell className="font-medium h-[40px]">
                  <Skeleton className="bg-primary/10 w-full h-full" />
                </TableCell>
                <TableCell className="font-medium h-[40px]">
                  <Skeleton className="bg-primary/10 w-full h-full" />
                </TableCell>
                <TableCell className="font-medium h-[40px]">
                  <Skeleton className="bg-primary/10 w-full h-full" />
                </TableCell>
                <TableCell className="font-medium h-[40px]">
                  <Skeleton className="bg-primary/10 w-full h-full" />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableSkeleton;
