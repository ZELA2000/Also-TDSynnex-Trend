// ============================================================================
// Authentication Types
// ============================================================================

export interface AuthenticateRequest {
    UserName: string;
    Password: string;
}

export interface SessionTokenResponse {
    token: string;
}

// ============================================================================
// Company and Account Types
// ============================================================================

export interface Company {
    AccountId?: number;
    Name: string;
    Email: string;
    Address?: string;
    City?: string;
    Country?: string;
    Zip?: string;
    Phone?: string;
    VatId?: string;
}

export interface CompanyAccount {
    Company: Company;
}

export interface UpdateCompany {
    Company: Partial<Company> & { AccountId: number };
}

// ============================================================================
// User Types
// ============================================================================

export interface User {
    AccountId?: number;
    Email: string;
    FirstName: string;
    LastName: string;
    Role: string;
    ParentAccountId?: number;
}

export interface CreateUserRequest {
    User: User;
}

export interface GetUsersRequest {
    AccountId: number;
}

export interface Users {
    Users: User[];
}

// ============================================================================
// Marketplace and Service Types
// ============================================================================

export interface MarketplaceInfo {
    MarketplaceId: number;
    Name: string;
    Description?: string;
}

export interface SimpleProductInfo {
    ServiceId: string;
    Name: string;
    Description?: string;
    IsAddon: boolean;
}

export interface GetPossibleServicesForParentRequest {
    AccountId: number;
}

export interface GetFieldsForServiceRequest {
    AccountId: number;
    ServiceId: string;
}

export interface AccountFieldValueItem {
    Id: string;
    Value: string;
    DisplayValue?: string;
}

export interface Field {
    Id: string;
    Name: string;
    Type: string;
    IsMandatory: boolean;
    ValidationExpression?: string;
    DefaultValue?: string;
    Values?: AccountFieldValueItem[];
}

export interface SubscriptionInputDefinition {
    Fields: Field[];
}

// ============================================================================
// Subscription Types
// ============================================================================

export interface SubscriptionField {
    Id: string;
    Value: string;
}

export interface Subscription {
    AccountId?: number;
    ParentAccountId: number;
    ServiceId: string;
    ServiceName?: string;
    Quantity: number;
    Fields?: SubscriptionField[];
    Status?: string;
    CreatedDate?: string;
}

export interface CreateSubscription {
    Subscription: Subscription;
}

export interface UpdateSubscription {
    Subscription: Partial<Subscription> & { AccountId: number };
}

export interface GetSubscriptionRequest {
    AccountId: number;
    ResellerContext?: number;
}

export interface GetSubscriptionsRequest {
    AccountId: number;
    IncludeChildNodes?: boolean;
    ResellerContext?: number;
}

export interface TerminateAccountRequest {
    AccountId: number;
    Reason?: string;
}

// ============================================================================
// Credit Limit Types
// ============================================================================

export interface SimpleCreditLimitRecord {
    AccountId: number;
    Limit: number;
    Usage: number;
    Remaining: number;
}

export interface SetCreditLimitRequest {
    AccountId: number;
    CreditLimit?: number;
}

export interface GetCreditLimitRequest {
    AccountId: number;
}

// ============================================================================
// Report Types
// ============================================================================

export interface ReportParameter {
    Name: string;
    Value: string;
}

export interface Report {
    Name: string;
    Description?: string;
    Parameters?: ReportParameter[];
}

export interface ExecuteReportRequest {
    ReportName: string;
    Parameters?: ReportParameter[];
}

export interface ReportResult {
    Data: any;
    Columns?: string[];
}

// ============================================================================
// Error Types
// ============================================================================

export interface AlsoApiError {
    message: string;
    statusCode?: number;
    details?: any;
}

// ============================================================================
// Session Management
// ============================================================================

export interface SessionInfo {
    token: string;
    createdAt: Date;
    expiresAt: Date;
}
