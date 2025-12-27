import { useEffect, useState } from "react";

function useCompany(authData: any) {
    const loading = authData.loading.fetchCompany;
    const userData = authData.userData;
    const company = authData.company;
    
    const [showCompanyDialog, setShowCompanyDialog] = useState(false);
    const [companyForm, setCompanyForm] = useState({
        name: "",
        description: "",
        website: "",
    });

    useEffect(() => {
        if (userData?.role === "recruiter" && !company) {
            setShowCompanyDialog(true);
        }
    }, [userData, company]);
    return { loading, showCompanyDialog, companyForm, setCompanyForm, setShowCompanyDialog };
}

export default useCompany