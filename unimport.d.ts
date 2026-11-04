// @ts-nocheck
/* oxlint-disable */
export {}
declare global {
  const AppCookieManager: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/utils/cookies').AppCookieManager
  const AuthQueries: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/queries/auth.queries').AuthQueries
  const BaseQueries: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/queries/base.queries').BaseQueries
  const Button: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/components/ui/button').Button
  const CequreClient: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/client').CequreClient
  const CequreCore: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/client').CequreCore
  const CequreRealtimeClient: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/client').CequreRealtimeClient
  const CequreRealtimeCore: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/client').CequreRealtimeCore
  const GoogleBtn: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/components/ui/button').GoogleBtn
  const Icon: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/components/ui/icon').Icon
  const Input: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/components/ui/input').Input
  const Router: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/router').Router
  const ToastItem: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/index').ToastItem
  const Toaster: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/index').Toaster
  const clear: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').clear
  const createCequreClient: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/client').createCequreClient
  const createCequreRealtimeClient: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/client').createCequreRealtimeClient
  const dismiss: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').dismiss
  const error: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').error
  const info: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').info
  const loading: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').loading
  const notify: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').notify
  const paths: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/router').paths
  const pause: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').pause
  const promise: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').promise
  const resume: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').resume
  const sdkClient: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/index').sdkClient
  const show: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').show
  const success: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').success
  const toast: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').toast
  const toasts: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').toasts
  const useErrorToast: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/hooks/loader-error.hook').useErrorToast
  const warning: typeof import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/toast-store').warning
}
// for type re-export
declare global {
  // @ts-ignore
  export type { CequreCore, CequreRealtimeCore, CequreClient, CequreRealtimeClient, JSONValue, StreamAction, StreamEvent, SortOrder, FilterOperators, UploadedFile, CequreError, Admins, AdminsCreateInput, AdminsUpdateInput, AdminsPopulated, AdminsPopulatedDepth2, AdminsWhereInput, AdminsSortField, AdminsSort, AdminsQueryInput, PaginatedAdmins, PaginatedAdminsPopulated, PaginatedAdminsPopulatedDepth2, AdminsBulkCreateInput, AdminsBulkDeleteInput, AdminsBulkCreateResult, AdminsBulkDeleteResult, AdminsAuthResponse, AdminsRegisterInput, AdminsLoginInput, AdminsRefreshInput, AdminsForgotPasswordInput, AdminsResetPasswordInput, AdminsMfaVerifyInput, AdminsMfaLoginInput, AuthRegisterInput, AuthLoginInput, AuthResponse, AuthRefreshInput, AuthForgotPasswordInput, AuthResetPasswordInput, AuthMfaVerifyInput, AuthMfaLoginInput, Users, UsersCreateInput, UsersUpdateInput, UsersPopulated, UsersPopulatedDepth2, UsersWhereInput, UsersSortField, UsersSort, UsersQueryInput, PaginatedUsers, PaginatedUsersPopulated, PaginatedUsersPopulatedDepth2, UsersBulkCreateInput, UsersBulkDeleteInput, UsersBulkCreateResult, UsersBulkDeleteResult, UsersAuthResponse, UsersRegisterInput, UsersLoginInput, UsersRefreshInput, UsersForgotPasswordInput, UsersResetPasswordInput, UsersMfaVerifyInput, UsersMfaLoginInput, CequreJobs, CequreJobsCreateInput, CequreJobsUpdateInput, CequreJobsPopulated, CequreJobsPopulatedDepth2, CequreJobsWhereInput, CequreJobsSortField, CequreJobsSort, CequreJobsQueryInput, PaginatedCequreJobs, PaginatedCequreJobsPopulated, PaginatedCequreJobsPopulatedDepth2, CequreJobsBulkCreateInput, CequreJobsBulkDeleteInput, CequreJobsBulkCreateResult, CequreJobsBulkDeleteResult, CequrePasswordResets, CequrePasswordResetsCreateInput, CequrePasswordResetsUpdateInput, CequrePasswordResetsPopulated, CequrePasswordResetsPopulatedDepth2, CequrePasswordResetsWhereInput, CequrePasswordResetsSortField, CequrePasswordResetsSort, CequrePasswordResetsQueryInput, PaginatedCequrePasswordResets, PaginatedCequrePasswordResetsPopulated, PaginatedCequrePasswordResetsPopulatedDepth2, CequrePasswordResetsBulkCreateInput, CequrePasswordResetsBulkDeleteInput, CequrePasswordResetsBulkCreateResult, CequrePasswordResetsBulkDeleteResult, CequreEmailVerifications, CequreEmailVerificationsCreateInput, CequreEmailVerificationsUpdateInput, CequreEmailVerificationsPopulated, CequreEmailVerificationsPopulatedDepth2, CequreEmailVerificationsWhereInput, CequreEmailVerificationsSortField, CequreEmailVerificationsSort, CequreEmailVerificationsQueryInput, PaginatedCequreEmailVerifications, PaginatedCequreEmailVerificationsPopulated, PaginatedCequreEmailVerificationsPopulatedDepth2, CequreEmailVerificationsBulkCreateInput, CequreEmailVerificationsBulkDeleteInput, CequreEmailVerificationsBulkCreateResult, CequreEmailVerificationsBulkDeleteResult, CequreAuditLog, CequreAuditLogCreateInput, CequreAuditLogUpdateInput, CequreAuditLogPopulated, CequreAuditLogPopulatedDepth2, CequreAuditLogWhereInput, CequreAuditLogSortField, CequreAuditLogSort, CequreAuditLogQueryInput, PaginatedCequreAuditLog, PaginatedCequreAuditLogPopulated, PaginatedCequreAuditLogPopulatedDepth2, CequreAuditLogBulkCreateInput, CequreAuditLogBulkDeleteInput, CequreAuditLogBulkCreateResult, CequreAuditLogBulkDeleteResult, PostUsersMfaEnrollResponse, PostUsersMfaEnrollRequestBody, HealthResponse, HeadersInitLike, ClientHeaders, CequreClientConfig, SDKResponse, CequreRealtimeConfig, LiveQuerySubscription } from '/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/client'
  import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/client')
  // @ts-ignore
  export type { SDK } from '/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/index'
  import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/sdk/index')
  // @ts-ignore
  export type { ToastType, ToastPosition, ToastAction, ToastAnimationOptions, ToastOptions, Toast, DismissOptions, PromiseToastOptions, ToasterProps } from '/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/types'
  import('/Users/chijiokeudokporo/Desktop/allow-category/src/libs/toast/types')
  // @ts-ignore
  export type { AppCookieManager } from '/Users/chijiokeudokporo/Desktop/allow-category/src/utils/cookies'
  import('/Users/chijiokeudokporo/Desktop/allow-category/src/utils/cookies')
  // @ts-ignore
  export type { IconProps } from '/Users/chijiokeudokporo/Desktop/allow-category/src/components/ui/icon'
  import('/Users/chijiokeudokporo/Desktop/allow-category/src/components/ui/icon')
  // @ts-ignore
  export type { InputProps } from '/Users/chijiokeudokporo/Desktop/allow-category/src/components/ui/input'
  import('/Users/chijiokeudokporo/Desktop/allow-category/src/components/ui/input')
}