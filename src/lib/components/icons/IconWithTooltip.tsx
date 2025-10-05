"use client";

import { Tooltip, TooltipProps } from "@mantine/core";
import { IconBase } from "react-icons/lib";

export default function IconWithTooltip<C extends React.ElementType>({
  label,
  component,
  tooltipProps,
  ...iconProps
}: TIconWithTooltipProps<C>) {
  const Icon = component || IconBase

  return (
    <Tooltip label={label} {...tooltipProps}>
      <Icon {...iconProps}/>
    </Tooltip>
  );
}

export type TIconWithTooltipProps<C extends React.ElementType> = {
  label?: string;
  component?: C;
  tooltipProps?: TooltipProps;
} & React.ComponentPropsWithoutRef<C>
