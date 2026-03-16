CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email CITEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id),
  role_id BIGINT NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE companies (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  tax_id VARCHAR(20),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE operators (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE teams (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  name VARCHAR(120) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE sellers (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES companies(id),
  team_id BIGINT REFERENCES teams(id),
  external_code VARCHAR(80),
  full_name VARCHAR(200) NOT NULL,
  normalized_name VARCHAR(200),
  cpf VARCHAR(11),
  email VARCHAR(200),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE import_templates (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  import_type VARCHAR(50) NOT NULL,
  company_id BIGINT REFERENCES companies(id),
  operator_id BIGINT REFERENCES operators(id),
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE mapped_columns (
  id BIGSERIAL PRIMARY KEY,
  template_id BIGINT NOT NULL REFERENCES import_templates(id) ON DELETE CASCADE,
  source_column VARCHAR(200) NOT NULL,
  target_field VARCHAR(100) NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE imports (
  id BIGSERIAL PRIMARY KEY,
  source_type VARCHAR(50) NOT NULL,
  company_id BIGINT REFERENCES companies(id),
  operator_id BIGINT REFERENCES operators(id),
  template_id BIGINT REFERENCES import_templates(id),
  status VARCHAR(40) NOT NULL,
  started_by BIGINT REFERENCES users(id),
  total_read INTEGER NOT NULL DEFAULT 0,
  total_valid INTEGER NOT NULL DEFAULT 0,
  total_rejected INTEGER NOT NULL DEFAULT 0,
  total_error INTEGER NOT NULL DEFAULT 0,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE import_files (
  id BIGSERIAL PRIMARY KEY,
  import_id BIGINT NOT NULL REFERENCES imports(id) ON DELETE CASCADE,
  original_name VARCHAR(255) NOT NULL,
  storage_key TEXT NOT NULL,
  mime_type VARCHAR(120),
  file_size_bytes BIGINT,
  file_hash VARCHAR(128),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE raw_sales (
  id BIGSERIAL PRIMARY KEY,
  import_id BIGINT NOT NULL REFERENCES imports(id),
  row_number INTEGER NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  raw_payload JSONB NOT NULL,
  source_hash VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (import_id, row_number)
);

CREATE TABLE normalized_sales (
  id BIGSERIAL PRIMARY KEY,
  raw_sale_id BIGINT NOT NULL UNIQUE REFERENCES raw_sales(id) ON DELETE CASCADE,
  company_id BIGINT REFERENCES companies(id),
  operator_id BIGINT REFERENCES operators(id),
  seller_id BIGINT REFERENCES sellers(id),
  source_type VARCHAR(50) NOT NULL,
  cpf VARCHAR(11),
  customer_name VARCHAR(200),
  customer_name_normalized VARCHAR(200),
  phone_e164 VARCHAR(20),
  contract_code VARCHAR(80),
  sale_date DATE,
  installation_date DATE,
  status_raw VARCHAR(120),
  status_normalized VARCHAR(60),
  plan_name VARCHAR(200),
  plan_value NUMERIC(12,2),
  commission_base_value NUMERIC(12,2),
  city VARCHAR(120),
  state CHAR(2),
  completeness_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  normalization_version INTEGER NOT NULL DEFAULT 1,
  normalized_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE status_history (
  id BIGSERIAL PRIMARY KEY,
  normalized_sale_id BIGINT NOT NULL REFERENCES normalized_sales(id) ON DELETE CASCADE,
  status_code VARCHAR(60) NOT NULL,
  status_date TIMESTAMPTZ NOT NULL,
  source_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE reconciliation_rules (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  version INTEGER NOT NULL,
  priority INTEGER NOT NULL,
  layer VARCHAR(30) NOT NULL,
  config JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name, version)
);

CREATE TABLE reconciliation_runs (
  id BIGSERIAL PRIMARY KEY,
  import_id BIGINT REFERENCES imports(id),
  status VARCHAR(40) NOT NULL,
  started_by BIGINT REFERENCES users(id),
  rules_snapshot JSONB NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE reconciliations (
  id BIGSERIAL PRIMARY KEY,
  reconciliation_run_id BIGINT NOT NULL REFERENCES reconciliation_runs(id) ON DELETE CASCADE,
  normalized_sale_id BIGINT NOT NULL REFERENCES normalized_sales(id),
  matched_sale_id BIGINT REFERENCES normalized_sales(id),
  status VARCHAR(40) NOT NULL,
  match_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  applied_rule_id BIGINT REFERENCES reconciliation_rules(id),
  matched_fields JSONB NOT NULL DEFAULT '{}'::JSONB,
  divergences JSONB NOT NULL DEFAULT '[]'::JSONB,
  explanation JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE duplicate_groups (
  id BIGSERIAL PRIMARY KEY,
  identity_key VARCHAR(255) NOT NULL,
  cpf VARCHAR(11),
  customer_name VARCHAR(200),
  record_count INTEGER NOT NULL DEFAULT 0,
  suggested_primary_sale_id BIGINT REFERENCES normalized_sales(id),
  conflict_summary JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE duplicate_items (
  id BIGSERIAL PRIMARY KEY,
  duplicate_group_id BIGINT NOT NULL REFERENCES duplicate_groups(id) ON DELETE CASCADE,
  normalized_sale_id BIGINT NOT NULL REFERENCES normalized_sales(id),
  priority_score NUMERIC(6,2) NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  resolution_status VARCHAR(40) NOT NULL DEFAULT 'pending',
  UNIQUE (duplicate_group_id, normalized_sale_id)
);

CREATE TABLE duplicate_decisions (
  id BIGSERIAL PRIMARY KEY,
  duplicate_group_id BIGINT NOT NULL REFERENCES duplicate_groups(id),
  chosen_sale_id BIGINT NOT NULL REFERENCES normalized_sales(id),
  decided_by BIGINT NOT NULL REFERENCES users(id),
  justification TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE commission_rules (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  company_id BIGINT REFERENCES companies(id),
  operator_id BIGINT REFERENCES operators(id),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE commission_rule_versions (
  id BIGSERIAL PRIMARY KEY,
  commission_rule_id BIGINT NOT NULL REFERENCES commission_rules(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  effective_start DATE NOT NULL,
  effective_end DATE,
  config JSONB NOT NULL,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (commission_rule_id, version)
);

CREATE TABLE commission_calculations (
  id BIGSERIAL PRIMARY KEY,
  reference_period DATE NOT NULL,
  company_id BIGINT REFERENCES companies(id),
  operator_id BIGINT REFERENCES operators(id),
  status VARCHAR(40) NOT NULL,
  triggered_by BIGINT REFERENCES users(id),
  rules_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

CREATE TABLE commission_items (
  id BIGSERIAL PRIMARY KEY,
  commission_calculation_id BIGINT NOT NULL REFERENCES commission_calculations(id) ON DELETE CASCADE,
  normalized_sale_id BIGINT NOT NULL REFERENCES normalized_sales(id),
  seller_id BIGINT REFERENCES sellers(id),
  commission_rule_version_id BIGINT REFERENCES commission_rule_versions(id),
  commission_status VARCHAR(40) NOT NULL,
  commissionable_value NUMERIC(12,2) NOT NULL DEFAULT 0,
  commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  block_reason VARCHAR(255),
  explanation JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE manual_adjustments (
  id BIGSERIAL PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  adjustment_type VARCHAR(50) NOT NULL,
  before_payload JSONB NOT NULL,
  after_payload JSONB NOT NULL,
  justification TEXT NOT NULL,
  created_by BIGINT NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id BIGINT REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sellers_company_team ON sellers (company_id, team_id);
CREATE INDEX idx_imports_status_created_at ON imports (status, created_at DESC);
CREATE INDEX idx_raw_sales_import_id ON raw_sales (import_id);
CREATE INDEX idx_raw_sales_source_hash ON raw_sales (source_hash);
CREATE INDEX idx_normalized_sales_cpf ON normalized_sales (cpf);
CREATE INDEX idx_normalized_sales_contract_code ON normalized_sales (contract_code);
CREATE INDEX idx_normalized_sales_phone_e164 ON normalized_sales (phone_e164);
CREATE INDEX idx_normalized_sales_sale_date ON normalized_sales (sale_date);
CREATE INDEX idx_normalized_sales_operator_company ON normalized_sales (operator_id, company_id);
CREATE INDEX idx_normalized_sales_status_norm ON normalized_sales (status_normalized);
CREATE INDEX idx_status_history_sale_date ON status_history (normalized_sale_id, status_date DESC);
CREATE INDEX idx_reconciliations_sale_status ON reconciliations (normalized_sale_id, status);
CREATE INDEX idx_duplicate_groups_identity_key ON duplicate_groups (identity_key);
CREATE INDEX idx_duplicate_items_group_status ON duplicate_items (duplicate_group_id, resolution_status);
CREATE INDEX idx_commission_items_calc_seller ON commission_items (commission_calculation_id, seller_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id, created_at DESC);
