import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, Clock } from "lucide-react";

interface ConfirmationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onYes: () => void;
    onNo: () => void;
    taskCount: number;
    totalHours: number;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
    isOpen,
    onClose,
    onYes,
    onNo,
    taskCount,
    totalHours,
}) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-Fluiva-purple-900 text-center">
                        Ready to Handle the Mess?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        You have {taskCount} task{taskCount !== 1 ? "s" : ""}{" "}
                        totaling {totalHours} hour{totalHours !== 1 ? "s" : ""}{" "}
                        of work.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Visual representation */}
                    <div className="flex justify-center space-x-8">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-Fluiva-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Calendar className="w-6 h-6 text-Fluiva-purple-600" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {taskCount} Tasks
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-Fluiva-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Clock className="w-6 h-6 text-Fluiva-teal-600" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {totalHours} Hours
                            </p>
                        </div>
                    </div>

                    {/* Main question */}
                    <div className="text-center space-y-2">
                        <h3 className="text-lg font-medium text-gray-900">
                            Do you wanna finish all this today?
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Choose how you'd like to organize your tasks
                        </p>
                    </div>

                    {/* Action buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={onYes}
                            className="w-full gradient-bg text-white"
                            size="lg"
                        >
                            Yes, finish today!
                            <span className="text-xs opacity-80 ml-2">
                                (1 day, {totalHours} blocks)
                            </span>
                        </Button>

                        <Button
                            onClick={onNo}
                            variant="outline"
                            className="w-full"
                            size="lg"
                        >
                            No, let me customize
                            <span className="text-xs opacity-60 ml-2">
                                (set time constraints)
                            </span>
                        </Button>
                    </div>

                    {/* Cancel option */}
                    <div className="text-center">
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmationPopup;
