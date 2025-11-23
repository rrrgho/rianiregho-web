import { ControllerRenderProps } from "react-hook-form";

const InputImage = ({ field }: { field: ControllerRenderProps<any> }) => {
  const file = field.value;
  const previewUrl =
    file && typeof file !== "string" ? URL.createObjectURL(file) : null;
  return (
    <div
      className="relative w-full h-[400px] border border-dashed rounded-md flex items-center justify-center bg-muted cursor-pointer hover:bg-muted/70 transition"
      onClick={() => document.getElementById("image_input")?.click()}
    >
      {/* If Image exists → Preview */}
      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            alt="Preview"
            className="h-full w-full object-cover rounded-md"
          />

          {/* Delete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // prevent re-triggering input click
              field.onChange(null);
            }}
            className="absolute top-1 right-1 bg-black/60 hover:bg-black text-white rounded-full w-7 h-7 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </>
      ) : (
        <span className="text-sm text-muted-foreground">
          Click to upload image
        </span>
      )}

      {/* Hidden Real Input */}
      <input
        id="image_input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          field.onChange(file ?? null);
        }}
      />
    </div>
  );
};

export default InputImage;
