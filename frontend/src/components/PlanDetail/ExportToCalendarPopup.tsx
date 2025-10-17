import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { convertTo24Hour } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface ExportToCalendarPopupProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (startDate: Date, startHour: number) => void;
    isProcessing: boolean;
    csvData: (string | number)[][] | null;
    planTitle: string;
    onClearCsvData: () => void;
}

export const ExportToCalendarPopup = ({
    open,
    onOpenChange,
    onSubmit,
    isProcessing,
    csvData,
    planTitle,
    onClearCsvData,
}: ExportToCalendarPopupProps) => {
    const [startDate, setStartDate] = useState<string>(
        format(new Date(), "yyyy-MM-dd"),
    );
    const [startHour, setStartHour] = useState<number>(9);
    const [amPm, setAmPm] = useState<"AM" | "PM">("AM");
    const [error, setError] = useState<string>("");

    const validateInputs = () => {
        setError("");

        // Validate date
        if (!startDate) {
            setError("Please select a start date.");
            return false;
        }

        const selectedDate = new Date(startDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            setError("Start date cannot be in the past.");
            return false;
        }

        if (isNaN(selectedDate.getTime())) {
            setError("Please enter a valid date.");
            return false;
        }

        // Validate hour
        if (!startHour || startHour < 1 || startHour > 12) {
            setError("Please enter a valid hour (1-12).");
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateInputs()) {
            return;
        }

        const [year, month, day] = startDate.split("-").map(Number);
        const hour24 = convertTo24Hour(startHour, amPm);
        onSubmit(new Date(year, month - 1, day), hour24);
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            // Clear error when closing
            setError("");
            // Delay clearing data to allow for closing animation
            setTimeout(() => {
                onClearCsvData();
            }, 200);
        }
        onOpenChange(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                {csvData ? (
                    <>
                        <DialogHeader>
                            <DialogTitle>Download Your CSV</DialogTitle>
                            <DialogDescription>
                                Your calendar file is ready. Download it and
                                then upload it to Google Calendar.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4 space-y-4 text-sm">
                            <p>
                                1. Download the CSV file using the button below.
                            </p>
                            <p>
                                2. Go to your Google Calendar import settings
                                and upload the file.
                            </p>
                            <a
                                href="https://calendar.google.com/calendar/u/0/r/settings/export"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Open Google Calendar Import Settings
                            </a>
                        </div>
                        <DialogFooter>
                            <CSVLink
                                data={csvData}
                                filename={`${planTitle.replace(
                                    /\s+/g,
                                    "_",
                                )}_plan.csv`}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                onClick={() => {
                                    toast({ title: "Downloading CSV..." });
                                    handleOpenChange(false);
                                }}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download Plan
                            </CSVLink>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Export to Google Calendar</DialogTitle>
                            <DialogDescription>
                                Select a start date and time for your plan's
                                events.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="startDate"
                                    className="text-right"
                                >
                                    Start Date
                                </Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    min={format(new Date(), "yyyy-MM-dd")}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="startHour"
                                    className="text-right"
                                >
                                    Start Time
                                    <span className="block text-xs text-neutral-500 text-center">
                                        (per day)
                                    </span>
                                </Label>
                                <div className="col-span-3 flex gap-2">
                                    <Input
                                        id="startHour"
                                        type="number"
                                        value={startHour}
                                        onChange={(e) => {
                                            const hour = parseInt(
                                                e.target.value,
                                                10,
                                            );
                                            if (hour >= 1 && hour <= 12) {
                                                setStartHour(hour);
                                            }
                                        }}
                                        min="1"
                                        max="12"
                                        className="flex-1"
                                    />
                                    <Select
                                        value={amPm}
                                        onValueChange={(value) =>
                                            setAmPm(value as "AM" | "PM")
                                        }
                                    >
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="AM">
                                                AM
                                            </SelectItem>
                                            <SelectItem value="PM">
                                                PM
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                onClick={handleSubmit}
                                disabled={!startDate || isProcessing}
                            >
                                {isProcessing
                                    ? "Processing..."
                                    : "Generate CSV"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
