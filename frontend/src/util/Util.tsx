export const formatDeadline = (application_deadline: string): string => {
  const date = new Date(application_deadline);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "A":
      return "Active";
    case "I":
      return "Inactive";
    case "R":
      return "Archived";
    default:
      return "Unknown";
  }
};

export const getAppStatusText = (status: string): string => {
  switch (status) {
    case "A":
      return "Applicant";
    case "C":
      return "Candidate";
    case "R":
      return "Recruit";
    case "X":
      return "Rejected";
    default:
      return "Unknown";
  }
};

export enum UserRole {
  Owner = "owner",
  TeamLead = "team lead",
  Admin = "admin",
}

/**
 * Retrieves the API URL from the environment variables.
 *
 * @returns {string} The API URL specified in the environment variables, or a default URL if not specified.
 */
export const getBaseAPIURL = (): string => {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  } else {
    return "http://127.0.0.1:3000";
  }
};
