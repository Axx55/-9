export type AccountType = "parent" | "employee" | "institution" | "student";

export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  accountType: AccountType;
  managerId?: string;
  homeLocationLat?: number;
  homeLocationLng?: number;
  avatarUrl?: string;
}

export type TripStatus =
  | "not_started"
  | "journey_started"
  | "on_the_way"
  | "on_the_way_to_you"
  | "arrived_at_location"
  | "boarded"
  | "collection_finished"
  | "arrived"
  | "absent";
export type TripDirection = "go" | "return";

export interface DailyTrip {
  id: string;
  driverName: string;
  driverPhone: string;
  driverAvatarUrl?: string;
  vehiclePlate: string;
  vehicleType: string;
  vehicleColor: string;
  status: TripStatus;
  previousStatus?: TripStatus;
  direction: TripDirection;
  date: string;
  subscriptionId: string;
  absentCount?: number;
  absentWorkerIds?: string[];
  arrivedAtTime?: string;
}

export interface Worker {
  id: string;
  name: string;
  phone: string;
  institutionId: string;
}

export type SubscriptionStatus =
  | "under_review"
  | "accepted_pending_payment"
  | "active"
  | "expired"
  | "cancelled";

export interface Subscription {
  id: string;
  subscriberName: string;
  gender?: "male" | "female";
  tripType: "go_only" | "return_only" | "go_and_return";
  individualsCount?: number;
  workerIds?: string[];
  educationLevel?: string;
  schoolName?: string;
  neighborhood?: string;
  goTime?: string;
  returnTime?: string;
  daysOfWeek?: number[];
  subscriptionPeriod: string;
  status: SubscriptionStatus;
  daysRemaining?: number;
}

export type InvoiceStatus = "pending" | "under_review" | "paid";

export interface Invoice {
  id: string;
  subscriptionId: string;
  invoiceNumber: string;
  amount: number;
  status: InvoiceStatus;
  paymentDate?: string;
  dueDate: string;
}

export interface Bank {
  id: string;
  bankName: string;
  accountName: string;
  iban: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
}
