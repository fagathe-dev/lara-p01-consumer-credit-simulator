/**
 * Breadcrumb Component
 * Ordered navigation trail. The last item is rendered as the current page.
 */

import React from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

const Nav = styled.nav`
    font-family: ${theme.typography.fontFamily.base};
    font-size: ${theme.typography.fontSize.sm};
`;

const List = styled.ol`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${theme.spacing[2]};
    list-style: none;
    margin: 0;
    padding: 0;
`;

const Item = styled.li`
    display: inline-flex;
    align-items: center;
    gap: ${theme.spacing[2]};
    color: ${theme.colors.text.secondary};
`;

const Separator = styled.span`
    color: ${theme.colors.text.muted};
    user-select: none;
`;

const Crumb = styled.a`
    color: ${theme.colors.text.secondary};
    text-decoration: none;

    &:hover {
        color: ${theme.colors.text.link};
        text-decoration: underline;
    }

    &:focus-visible {
        outline: 2px solid ${theme.colors.border.focus};
        outline-offset: 2px;
        border-radius: ${theme.radius.sm};
    }
`;

const Current = styled.span`
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.medium};
`;

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
    items: BreadcrumbItem[];
    /** Character or node used between items. */
    separator?: React.ReactNode;
}

/**
 * Breadcrumb Component
 * @example
 * <Breadcrumb items={[
 *   { label: "Accueil", href: "/" },
 *   { label: "Dossiers", href: "/dossiers" },
 *   { label: "Dossier #42" },
 * ]} />
 */
export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
    ({ items, separator = "/", ...props }, ref) => (
        <Nav ref={ref} aria-label="Fil d'Ariane" {...props}>
            <List>
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <Item key={`${item.label}-${index}`}>
                            {isLast || !item.href ? (
                                <Current
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {item.label}
                                </Current>
                            ) : (
                                <Crumb href={item.href}>{item.label}</Crumb>
                            )}
                            {!isLast && (
                                <Separator aria-hidden="true">
                                    {separator}
                                </Separator>
                            )}
                        </Item>
                    );
                })}
            </List>
        </Nav>
    ),
);

Breadcrumb.displayName = "Breadcrumb";
