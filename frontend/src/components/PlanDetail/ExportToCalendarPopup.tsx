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

    const handleSubmit = () => {
        if (startDate) {
            const [year, month, day] = startDate.split("-").map(Number);
            onSubmit(new Date(year, month - 1, day), startHour);
        }
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
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
                                Download CSV
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
                                    Start Hour (0-23)
                                </Label>
                                <Input
                                    id="startHour"
                                    type="number"
                                    value={startHour}
                                    onChange={(e) => {
                                        const hour = parseInt(
                                            e.target.value,
                                            10,
                                        );
                                        if (hour >= 0 && hour <= 23) {
                                            setStartHour(hour);
                                        }
                                    }}
                                    min="0"
                                    max="23"
                                    className="col-span-3"
                                />
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
