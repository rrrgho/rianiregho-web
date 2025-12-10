"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projectColumns } from "@/hooks/queries/project.query";
import AppDatatable from "@/lib/Datatable/datatable";
import { Project } from "@/types/project.types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminProjects() {
  const router = useRouter();

  const handleRowClick = (project: Project) => {
    router.push(`/administrator/projects/${project.id}`);
  };

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
            <AppDatatable
              endpoint="/projects"
              columns={projectColumns}
              onRowClick={handleRowClick}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
