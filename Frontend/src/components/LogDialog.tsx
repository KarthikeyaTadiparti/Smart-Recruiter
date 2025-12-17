import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { ViolationType } from "@/types/types";

interface LogDialogProps {
    violation: ViolationType | null;
    onClose: () => void;
    onReEnterFullscreen: () => void;
}

function LogDialog({
    violation,
    onClose,
    onReEnterFullscreen,
}: LogDialogProps) {
    return (
        <Dialog open={!!violation} onOpenChange={() => {}}>
            <DialogContent
                className="
                    max-w-sm
                    rounded-xl
                    border
                    bg-white
                    shadow-xl
                    [&>button]:hidden
                "
            >
                {/* Header */}
                <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                        <ShieldAlert className="h-5 w-5 text-red-600" />
                    </div>

                    <div className="flex-1">
                        <h2 className="text-sm font-semibold text-red-600">
                            Proctoring Alert
                        </h2>
                        <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                            {violation === "TAB_SWITCH" &&
                                "You switched tabs. Please stay focused on the interview."}

                            {violation === "FULLSCREEN_EXIT" &&
                                "You exited fullscreen mode. Fullscreen is required to continue."}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                    {violation === "FULLSCREEN_EXIT" && (
                        <Button
                            variant="destructive"
                            className="h-8 text-xs"
                            onClick={() => {
                                onReEnterFullscreen();
                                onClose();
                            }}
                        >
                            Re-enter Fullscreen
                        </Button>
                    )}

                    {violation === "TAB_SWITCH" && (
                        <Button
                            className="h-8 text-xs"
                            onClick={onClose}
                        >
                            Focus on Interview
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default LogDialog;
