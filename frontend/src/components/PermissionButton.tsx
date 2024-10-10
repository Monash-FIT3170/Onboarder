import { Button, Tooltip } from "@mui/material";
import { ReactNode, CSSProperties } from "react";
import { useAuthStore } from "../util/stores/authStore";
import { Actions, Subjects } from "../util/abilities";

interface PermissionButtonProps {
  action: Actions;
  subject: Subjects;
  tooltipText?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  children: ReactNode;
  variant?: "text" | "outlined" | "contained";
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  size?: "small" | "medium" | "large";
  sx?: object;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
  autoFocus?: boolean;
}

const PermissionButton = ({
  action,
  subject,
  tooltipText,
  onClick,
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  sx = {},
  style = {},
  type = "button",
  autoFocus = false,
}: PermissionButtonProps) => {
  const { ability } = useAuthStore();

  const canPerformAction = ability?.can(action, subject);
  const isDisabled = !canPerformAction || disabled;

  return (
    <Tooltip
      title={
        canPerformAction ? "" : tooltipText || "You do not have permission"
      }
      arrow
    >
      <span>
        <Button
          variant={variant}
          color={color}
          onClick={onClick}
          disabled={isDisabled || loading}
          size={size}
          sx={sx}
          type={type}
          style={style}
          autoFocus={autoFocus}
        >
          {children}
        </Button>
      </span>
    </Tooltip>
  );
};

export default PermissionButton;
