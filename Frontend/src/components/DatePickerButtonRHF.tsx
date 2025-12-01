import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {ControllerRenderProps} from "react-hook-form";
import {Job} from "../pages/recruiter/CreateInterview";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Label } from "@/components/ui/label";


function formatDateHuman(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(d: Date | undefined) {
  return !!d && !isNaN(d.getTime());
}

function parseIsoDate(iso?: string) {
  if (!iso) return undefined;
  const d = new Date(iso);
  return isValidDate(d) ? d : undefined;
}

function toIsoDateString(d?: Date) {
  if (!d || !isValidDate(d)) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function DatePickerButtonRHF({
  field,
}: {
  field: ControllerRenderProps<Job, "closed_at">;
}) {
  const initialDate = parseIsoDate(field.value);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(initialDate);

  useEffect(() => {
    setDate(parseIsoDate(field.value));
  }, [field.value]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={field.name} className="px-1">
        Closing Date
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={field.name}
            type="button"
            className="w-full justify-between font-normal py-6"
            onBlur={field.onBlur}
          >
            {date ? formatDateHuman(date) : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            toYear={2030}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              setDate(selectedDate);
              const iso = toIsoDateString(selectedDate);
              field.onChange(iso); // write back "YYYY-MM-DD"
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePickerButtonRHF;