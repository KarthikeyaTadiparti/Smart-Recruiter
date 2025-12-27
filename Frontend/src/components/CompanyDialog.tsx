import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { _createCompany } from "@/redux/actions/auth-actions";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/use-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

type company = {
    name: string;
    description: string;
    website: string;
}

interface CompanyDialogProps {
    loading: boolean;
    showCompanyDialog: boolean;
    companyForm: company;
    setCompanyForm: Dispatch<SetStateAction<company>>;
    setShowCompanyDialog: Dispatch<SetStateAction<boolean>>;
}

function CompanyDialog(
    {
        loading,
        showCompanyDialog,
        companyForm,
        setCompanyForm,
        setShowCompanyDialog
    }: CompanyDialogProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    async function handleCompanySubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!companyForm.name || !companyForm.description || !companyForm.website) return;
        const { payload }: any = await dispatch(_createCompany({ data: companyForm, navigate }));

        if (payload?.data?.status) {
            toast.success(payload.data.message);
            setShowCompanyDialog(false);
        }
        else {
            toast.error(payload?.data?.message || "Failed to create interview");
        }
    }
    
    return (
        <Dialog open={showCompanyDialog} onOpenChange={setShowCompanyDialog}>
            <DialogContent className="[&>button]:hidden" onEscapeKeyDown={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Company Details</DialogTitle>
                    <DialogDescription>
                        Please provide your company details to continue using the recruiter
                        dashboard.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCompanySubmit} className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                            id="company-name"
                            value={companyForm.name}
                            onChange={(e) =>
                                setCompanyForm((prev) => ({ ...prev, name: e.target.value }))
                            }
                            placeholder="Acme Inc."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-description">Description</Label>
                        <textarea
                            id="company-description"
                            value={companyForm.description}
                            onChange={(e) =>
                                setCompanyForm((prev) => ({ ...prev, description: e.target.value }))
                            }
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Short description about your company"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company-website">Website</Label>
                        <Input
                            id="company-website"
                            type="url"
                            value={companyForm.website}
                            onChange={(e) =>
                                setCompanyForm((prev) => ({ ...prev, website: e.target.value }))
                            }
                            placeholder="https://www.example.com"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CompanyDialog