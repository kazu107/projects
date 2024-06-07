/**
 * This file has no copyright assigned and is placed in the Public Domain.
 * This file is part of the mingw-w64 runtime package.
 * No warranty is given; refer to the file DISCLAIMER.PD within this package.
 */

#ifndef _WEBAUTHN_H_
#define _WEBAUTHN_H_

#include <winapifamily.h>

#if WINAPI_FAMILY_PARTITION(WINAPI_PARTITION_APP)

#ifdef __cplusplus
extern "C" {
#endif

#ifndef WINAPI
#if defined(_ARM_)
#define WINAPI
#else
#define WINAPI __stdcall
#endif
#endif

#ifndef INITGUID
#define INITGUID
#include <guiddef.h>
#undef INITGUID
#else
#include <guiddef.h>
#endif

#define WEBAUTHN_API_VERSION_1 1
#define WEBAUTHN_API_VERSION_2 2
#define WEBAUTHN_API_VERSION_3 3
#define WEBAUTHN_API_CURRENT_VERSION WEBAUTHN_API_VERSION_3

#define WEBAUTHN_RP_ENTITY_INFORMATION_CURRENT_VERSION 1

typedef struct _WEBAUTHN_RP_ENTITY_INFORMATION {
  DWORD dwVersion;
  PCWSTR pwszId;
  PCWSTR pwszName;
  PCWSTR pwszIcon;
} WEBAUTHN_RP_ENTITY_INFORMATION, *PWEBAUTHN_RP_ENTITY_INFORMATION;
typedef const WEBAUTHN_RP_ENTITY_INFORMATION *PCWEBAUTHN_RP_ENTITY_INFORMATION;

#define WEBAUTHN_MAX_USER_ID_LENGTH 64

#define WEBAUTHN_USER_ENTITY_INFORMATION_CURRENT_VERSION 1

typedef struct _WEBAUTHN_USER_ENTITY_INFORMATION {
  DWORD dwVersion;
  DWORD cbId;
  PBYTE pbId;
  PCWSTR pwszName;
  PCWSTR pwszIcon;
  PCWSTR pwszDisplayName;
} WEBAUTHN_USER_ENTITY_INFORMATION, *PWEBAUTHN_USER_ENTITY_INFORMATION;
typedef const WEBAUTHN_USER_ENTITY_INFORMATION *PCWEBAUTHN_USER_ENTITY_INFORMATION;

#define WEBAUTHN_HASH_ALGORITHM_SHA_256 L"SHA-256"
#define WEBAUTHN_HASH_ALGORITHM_SHA_384 L"SHA-384"
#define WEBAUTHN_HASH_ALGORITHM_SHA_512 L"SHA-512"

#define WEBAUTHN_CLIENT_DATA_CURRENT_VERSION 1

typedef struct _WEBAUTHN_CLIENT_DATA {
  DWORD dwVersion;
  DWORD cbClientDataJSON;
  PBYTE pbClientDataJSON;
  LPCWSTR pwszHashAlgId;
} WEBAUTHN_CLIENT_DATA, *PWEBAUTHN_CLIENT_DATA;
typedef const WEBAUTHN_CLIENT_DATA *PCWEBAUTHN_CLIENT_DATA;

#define WEBAUTHN_CREDENTIAL_TYPE_PUBLIC_KEY L"public-key"

#define WEBAUTHN_COSE_ALGORITHM_ECDSA_P256_WITH_SHA256 -7
#define WEBAUTHN_COSE_ALGORITHM_ECDSA_P384_WITH_SHA384 -35
#define WEBAUTHN_COSE_ALGORITHM_ECDSA_P521_WITH_SHA512 -36

#define WEBAUTHN_COSE_ALGORITHM_RSASSA_PKCS1_V1_5_WITH_SHA256 -257
#define WEBAUTHN_COSE_ALGORITHM_RSASSA_PKCS1_V1_5_WITH_SHA384 -258
#define WEBAUTHN_COSE_ALGORITHM_RSASSA_PKCS1_V1_5_WITH_SHA512 -259

#define WEBAUTHN_COSE_ALGORITHM_RSA_PSS_WITH_SHA256 -37
#define WEBAUTHN_COSE_ALGORITHM_RSA_PSS_WITH_SHA384 -38
#define WEBAUTHN_COSE_ALGORITHM_RSA_PSS_WITH_SHA512 -39

#define WEBAUTHN_COSE_CREDENTIAL_PARAMETER_CURRENT_VERSION 1

typedef struct _WEBAUTHN_COSE_CREDENTIAL_PARAMETER {
  DWORD dwVersion;
  LPCWSTR pwszCredentialType;
  LONG lAlg;
} WEBAUTHN_COSE_CREDENTIAL_PARAMETER, *PWEBAUTHN_COSE_CREDENTIAL_PARAMETER;
typedef const WEBAUTHN_COSE_CREDENTIAL_PARAMETER *PCWEBAUTHN_COSE_CREDENTIAL_PARAMETER;

typedef struct _WEBAUTHN_COSE_CREDENTIAL_PARAMETERS {
  DWORD cCredentialParameters;
  PWEBAUTHN_COSE_CREDENTIAL_PARAMETER pCredentialParameters;
} WEBAUTHN_COSE_CREDENTIAL_PARAMETERS, *PWEBAUTHN_COSE_CREDENTIAL_PARAMETERS;
typedef const WEBAUTHN_COSE_CREDENTIAL_PARAMETERS *PCWEBAUTHN_COSE_CREDENTIAL_PARAMETERS;

#define WEBAUTHN_CREDENTIAL_CURRENT_VERSION 1

typedef struct _WEBAUTHN_CREDENTIAL {
  DWORD dwVersion;
  DWORD cbId;
  PBYTE pbId;
  LPCWSTR pwszCredentialType;
} WEBAUTHN_CREDENTIAL, *PWEBAUTHN_CREDENTIAL;
typedef const WEBAUTHN_CREDENTIAL *PCWEBAUTHN_CREDENTIAL;

typedef struct _WEBAUTHN_CREDENTIALS {
  DWORD cCredentials;
  PWEBAUTHN_CREDENTIAL pCredentials;
} WEBAUTHN_CREDENTIALS, *PWEBAUTHN_CREDENTIALS;
typedef const WEBAUTHN_CREDENTIALS *PCWEBAUTHN_CREDENTIALS;

#define WEBAUTHN_CTAP_TRANSPORT_USB 0x00000001
#define WEBAUTHN_CTAP_TRANSPORT_NFC 0x00000002
#define WEBAUTHN_CTAP_TRANSPORT_BLE 0x00000004
#define WEBAUTHN_CTAP_TRANSPORT_TEST 0x00000008
#define WEBAUTHN_CTAP_TRANSPORT_INTERNAL 0x00000010
#define WEBAUTHN_CTAP_TRANSPORT_FLAGS_MASK 0x0000001F

#define WEBAUTHN_CREDENTIAL_EX_CURRENT_VERSION 1

typedef struct _WEBAUTHN_CREDENTIAL_EX {
  DWORD dwVersion;
  DWORD cbId;
  PBYTE pbId;
  LPCWSTR pwszCredentialType;
  DWORD dwTransports;
} WEBAUTHN_CREDENTIAL_EX, *PWEBAUTHN_CREDENTIAL_EX;
typedef const WEBAUTHN_CREDENTIAL_EX *PCWEBAUTHN_CREDENTIAL_EX;

typedef struct _WEBAUTHN_CREDENTIAL_LIST {
  DWORD cCredentials;
  PWEBAUTHN_CREDENTIAL_EX *ppCredentials;
} WEBAUTHN_CREDENTIAL_LIST, *PWEBAUTHN_CREDENTIAL_LIST;
typedef const WEBAUTHN_CREDENTIAL_LIST *PCWEBAUTHN_CREDENTIAL_LIST;

#define WEBAUTHN_EXTENSIONS_IDENTIFIER_HMAC_SECRET L"hmac-secret"

#define WEBAUTHN_USER_VERIFICATION_ANY 0
#define WEBAUTHN_USER_VERIFICATION_OPTIONAL 1
#define WEBAUTHN_USER_VERIFICATION_OPTIONAL_WITH_CREDENTIAL_ID_LIST 2
#define WEBAUTHN_USER_VERIFICATION_REQUIRED 3

typedef struct _WEBAUTHN_CRED_PROTECT_EXTENSION_IN {
  DWORD dwCredProtect;
  WINBOOL bRequireCredProtect;
} WEBAUTHN_CRED_PROTECT_EXTENSION_IN, *PWEBAUTHN_CRED_PROTECT_EXTENSION_IN;
typedef const WEBAUTHN_CRED_PROTECT_EXTENSION_IN *PCWEBAUTHN_CRED_PROTECT_EXTENSION_IN;

#define WEBAUTHN_EXTENSIONS_IDENTIFIER_CRED_PROTECT L"credProtect"

typedef struct _WEBAUTHN_CRED_BLOB_EXTENSION {
  DWORD cbCredBlob;
  PBYTE pbCredBlob;
} WEBAUTHN_CRED_BLOB_EXTENSION, *PWEBAUTHN_CRED_BLOB_EXTENSION;
typedef const WEBAUTHN_CRED_BLOB_EXTENSION *PCWEBAUTHN_CRED_BLOB_EXTENSION;

#define WEBAUTHN_EXTENSIONS_IDENTIFIER_CRED_BLOB L"credBlob"

#define WEBAUTHN_EXTENSIONS_IDENTIFIER_MIN_PIN_LENGTH L"minPinLength"

typedef struct _WEBAUTHN_EXTENSION {
  LPCWSTR pwszExtensionIdentifier;
  DWORD cbExtension;
  PVOID pvExtension;
} WEBAUTHN_EXTENSION, *PWEBAUTHN_EXTENSION;
typedef const WEBAUTHN_EXTENSION *PCWEBAUTHN_EXTENSION;

typedef struct _WEBAUTHN_EXTENSIONS {
  DWORD cExtensions;
  PWEBAUTHN_EXTENSION pExtensions;
} WEBAUTHN_EXTENSIONS, *PWEBAUTHN_EXTENSIONS;
typedef const WEBAUTHN_EXTENSIONS *PCWEBAUTHN_EXTENSIONS;

#define WEBAUTHN_AUTHENTICATOR_ATTACHMENT_ANY 0
#define WEBAUTHN_AUTHENTICATOR_ATTACHMENT_PLATFORM 1
#define WEBAUTHN_AUTHENTICATOR_ATTACHMENT_CROSS_PLATFORM 2
#define WEBAUTHN_AUTHENTICATOR_ATTACHMENT_CROSS_PLATFORM_U2F_V2 3

#define WEBAUTHN_USER_VERIFICATION_REQUIREMENT_ANY 0
#define WEBAUTHN_USER_VERIFICATION_REQUIREMENT_REQUIRED 1
#define WEBAUTHN_USER_VERIFICATION_REQUIREMENT_PREFERRED 2
#define WEBAUTHN_USER_VERIFICATION_REQUIREMENT_DISCOURAGED 3

#define WEBAUTHN_ATTESTATION_CONVEYANCE_PREFERENCE_ANY 0
#define WEBAUTHN_ATTESTATION_CONVEYANCE_PREFERENCE_NONE 1
#define WEBAUTHN_ATTESTATION_CONVEYANCE_PREFERENCE_INDIRECT 2
#define WEBAUTHN_ATTESTATION_CONVEYANCE_PREFERENCE_DIRECT 3

#define WEBAUTHN_ENTERPRISE_ATTESTATION_NONE 0
#define WEBAUTHN_ENTERPRISE_ATTESTATION_VENDOR_FACILITATED 1
#define WEBAUTHN_ENTERPRISE_ATTESTATION_PLATFORM_MANAGED 2

#define WEBAUTHN_LARGE_BLOB_SUPPORT_NONE 0
#define WEBAUTHN_LARGE_BLOB_SUPPORT_REQUIRED 1
#define WEBAUTHN_LARGE_BLOB_SUPPORT_PREFERRED 2

#define WEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS_VERSION_1 1
#define WEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS_VERSION_2 2
#define WEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS_VERSION_3 3
#define WEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS_VERSION_4 4
#define WEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS_CURRENT_VERSION WEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS_VERSION_4

typedef struct _WEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS {
  DWORD dwVersion;
  DWORD dwTimeoutMilliseconds;
  WEBAUTHN_CREDENTIALS CredentialList;
  WEBAUTHN_EXTENSIONS Extensions;
  DWORD dwAuthenticatorAttachment;
  WINBOOL bRequireResidentKey;
  DWORD dwUserVerificationRequirement;
  DWORD dwAttestationConveyancePreference;
  DWORD dwFlags;
  GUID *pCancellationId;
  PWEBAUTHN_CREDENTIAL_LIST pExcludeCredentialList;
  DWORD dwEnterpriseAttestation;
  DWORD dwLargeBlobSupport;
  WINBOOL bPreferResidentKey;
} WEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS, *PWEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS;
typedef const WEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS *PCWEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS;

#define WEBAUTHN_CRED_LARGE_BLOB_OPERATION_NONE 0
#define WEBAUTHN_CRED_LARGE_BLOB_OPERATION_GET 1
#define WEBAUTHN_CRED_LARGE_BLOB_OPERATION_SET 2
#define WEBAUTHN_CRED_LARGE_BLOB_OPERATION_DELETE 3

#define WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS_VERSION_1 1
#define WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS_VERSION_2 2
#define WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS_VERSION_3 3
#define WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS_VERSION_4 4
#define WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS_VERSION_5 5
#define WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS_CURRENT_VERSION WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS_VERSION_5

typedef struct _WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS {
  DWORD dwVersion;
  DWORD dwTimeoutMilliseconds;
  WEBAUTHN_CREDENTIALS CredentialList;
  WEBAUTHN_EXTENSIONS Extensions;
  DWORD dwAuthenticatorAttachment;
  DWORD dwUserVerificationRequirement;
  DWORD dwFlags;
  PCWSTR pwszU2fAppId;
  WINBOOL *pbU2fAppId;
  GUID *pCancellationId;
  PWEBAUTHN_CREDENTIAL_LIST pAllowCredentialList;
  DWORD dwCredLargeBlobOperation;
  DWORD cbCredLargeBlob;
  PBYTE pbCredLargeBlob;
} WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS, *PWEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS;
typedef const WEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS *PCWEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS;

#define WEBAUTHN_ATTESTATION_DECODE_NONE 0
#define WEBAUTHN_ATTESTATION_DECODE_COMMON 1

#define WEBAUTHN_ATTESTATION_VER_TPM_2_0 L"2.0"

typedef struct _WEBAUTHN_X5C {
  DWORD cbData;
  PBYTE pbData;
} WEBAUTHN_X5C, *PWEBAUTHN_X5C;

#define WEBAUTHN_COMMON_ATTESTATION_CURRENT_VERSION 1

typedef struct _WEBAUTHN_COMMON_ATTESTATION {
  DWORD dwVersion;
  PCWSTR pwszAlg;
  LONG lAlg;
  DWORD cbSignature;
  PBYTE pbSignature;
  DWORD cX5c;
  PWEBAUTHN_X5C pX5c;
  PCWSTR pwszVer;
  DWORD cbCertInfo;
  PBYTE pbCertInfo;
  DWORD cbPubArea;
  PBYTE pbPubArea;
} WEBAUTHN_COMMON_ATTESTATION, *PWEBAUTHN_COMMON_ATTESTATION;
typedef const WEBAUTHN_COMMON_ATTESTATION *PCWEBAUTHN_COMMON_ATTESTATION;

#define WEBAUTHN_ATTESTATION_TYPE_PACKED L"packed"
#define WEBAUTHN_ATTESTATION_TYPE_U2F L"fido-u2f"
#define WEBAUTHN_ATTESTATION_TYPE_TPM L"tpm"
#define WEBAUTHN_ATTESTATION_TYPE_NONE L"none"

#define WEBAUTHN_CREDENTIAL_ATTESTATION_VERSION_1 1
#define WEBAUTHN_CREDENTIAL_ATTESTATION_VERSION_2 2
#define WEBAUTHN_CREDENTIAL_ATTESTATION_VERSION_3 3
#define WEBAUTHN_CREDENTIAL_ATTESTATION_VERSION_4 4
#define WEBAUTHN_CREDENTIAL_ATTESTATION_CURRENT_VERSION WEBAUTHN_CREDENTIAL_ATTESTATION_VERSION_4

typedef struct _WEBAUTHN_CREDENTIAL_ATTESTATION {
  DWORD dwVersion;
  PCWSTR pwszFormatType;
  DWORD cbAuthenticatorData;
  PBYTE pbAuthenticatorData;
  DWORD cbAttestation;
  PBYTE pbAttestation;
  DWORD dwAttestationDecodeType;
  PVOID pvAttestationDecode;
  DWORD cbAttestationObject;
  PBYTE pbAttestationObject;
  DWORD cbCredentialId;
  PBYTE pbCredentialId;
  WEBAUTHN_EXTENSIONS Extensions;
  DWORD dwUsedTransport;
  WINBOOL bEpAtt;
  WINBOOL bLargeBlobSupported;
  WINBOOL bResidentKey;
} WEBAUTHN_CREDENTIAL_ATTESTATION, *PWEBAUTHN_CREDENTIAL_ATTESTATION;
typedef const WEBAUTHN_CREDENTIAL_ATTESTATION *PCWEBAUTHN_CREDENTIAL_ATTESTATION;

#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_NONE 0
#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_SUCCESS 1
#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_NOT_SUPPORTED 2
#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_INVALID_DATA 3
#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_INVALID_PARAMETER 4
#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_NOT_FOUND 5
#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_MULTIPLE_CREDENTIALS 6
#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_LACK_OF_SPACE 7
#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_PLATFORM_ERROR 8
#define WEBAUTHN_CRED_LARGE_BLOB_STATUS_AUTHENTICATOR_ERROR 9

#define WEBAUTHN_ASSERTION_VERSION_1 1
#define WEBAUTHN_ASSERTION_VERSION_2 2
#define WEBAUTHN_ASSERTION_CURRENT_VERSION WEBAUTHN_ASSERTION_VERSION_2

typedef struct _WEBAUTHN_ASSERTION {
  DWORD dwVersion;
  DWORD cbAuthenticatorData;
  PBYTE pbAuthenticatorData;
  DWORD cbSignature;
  PBYTE pbSignature;
  WEBAUTHN_CREDENTIAL Credential;
  DWORD cbUserId;
  PBYTE pbUserId;
  WEBAUTHN_EXTENSIONS Extensions;
  DWORD cbCredLargeBlob;
  PBYTE pbCredLargeBlob;
  DWORD dwCredLargeBlobStatus;
} WEBAUTHN_ASSERTION, *PWEBAUTHN_ASSERTION;
typedef const WEBAUTHN_ASSERTION *PCWEBAUTHN_ASSERTION;

DWORD WINAPI WebAuthNGetApiVersionNumber(void);
HRESULT WINAPI WebAuthNIsUserVerifyingPlatformAuthenticatorAvailable(WINBOOL *pbIsUserVerifyingPlatformAuthenticatorAvailable);
HRESULT WINAPI WebAuthNAuthenticatorMakeCredential(HWND hWnd, PCWEBAUTHN_RP_ENTITY_INFORMATION pRpInformation, PCWEBAUTHN_USER_ENTITY_INFORMATION pUserInformation, PCWEBAUTHN_COSE_CREDENTIAL_PARAMETERS pPubKeyCredParams, PCWEBAUTHN_CLIENT_DATA pWebAuthNClientData, PCWEBAUTHN_AUTHENTICATOR_MAKE_CREDENTIAL_OPTIONS pWebAuthNMakeCredentialOptions, PWEBAUTHN_CREDENTIAL_ATTESTATION *ppWebAuthNCredentialAttestation);
HRESULT WINAPI WebAuthNAuthenticatorGetAssertion(HWND hWnd, LPCWSTR pwszRpId, PCWEBAUTHN_CLIENT_DATA pWebAuthNClientData, PCWEBAUTHN_AUTHENTICATOR_GET_ASSERTION_OPTIONS pWebAuthNGetAssertionOptions, PWEBAUTHN_ASSERTION *ppWebAuthNAssertion);
void WINAPI WebAuthNFreeCredentialAttestation(PWEBAUTHN_CREDENTIAL_ATTESTATION pWebAuthNCredentialAttestation);
void WINAPI WebAuthNFreeAssertion(PWEBAUTHN_ASSERTION pWebAuthNAssertion);
HRESULT WINAPI WebAuthNGetCancellationId(GUID* pCancellationId);
HRESULT WINAPI WebAuthNCancelCurrentOperation(const GUID* pCancellationId);
PCWSTR WINAPI WebAuthNGetErrorName(HRESULT hr);
HRESULT WINAPI WebAuthNGetW3CExceptionDOMError(HRESULT hr);

#ifdef __cplusplus
}
#endif

#endif /* WINAPI_FAMILY_PARTITION */

#endif /* _WEBAUTHN_H_ */
