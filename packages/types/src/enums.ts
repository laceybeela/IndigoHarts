export enum UserRole {
  Admin = 'admin',
  Employee = 'employee',
}

export enum StayStatus {
  Upcoming = 'upcoming',
  CheckedIn = 'checked_in',
  CheckedOut = 'checked_out',
  Cancelled = 'cancelled',
}

export enum JobStatus {
  Assigned = 'assigned',
  Accepted = 'accepted',
  InProgress = 'in_progress',
  Completed = 'completed',
}

export enum SmsStatus {
  Pending = 'pending',
  Sent = 'sent',
  Delivered = 'delivered',
  Failed = 'failed',
}
