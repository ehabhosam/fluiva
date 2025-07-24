import { Button } from "@/components/ui/button";

export default function PlansLoadError() {
    return <div className="p-8 text-center">
        <div className="text-red-500 mb-4">Failed to load plans</div>
        <Button
            variant="outline"
            onClick={() => window.location.reload()}
        >
            Try Again
        </Button>
    </div>
}