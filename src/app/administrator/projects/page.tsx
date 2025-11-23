"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projectColumns, useProjects } from "@/hooks/queries/project.query";
import { useProjectStore } from "@/store/useProjectStore";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function AdminProjects() {
  const projects = useProjects({ page: 1, per_page: 1 });
  const { isLoading, data } = projects;
  return (
    <div className="w-full">
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Showcasing projects to the Website
            </CardDescription>
            <CardAction>
              <Link href="/administrator/projects/add">
                <Button variant="outline" className="cursor-pointer">
                  <Plus />
                  Add Projects
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {!isLoading && (
              <DataTable columns={projectColumns} data={data?.data} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
