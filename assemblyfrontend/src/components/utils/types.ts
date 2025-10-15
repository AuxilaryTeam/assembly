// User and Auth Types

export interface DecodedUser {
  id: number;
  firstName: string;
  email: string;
  roleId: number;
  roleName: string;
}

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string; // you might want to omit this on the frontend
  role: Role;
  fullName: string;
};

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  token: string | null;
}

// User authentication types
export interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
  email?: string;
}

export interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  roleId: number;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  roleId: number;
}

//  ======== Issue ==========
export type IssueRequest = {
  id: number;
  electionId: number;
  title: string;
  description: string;
};

export type IssueItem = {
  id: number;
  title: string;
  description: string;
  status: string;
  active: boolean;
};

export type IssueResult = {
  title: string;
  description: string;
  status: "OPEN" | "CLOSED" | string; // can extend later
  options: Record<string, number>;
};

// ============= Positions ============
export interface PositionRequest {
  name: string;
  description: string;
  maxVotes: number;
  maxCandidates: number;
  electionId: number;
}

export type ElectionStatus = "DRAFT" | "OPEN" | "CLOSED";

export interface PositionItem {
  id: number; // Long → number
  name: string;
  description: string;
  maxCandidates: number; // default handled in backend
  maxVotes: number;
  status?: ElectionStatus; // can be null/undefined if not set
  election?: ElectionItem;
}

// ========== Voter ===========

export type VoterItem = {
  id: number;
  attendance: boolean | null;
  devidend: number | null;
  fiscalyear: string | null;
  nameamh: string | null;
  nameeng: string | null;
  paidcapital: number | null;
  phone: string | null;
  shareholderid: string | null;
  sharesubsription: number | null;
  totalcapital: number | null;
  votingsubscription: number | null;
};

export type VoteRequest = {
  voterId: number;
  voterShareHolderId: string;
  positionId?: number;
  candidateId?: number;
  issueId?: number;
  optionId?: number;
};

//  ==============Election===============

export type Role = {
  id: number;
  name: string;
};

export type ElectionItem = {
  id: number;
  name: string;
  status: ElectionStatus;
  electionDay: string; // "2025-09-23" (LocalDate)
  createdBy: User;
  createdAt: string; // ISO timestamp "2025-09-22T11:35:23.999062Z"
};

//  ==============Types Based on Response===============
export interface LoginResponse {
  fullName: string;
  email: string;
  token: string;
  refreshToken: string;
  roleId: string;
  roleName: "ADMIN" | "USER"; // Only two roles based on your response
}

export interface DecodedToken {
  sub: string;
  roleName: "ADMIN" | "USER";
  roleId: number;
  userId: number;
  exp: number;
  iat: number;
}

export type UserRole = "ADMIN" | "USER";
