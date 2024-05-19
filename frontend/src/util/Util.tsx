export const formatDeadline = (deadline: string): string => {
  const date = new Date(deadline);
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
      return "Accepted";
    case "R":
      return "Rejected";
    case "U":
      return "Unassessed";
    default:
      return "Unknown";
  }
};
