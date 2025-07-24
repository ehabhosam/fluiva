import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";
import { useState } from "react";

interface PlanCustomizationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { title: string; description: string }) => void;
  defaultTitle: string;
  defaultDescription: string;
  taskCount: number;
  isCreating?: boolean;
}

const PlanCustomizationPopup: React.FC<PlanCustomizationPopupProps> = ({
  isOpen,
  onClose,
  onComplete,
  defaultTitle,
  defaultDescription,
  taskCount,
  isCreating = false,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      title: title.trim() || defaultTitle,
      description: description.trim() || defaultDescription,
    });
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-plansync-purple-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Customize Your Plan
          </DialogTitle>
          <DialogDescription>
            Give your plan a personal touch! Both fields are optional - we'll use smart defaults if you leave them empty.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plan-title">Plan Title (Optional)</Label>
              <Input
                id="plan-title"
                type="text"
                placeholder={defaultTitle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                Default: "{defaultTitle}"
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan-description">Plan Description (Optional)</Label>
              <Textarea
                id="plan-description"
                placeholder={defaultDescription}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                Default: "{defaultDescription}"
              </p>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="gradient-bg"
              disabled={isCreating}
            >
              {isCreating ? "Creating Plan..." : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanCustomizationPopup;
