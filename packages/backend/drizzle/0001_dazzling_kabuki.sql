-- Custom SQL migration file, put you code below! --
replace into credential_schema (id, schema_version, platform, credential_type, available, auto_refreshable, refresh_logic_type, refresh_logic, minimal_refresh_interval_in_sec, available_permissions, permissions, created_at, updated_at, status, created_by)
values  ('76b8f169-9805-44c0-8522-aaa02a12b398', 1, 'spotify', 'oauth', 1, 1, 'script', null, 0, '', '', 1728183428, 1728183067, 'ok', 'system'),
        ('1b20e9ad-c268-47be-b75b-032f276501d0', 1, 'steam', 'apikey', 1, 0, 'script', null, 0, '', '', 1728184360, 1728183067, 'ok', 'system'),
        ('25b6ce23-bbf3-4e57-bc20-a3f640eda67b', 1, 'github', 'pat', 1, 0, 'script', null, 0, '', '', 1728190111, 1728183067, 'ok', 'system');
--> statement-breakpoint
replace into credential_schema_fields (id, schema_id, schema_version, field_name, field_type, is_required, description, created_at, updated_at)
values  (1, '76b8f169-9805-44c0-8522-aaa02a12b398', 1, 'accessToken', 'string', 1, 'accessToken', 1728183428, 1728183428),
        (2, '76b8f169-9805-44c0-8522-aaa02a12b398', 1, 'refreshToken', 'string', 1, 'refreshToken', 1728183428, 1728183428),
        (3, '76b8f169-9805-44c0-8522-aaa02a12b398', 1, 'scopes', 'string', 0, 'scopes', 1728183428, 1728183428),
        (4, '1b20e9ad-c268-47be-b75b-032f276501d0', 1, 'apikey', 'string', 1, 'apikey', 1728184360, 1728184360),
        (5, '1b20e9ad-c268-47be-b75b-032f276501d0', 1, 'steamid', 'string', 0, 'steamid', 1728184360, 1728184360),
        (7, '25b6ce23-bbf3-4e57-bc20-a3f640eda67b', 1, 'token', 'string', 1, 'pat', 1728190111, 1728190111),
        (8, '25b6ce23-bbf3-4e57-bc20-a3f640eda67b', 1, 'username', 'string', 1, 'username', 1728190111, 1728190111);