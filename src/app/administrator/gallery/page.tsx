"use client";

import DeleteActionCell from "@/components/delete-action-cell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { galleryColumns, useDeleteGallery } from "@/hooks/queries/gallery.query";
import AppDatatable from "@/lib/Datatable/datatable";
import { Gallery } from "@/types/gallery.types";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function AdminGallery() {
  const router = useRouter();
  const { mutateAsync: deleteGallery } = useDeleteGallery();

  const columns: ColumnDef<Gallery>[] = useMemo(
    () => [
      ...galleryColumns,
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/administrator/gallery/${row.original.id}`);
              }}
              className="text-blue-500 cursor-pointer hover:text-blue-700 hover:bg-blue-50"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <DeleteActionCell
              id={row.original.id}
              onDelete={async (id) => {
                await deleteGallery(id);
              }}
              title="Delete Gallery"
              description="Are you sure you want to delete this gallery and its photos from the website?"
            />
          </div>
        ),
      },
    ],
    [deleteGallery, router]
  );

  return (
    <div className="w-full">
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Gallery</CardTitle>
            <CardDescription>
              Photos and the stories behind them, shown on the Gallery page
            </CardDescription>
            <CardAction>
              <Link href="/administrator/gallery/add">
                <Button variant="outline" className="cursor-pointer">
                  <Plus />
                  Add Gallery
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <AppDatatable endpoint="/galleries" columns={columns} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
