/**
 * DashboardLayout Component
 * Used for CRM advisor panel
 * Fixed left sidebar + header + main content area
 */

import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";
import { Icon } from "@/ui/components/Base";

const DashboardLayoutContainer = styled.div`
    display: flex;
    height: 100vh;
    background-color: ${theme.colors.background.app};

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const DashboardSidebar = styled.aside<{ $isOpen: boolean }>`
    width: 240px;
    background-color: ${theme.colors.background.surface};
    border-right: 1px solid ${theme.colors.border.default};
    padding: ${theme.spacing[6]};
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing[4]};

    @media (max-width: 768px) {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        z-index: 1000;
        transform: translateX(${(props) => (props.$isOpen ? "0" : "-100%")});
        transition: transform 300ms ease;
        box-shadow: ${(props) => (props.$isOpen ? theme.shadows.lg : "none")};
    }
`;

const DashboardMain = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const DashboardHeader = styled.header`
    background-color: ${theme.colors.background.surface};
    border-bottom: 1px solid ${theme.colors.border.default};
    padding: ${theme.spacing[4]} ${theme.spacing[6]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    box-shadow: ${theme.shadows.sm};
    position: relative;

    @media (max-width: 768px) {
        height: 56px;
        padding: ${theme.spacing[3]} ${theme.spacing[4]};
    }
`;

const DashboardContent = styled.main`
    flex: 1;
    overflow-y: auto;
    padding: ${theme.spacing[6]} ${theme.spacing[8]};
    background-color: ${theme.colors.background.subtle};

    @media (max-width: 768px) {
        padding: ${theme.spacing[4]} ${theme.spacing[4]};
    }
`;

const DashboardBreadcrumb = styled.div`
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    display: flex;
    align-items: center;
    gap: ${theme.spacing[2]};

    a {
        color: ${theme.colors.text.link};

        &:hover {
            text-decoration: underline;
        }
    }
`;

const SidebarToggle = styled.button`
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    font-size: ${theme.typography.fontSize.lg};
    color: ${theme.colors.text.primary};
    padding: ${theme.spacing[2]};

    @media (max-width: 768px) {
        display: block;
    }

    &:focus-visible {
        outline: 2px solid ${theme.colors.border.focus};
        outline-offset: 2px;
    }
`;

const Overlay = styled.div<{ $visible: boolean }>`
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: ${(props) => (props.$visible ? 1 : 0)};
    pointer-events: ${(props) => (props.$visible ? "auto" : "none")};
    transition: opacity 300ms ease;

    @media (max-width: 768px) {
        display: block;
    }
`;

export interface DashboardLayoutProps {
    sidebar: React.ReactNode;
    header?: React.ReactNode;
    breadcrumb?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * DashboardLayout Component
 * @example
 * <DashboardLayout
 *   sidebar={<SidebarNav />}
 *   header={<UserInfo />}
 *   breadcrumb={<Breadcrumb />}
 * >
 *   <DossierList />
 * </DashboardLayout>
 */
export const DashboardLayout = React.forwardRef<
    HTMLDivElement,
    DashboardLayoutProps
>(({ sidebar, header, breadcrumb, children }, ref) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <DashboardLayoutContainer ref={ref}>
            <Overlay $visible={isSidebarOpen} onClick={closeSidebar} />
            <DashboardSidebar $isOpen={isSidebarOpen}>
                {sidebar}
            </DashboardSidebar>
            <DashboardMain>
                <DashboardHeader>
                    <SidebarToggle
                        onClick={toggleSidebar}
                        title="Toggle sidebar"
                    >
                        <Icon size="lg" label="Ouvrir le menu">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path
                                    d="M3 6h18M3 12h18M3 18h18"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            </svg>
                        </Icon>
                    </SidebarToggle>
                    {breadcrumb ? (
                        <DashboardBreadcrumb>{breadcrumb}</DashboardBreadcrumb>
                    ) : (
                        <div />
                    )}
                    {header}
                </DashboardHeader>
                <DashboardContent>{children}</DashboardContent>
            </DashboardMain>
        </DashboardLayoutContainer>
    );
});

DashboardLayout.displayName = "DashboardLayout";
