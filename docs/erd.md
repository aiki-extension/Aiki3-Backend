```mermaid
erDiagram
    users {
        int id PK
        string email_hashed
        string password
        datetime created_at
        int invite_code_id FK
        boolean is_research_participant
        int daily_learning_goal
        int reward_time_minutes
        int session_duration_minutes
        datetime last_active
        time operating_hours_start
        time operating_hours_end
    }

    invite_codes {
        int id PK
        string code UQ
        boolean is_active
    }

    websites {
        int id PK
        string domain UQ
    }

    user_time_wasting_sites {
        int user_id FK
        int website_id FK
    }

    user_learning_sites {
        int user_id FK
        int website_id FK
    }

    site_sessions {
        int id PK
        int user_id FK
        int website_id FK
        int triggered_by_site_id FK
        datetime session_start
        datetime session_end
    }

    user_behavior_logs {
        bigint id PK
        int user_id FK
        datetime occurred_at
        varchar category
        varchar action
    }

    invite_codes o|--o{ users : "has"
    users ||--o{ user_time_wasting_sites : "has"
    users ||--o{ user_learning_sites : "has"
    websites ||--o{ user_time_wasting_sites : "categorized as"
    websites ||--o{ user_learning_sites : "categorized as"
    users ||--o{ site_sessions : "has"
    websites ||--o{ site_sessions : "visited in"
    websites ||--o{ site_sessions : "triggered"
    users ||--o{ user_behavior_logs : "has"
```