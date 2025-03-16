import { LoginResponse } from "./authApi";

/**
 * Mock login response for administrative user
 */
export const mockAdminLoginResponse: LoginResponse = {
  "message": "Success",
  "user": {
    "id": "20626",
    "email": "test+admin@yopmail.com",
    "first_name": "Test",
    "last_name": "Admin",
    "phone_number": null,
    "status": "ACTIVE",
    "date_joined": "2024-09-20 04:44:32.878",
    "password_last_changed": "2024-09-20 04:45:32.543",
    "url": null,
    "last_active": "2025-03-16 01:27:39.009",
    "terms_accepted": true,
    "otp": null,
    "user_group": "ADMINISTRATOR"
  },
  "view": {
    "type": "ADMIN",
    "access": null,
    "accesses": [
      {
        "store_id": null,
        "user_id": 20626,
        "role_id": 5
      }
    ],
    "viewToggles": {
      "id": 6,
      "role_id": 5,
      "view_type": "ADMIN",
      "clients": true,
      "revive": false,
      "postal": false,
      "overview": false,
      "delivery_integration": false,
      "traffic_integration": false,
      "s3_integration": true,
      "webhook_source_integration": true,
      "google_integration": true,
      "subscription": false,
      "billing": false,
      "events": true,
      "contacts": false,
      "members": false,
      "administrators": true,
      "widget_setting": false,
      "default_widget_setting": true,
      "b2b_widgets": true,
      "switch_role": true,
      "list_segment": false
    }
  },
  "accesses": [
    {
      "store_id": null,
      "user_id": 20626,
      "role_id": 5
    }
  ],
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjA2MjYsImVtYWlsIjoidGVzdCthZG1pbkB5b3BtYWlsLmNvbSIsInBhc3N3b3JkX2xhc3RfY2hhbmdlZCI6IjIwMjQtMDktMjAgMDQ6NDU6MzIuNTQzIiwiaWF0IjoxNzQyMDg4NzI3LCJleHAiOjE3NDQ2ODA3Mjd9.6G9zB5ja7sXQCwwMtNS2VGUpNip6f5Qmm45Eofu4Jtw",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjA2MjYsImVtYWlsIjoidGVzdCthZG1pbkB5b3BtYWlsLmNvbSIsInBhc3N3b3JkX2xhc3RfY2hhbmdlZCI6IjIwMjQtMDktMjAgMDQ6NDU6MzIuNTQzIiwiaWF0IjoxNzQyMDg4NzI3LCJleHAiOjE3NzM2MjQ3Mjd9.rFMpEO9UkfvurFjuGYGt7kgIswUcS0HVzQIQqIqKE6w"
  }
}; 