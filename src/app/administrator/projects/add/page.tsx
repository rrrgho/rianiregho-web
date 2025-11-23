import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProjectForm from "./form";

const ProjectAdd = () => {
  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Add new project</CardTitle>
          <CardDescription>
            Every project you add will be shown on the Website, sorted by ASC
            project date
          </CardDescription>
          <ProjectForm />
        </CardHeader>
      </Card>
    </div>
  );
};

export default ProjectAdd;
