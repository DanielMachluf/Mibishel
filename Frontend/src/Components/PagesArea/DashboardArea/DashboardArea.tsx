import type { ReactNode } from "react";
import { DashboardNavbar } from "./DashboardNavbar/DashboardNavbar";
import "./DashboardArea.css";

interface DashboardAreaProps {
    children: ReactNode;
}

export function DashboardArea({ children }: DashboardAreaProps) {
    return (
        <div className="DashboardArea">
            <DashboardNavbar />
            <div className="DashboardArea__content">
                {children}
            </div>
        </div>
    );
}
