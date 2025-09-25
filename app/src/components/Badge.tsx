import React from "react";
import { Text, View, ViewStyle, TextStyle } from "react-native";

type Size = "sm" | "md" | "lg";
type Variant = "dot" | "count" | "text";

interface BadgeProps {
    variant?: Variant;
    size?: Size;
    color?: string; // tailwind color class base (e.g. "red", "green", "blue", "amber")
    text?: string | number;
    max?: number; // khi variant === "count", hiển thị max+
    rounded?: boolean;
    outline?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

/**
 * Badge component (NativeWind friendly).
 * - color: base color name (without -500). E.g. "red", "green", "blue", "amber".
 * - variant:
 *    - "dot": nhỏ, chỉ dấu chấm
 *    - "count": số lượng (sẽ hiển thị max+ nếu vượt)
 *    - "text": nhãn text nhỏ
 */
export default function Badge({
    variant = "count",
    size = "md",
    color = "red",
    text,
    max = 99,
    rounded = true,
    outline = false,
    style,
    textStyle,
}: BadgeProps) {
    // mapping size -> tailwind classes
    const sizeMap = {
        sm: {
            container: "px-1.5 py-0.5 min-w-[18] h-4",
            text: "text-xs",
            dot: "w-2 h-2",
        },
        md: {
            container: "px-2 py-0.5 min-w-[22] h-5",
            text: "text-xs",
            dot: "w-2.5 h-2.5",
        },
        lg: {
            container: "px-2.5 py-0.5 min-w-[26] h-6",
            text: "text-sm",
            dot: "w-3 h-3",
        },
    } as const;

    const s = sizeMap[size];

    const bgClass = outline ? `border-${color}-500` : `bg-${color}-600`;
    const textColorClass = outline ? `text-${color}-600` : "text-white";
    const borderClass = outline ? `border` : "";
    const radiusClass = rounded ? "rounded-full" : "rounded";

    // render variants
    if (variant === "dot") {
        return (
            <View
                // @ts-ignore nativewind
                className={`${s.dot} ${bgClass} ${radiusClass} ${outline ? "border-2" : ""}`}
                style={style}
                accessibilityLabel="notification-dot"
                accessible
            />
        );
    }

    if (variant === "text") {
        return (
            <View
                // @ts-ignore nativewind
                className={`${s.container} ${borderClass} ${radiusClass} items-center justify-center ${outline ? "bg-transparent" : bgClass}`}
                style={style}
                accessible
                accessibilityRole="text"
            >
                <Text
                    // @ts-ignore nativewind
                    className={`${s.text} ${textColorClass} px-1`}
                    style={textStyle}
                >
                    {String(text ?? "")}
                </Text>
            </View>
        );
    }

    // default: count
    const count = typeof text === "number" ? text : Number(text ?? 0);
    const display =
        typeof count === "number" && !Number.isNaN(count)
            ? count > max
                ? `${max}+`
                : `${count}`
            : String(text ?? "");

    return (
        <View
            // @ts-ignore nativewind
            className={`${s.container} ${borderClass} ${radiusClass} items-center justify-center ${outline ? "bg-transparent" : bgClass}`}
            style={style}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`badge-${display}`}
        >
            <Text
                // @ts-ignore nativewind
                className={`${s.text} ${textColorClass} font-medium`}
                style={textStyle}
            >
                {display}
            </Text>
        </View>
    );
}
