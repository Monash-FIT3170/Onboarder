import React from "react";
import { Tooltip, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

interface RoleIconProps {
  role: string;
}

const RoleIcon: React.FC<RoleIconProps> = ({ role }) => {
  let Icon;
  let tooltipTitle;

  switch (role.toLowerCase()) {
    case "owner":
      Icon = AdminPanelSettingsIcon;
      tooltipTitle = "Owner";
      break;
    case "admin":
      Icon = SupervisorAccountIcon;
      tooltipTitle = "Admin";
      break;
    case "team lead":
    case "teamlead":
      Icon = PersonIcon;
      tooltipTitle = "Team Lead";
      break;
    default:
      Icon = PersonIcon;
      tooltipTitle = "Member";
  }

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton size="small">
        <Icon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default RoleIcon;
