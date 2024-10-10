import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import { UserRole } from "../util/Util";

export type Actions =
  | "manage"
  | "create"
  | "read"
  | "update"
  | "delete"
  | "invite"
  | "assign"
  | "configure"
  | "archive"
  | "open"
  | "close"
  | "send"
  | "schedule";
export type Subjects =
  | "all"
  | "Team"
  | "Round"
  | "Opening"
  | "TaskEmail"
  | "Interview"
  | "TeamLead";

export type AppAbility = MongoAbility<[Actions, Subjects]>;

export function defineAbilityFor(role: UserRole): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility,
  );

  switch (role) {
    case UserRole.Owner:
      can("manage", "all");
      break;

    case UserRole.Admin:
      can("manage", "all");
      cannot("update", "Team");
      cannot("delete", "Team");
      cannot("invite", "Team");
      break;

    case UserRole.TeamLead:
      can(["read", "update"], ["Round", "Opening"]);
      can(["send", "schedule"], "Interview");
      cannot("create", "Round");
      cannot("create", "Opening");
      cannot("configure", "TaskEmail");
      cannot("archive", "Round");
      cannot("open", "Round");
      cannot("close", "Round");
      cannot("assign", "TeamLead");
      break;

    default:
      // No permissions for unknown roles
      break;
  }

  return build();
}
