import { Navigate, Route, Routes } from "react-router-dom";
import { authStore } from "../../../store/authStore";
import { Login } from "../../PagesArea/Auth/Login/Login";
import { Register } from "../../PagesArea/Auth/Register/Register";
import { Collections } from "../../PagesArea/Collections/Collections";
import { DashboardArea } from "../../PagesArea/DashboardArea/DashboardArea";
import { Dashboard } from "../../PagesArea/DashboardArea/Dashboard/Dashboard";
import { Favorites } from "../../PagesArea/Favorites/Favorites";
import { LandingPage } from "../../PagesArea/LandingPage/LandingPage";
import { WhatIsMibishel } from "../../PagesArea/WhatIsMibishel/WhatIsMibishel";
import { Page404 } from "../../PagesArea/Page404/Page404";
import { Profile } from "../../PagesArea/Profile/Profile";
import { RecipePage } from "../../PagesArea/RecipePage/RecipePage";

interface RouteGuardProps {
    children: React.ReactElement;
}

function ProtectedRoute(props: RouteGuardProps) {
    if (!authStore.isLoggedIn()) return <Navigate to="/login" replace />;
    return props.children;
}

function PublicRoute(props: RouteGuardProps) {
    if (authStore.isLoggedIn()) return <Navigate to="/dashboard" replace />;
    return props.children;
}

export function Routing() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardArea><Dashboard /></DashboardArea></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><DashboardArea><Favorites /></DashboardArea></ProtectedRoute>} />
            <Route path="/collections" element={<ProtectedRoute><DashboardArea><Collections /></DashboardArea></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><DashboardArea><Profile /></DashboardArea></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><DashboardArea><WhatIsMibishel /></DashboardArea></ProtectedRoute>} />
            <Route path="/recipe/:id" element={<ProtectedRoute><RecipePage /></ProtectedRoute>} />
            <Route path="*" element={<Page404 />} />
        </Routes>
    );
}
