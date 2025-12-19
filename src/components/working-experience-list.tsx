import { useWorkingExperiences } from "@/hooks/queries/working-experience.query";
import { NavigationMenuContent } from "./ui/navigation-menu";
import { Skeleton } from "./ui/skeleton";
import { WorkingExperience } from "@/types/working-experience.types";
import { ListItem } from "./navbar";
import Image from "next/image";
import moment from "moment";
import Link from "next/link";

const WorkingExperienceList = ({
  hide_specific_list_by_id,
}: {
  hide_specific_list_by_id?: string;
}) => {
  const workingExperiences = useWorkingExperiences();
  const { data, isLoading, error } = workingExperiences;
  const workingExperienceData = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid gap-2 grid-cols-1 w-full h-[100px]">
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
      </div>
    );
  }

  return (
    <div>
      {workingExperienceData.map((item: WorkingExperience) => {
        if (hide_specific_list_by_id) {
          if (hide_specific_list_by_id === item.id) {
            return null;
          }
        }
        return (
          <Link href={`/working-experience/${item.id}`}>
            <div className="text-sm leading-none font-medium flex flex-nowrap items-center py-2 px-4 rounded cursor-pointer hover:bg-primary/30">
              <div className="h-[30px] w-[35px] relative">
                <Image
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL || ""}${
                    item.icon || ""
                  }`}
                  alt="Description of SVG"
                  fill
                  className="rounded"
                />
              </div>
              <div className="ms-2">
                <span className="text-base">{item.title}</span> <br />
                <span className="text-xs text-primary">
                  {moment(item.start_date).format("MMMM YYYY")} -{" "}
                  {item.end_date
                    ? moment(item.end_date).format("MMMM YYYY")
                    : "Present"}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default WorkingExperienceList;
