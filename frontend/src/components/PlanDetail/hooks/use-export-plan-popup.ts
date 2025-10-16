import { useState } from "react";

export default function useExportPlanPopup() {
    const [isExportPopupOpen, setIsExportPopupOpen] = useState(false);

    const openExportPopup = () => {
        setIsExportPopupOpen(true);
    };

    const closeExportPopup = () => {
        setIsExportPopupOpen(false);
    };

    return {
        isExportPopupOpen,
        openExportPopup,
        closeExportPopup,
        setIsExportPopupOpen,
    };
}
