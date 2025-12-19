import { useWorkingExperiences } from "@/hooks/queries/working-experience.query";
import { WorkingExperience } from "@/types/working-experience.types";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

const WorkingExperienceNavMobileList = ({
  onNavigate,
}: {
  onNavigate?: () => void;
}) => {
  const workingExperiences = useWorkingExperiences();
  const { data, isLoading, error } = workingExperiences;
  const workingExperienceData = data?.data || [];

  if (isLoading) {
    return (
      <div className="grid gap-2 grid-cols-2 w-[400px] h-[100px]">
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
      </div>
    );
  }

  return (
    <div>
      {workingExperienceData.map((item: WorkingExperience) => {
        const icon = item?.icon ?? "";
        return (
          <Link href={`/working-experience/${item.id}`} onClick={onNavigate}>
            <div className="px-2 mt-2" key={item.title}>
              <div className="border border-1 rounded-lg p-2">
                <div className="text-sm leading-none font-medium flex flex-nowrap items-center">
                  <div>
                    <Image
                      src={(process.env.NEXT_PUBLIC_STORAGE_URL || "") + icon}
                      alt="Description of SVG"
                      width={30}
                      height={30}
                    />
                  </div>
                  <div className="ms-2">{item.title}</div>
                </div>
                <p className="mt-2 text-muted-foreground line-clamp-2 text-sm leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default WorkingExperienceNavMobileList;
