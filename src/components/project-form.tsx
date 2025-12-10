import { DatePicker } from "@/components/date-picker";
import InputImage from "@/components/input-image";
import QuillEditor from "@/components/quill-editor";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import * as z from "zod";

export const formSchema = z.object({
  name: z.string({ message: "Cannot be empty" }),
  description: z.string({ message: "Cannot be empty" }),
  project_date: z.date({ message: "Cannot be emtpy" }),
  project_link: z
    .string({ message: "Cannot be emtpy" })
    .startsWith("https://", { message: "Must start with https://" }),
  github_link: z
    .string({ message: "Cannot be emtpy" })
    .startsWith("https://", { message: "Must start with https://" }),
  tech_stack: z
    .string({ message: "Cannot be emtpy" })
    .min(3)
    .regex(/^[A-Za-z0-9 ,]+$/, {
      message: "Only letters, numbers, commas, and spaces are allowed",
    }),
  role: z.string({ message: "Cannot be emtpy" }),
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 1.5 * 1024 * 1024, "Max size 1.5MB"),
      z.string(),
    ])
    .optional(),
});

interface ProjectFormProps {
  initialData?: any;
  onSuccess?: () => void;
  form: any;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isPending?: boolean;
  isDetail?: boolean;
  isEdit?: boolean;
}

const ProjectForm = ({
  form,
  onSubmit,
  isPending,
  isDetail,
}: ProjectFormProps) => {
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [showButtonSubmit, setShowButtonSubmit] = useState(true);
  const { handleSubmit } = form;

  useEffect(() => {
    if (isDetail) {
      if (onEdit) {
        setShowButtonSubmit(true);
      } else {
        setShowButtonSubmit(false);
      }
    }
  }, [onEdit]);
  return (
    <div>
      {isDetail && (
        <div className="w-full flex justify-end items-end px-5">
          <Button
            onClick={() => {
              setOnEdit(true);
            }}
            disabled={onEdit}
            className="bg-transparent cursor-pointer hover:bg-transparent group"
          >
            <Edit className="edit-icon size-6 group-hover:opacity-50 transition-opacity" />
          </Button>
        </div>
      )}
      <div>
        <FieldGroup>
          <form id="project-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 mt-5">
              <div className="grid w-full gap-6">
                {/* Project Name */}
                <div>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="project_name_input">
                          Project Name
                        </FieldLabel>
                        <Input
                          {...field}
                          id="project_name_input"
                          aria-invalid={fieldState.invalid}
                          placeholder="Login button not working on mobile"
                          autoComplete="off"
                          disabled={isDetail && !onEdit}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Description */}
                <div>
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="project_description_input">
                          Project Description
                        </FieldLabel>
                        <QuillEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          disabled={isDetail && !onEdit}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Project Date */}
                <div className="gird gird-cols-2">
                  <div>
                    <Controller
                      name="project_date"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="project_date_input">
                            Project Date
                          </FieldLabel>
                          <DatePicker
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isDetail && !onEdit}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>

                {/* Github & Project Link */}
                <div className="gird gird-cols-2 flex gap-2">
                  <div className="w-full">
                    <Controller
                      name="github_link"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="github_link_input">
                            Github Link
                          </FieldLabel>
                          <Input
                            {...field}
                            id="github_link_input"
                            aria-invalid={fieldState.invalid}
                            placeholder="https://github.com/riangho"
                            autoComplete="off"
                            disabled={isDetail && !onEdit}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div className="w-full">
                    <Controller
                      name="project_link"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="project_link_input">
                            Project Link
                          </FieldLabel>
                          <Input
                            {...field}
                            id="project_link_input"
                            aria-invalid={fieldState.invalid}
                            placeholder="https://yourproject.com"
                            autoComplete="off"
                            disabled={isDetail && !onEdit}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <Controller
                    name="tech_stack"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="tech_stack_input">
                          Tech Stack
                        </FieldLabel>
                        <Input
                          {...field}
                          id="tech_stack_input"
                          aria-invalid={fieldState.invalid}
                          placeholder="e.q : React JS, Python, NodeJS"
                          autoComplete="off"
                          disabled={isDetail && !onEdit}
                        />
                        <span className="text-xs text-primary">
                          Separate by comma: React JS, Tailwind, Redux
                        </span>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>

                {/* Role */}
                <div>
                  <Controller
                    name="role"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="role_input">Role</FieldLabel>
                        <Input
                          {...field}
                          id="role_input"
                          aria-invalid={fieldState.invalid}
                          placeholder="Software Engineer"
                          autoComplete="off"
                          disabled={isDetail && !onEdit}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
              <div className="grid w-full gap-6 ps-5">
                {/* Project Image */}
                <div>
                  <Controller
                    name="image"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="flex flex-col gap-2"
                        >
                          <FieldLabel>Project Image</FieldLabel>

                          <InputImage
                            disabled={isDetail && !onEdit}
                            field={field}
                          />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </FieldGroup>
      </div>
      <CardFooter className="mt-10">
        {showButtonSubmit && (
          <Field orientation="horizontal" className="flex justify-end">
            <Button
              className="cursor-pointer"
              type="button"
              variant="outline"
              onClick={() => {
                if (onEdit) {
                  setOnEdit(false);
                } else {
                  form.reset();
                }
              }}
            >
              {onEdit ? "Cancel" : "Reset"}
            </Button>
            <Button
              className="cursor-pointer"
              type="submit"
              form="project-form"
              disabled={isPending}
            >
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </Field>
        )}
      </CardFooter>
    </div>
  );
};

export default ProjectForm;
