/**
 * Avatar Component
 * Display user avatar with initials fallback
 */

import React, { useMemo } from "react";
import styled from "styled-components";
import { theme } from "@/ui/theme";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

const AvatarContainer = styled.div<{ $size: AvatarSize; $bgColor?: string }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.radius.full};
    background-color: ${(props) =>
        props.$bgColor || theme.colors.brand.primary};
    color: ${theme.colors.text.onPrimary};
    font-weight: ${theme.typography.fontWeight.semibold};
    flex-shrink: 0;

    ${(props) => {
        switch (props.$size) {
            case "sm":
                return `width: 32px; height: 32px; font-size: ${theme.typography.fontSize.xs};`;
            case "lg":
                return `width: 48px; height: 48px; font-size: ${theme.typography.fontSize.lg};`;
            case "xl":
                return `width: 64px; height: 64px; font-size: ${theme.typography.fontSize.xl};`;
            case "md":
            default:
                return `width: 40px; height: 40px; font-size: ${theme.typography.fontSize.sm};`;
        }
    }}

    img {
        width: 100%;
        height: 100%;
        border-radius: ${theme.radius.full};
        object-fit: cover;
    }
`;

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    name?: string;
    size?: AvatarSize;
    bgColor?: string;
}

/**
 * Generate initials from name
 */
function getInitials(name: string): string {
    return name
        .split(" ")
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

/**
 * Generate color hash from name
 */
function getColorFromName(name: string): string {
    const colors = [
        theme.colors.mauve[500],
        theme.colors.success[500],
        theme.colors.info[500],
        theme.colors.warning[500],
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

/**
 * Avatar Component
 * @example
 * // With image
 * <Avatar src="/avatar.jpg" alt="John Doe" size="md" />
 *
 * // With initials fallback
 * <Avatar name="John Doe" size="md" />
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ src, alt, name = "", size = "md", bgColor, ...props }, ref) => {
        const initials = useMemo(() => getInitials(name), [name]);
        const color = useMemo(
            () => bgColor || getColorFromName(name),
            [bgColor, name],
        );

        return (
            <AvatarContainer ref={ref} $size={size} $bgColor={color} {...props}>
                {src ? <img src={src} alt={alt || name} /> : initials}
            </AvatarContainer>
        );
    },
);

Avatar.displayName = "Avatar";
