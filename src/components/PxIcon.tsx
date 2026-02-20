import { Icon } from "@iconify/react";
import { addCollection } from "@iconify/react";

// Import and register the icon set for offline use
import pixelarticons from "@iconify-json/pixelarticons/icons.json";
addCollection(pixelarticons);

interface PxIconProps {
  icon: string;
  size?: number;
  className?: string;
}

export default function PxIcon({ icon, size = 16, className = "" }: PxIconProps) {
  return (
    <Icon
      icon={`pixelarticons:${icon}`}
      width={size}
      height={size}
      className={className}
    />
  );
}
