INSERT INTO roles (code, name)
VALUES
  ('administrador', 'Administrador'),
  ('gestor', 'Gestor'),
  ('operador', 'Operador'),
  ('auditor', 'Auditor'),
  ('financeiro_comissao', 'Financeiro / Comissao')
ON CONFLICT (code) DO NOTHING;

INSERT INTO users (id, email, password_hash, full_name, is_active)
VALUES
  (1, 'admin@teleconcilia.local', 'teleconcilia', 'Administrador TeleConcilia', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT 1, id
FROM roles
WHERE code IN ('administrador', 'auditor')
ON CONFLICT DO NOTHING;

INSERT INTO companies (id, name, tax_id, is_active)
VALUES
  (1, 'Conecta Sul', '11111111000111', TRUE),
  (2, 'Foco Telecom', '22222222000122', TRUE),
  (3, 'Nexa Fibra', '33333333000133', FALSE)
ON CONFLICT DO NOTHING;

INSERT INTO operators (id, name, code, is_active)
VALUES
  (1, 'Vivo', 'VIVO', TRUE),
  (2, 'Claro', 'CLARO', TRUE),
  (3, 'Tim', 'TIM', TRUE)
ON CONFLICT (code) DO NOTHING;

INSERT INTO teams (id, company_id, name, is_active)
VALUES
  (1, 1, 'Inside Sales Sul', TRUE),
  (2, 1, 'B2C Sul', TRUE),
  (3, 2, 'Field Regional', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO sellers (id, company_id, team_id, external_code, full_name, normalized_name, cpf, email, is_active)
VALUES
  (1, 1, 1, 'SEL001', 'Marina Costa', 'MARINA COSTA', '11111111111', 'marina@teleconcilia.local', TRUE),
  (2, 1, 2, 'SEL002', 'Carlos Neri', 'CARLOS NERI', '22222222222', 'carlos@teleconcilia.local', TRUE),
  (3, 2, 3, 'SEL003', 'Joana Luz', 'JOANA LUZ', '33333333333', 'joana@teleconcilia.local', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO imports (id, source_type, company_id, operator_id, status, started_by, total_read, total_valid, total_rejected, total_error, processing_time_ms)
VALUES
  (1, 'arquivo', 1, 1, 'processado', 1, 24876, 24102, 774, 0, 18240),
  (2, 'linha_a_linha', 1, 2, 'normalizado', 1, 33210, 32901, 309, 0, 26110),
  (3, 'vendas_internas', 2, 3, 'pendente_conciliacao', 1, 14520, 14520, 0, 0, 6120)
ON CONFLICT DO NOTHING;

INSERT INTO raw_sales (id, import_id, row_number, source_type, raw_payload, source_hash)
VALUES
  (1, 1, 1, 'arquivo', '{"cpf":"12345678901","cliente":"Ana Elzira de Sousa"}', 'raw_1'),
  (2, 1, 2, 'arquivo', '{"cpf":"32165498700","cliente":"Paulo Ricardo Mendes"}', 'raw_2'),
  (3, 2, 1, 'linha_a_linha', '{"cpf":"98765432100","cliente":"Luciana Pires"}', 'raw_3')
ON CONFLICT DO NOTHING;

INSERT INTO normalized_sales (
  id, raw_sale_id, company_id, operator_id, seller_id, source_type, cpf, customer_name,
  customer_name_normalized, phone_e164, contract_code, sale_date, installation_date,
  status_raw, status_normalized, plan_name, plan_value, commission_base_value, city, state,
  completeness_score, normalization_version
)
VALUES
  (1, 1, 1, 1, 1, 'arquivo', '12345678901', 'Ana Elzira de Sousa', 'ANA ELZIRA DE SOUSA', '5511999999999', 'CTR001', '2026-03-01', '2026-03-05', 'INSTALADA', 'instalada', 'Fibra 500', 129.90, 129.90, 'Sao Paulo', 'SP', 98, 1),
  (2, 2, 1, 2, 2, 'arquivo', '32165498700', 'Paulo Ricardo Mendes', 'PAULO RICARDO MENDES', '5511988888888', 'CTR002', '2026-03-02', '2026-03-06', 'INSTALADA', 'instalada', 'Fibra 700', 149.90, 149.90, 'Curitiba', 'PR', 97, 1),
  (3, 3, 2, 3, 3, 'linha_a_linha', '98765432100', 'Luciana Pires', 'LUCIANA PIRES', '5511977777777', 'CTR003', '2026-03-05', NULL, 'PENDENTE', 'pendente', 'Fibra 400', 99.90, 99.90, 'Campinas', 'SP', 91, 1)
ON CONFLICT DO NOTHING;

INSERT INTO reconciliation_rules (id, name, version, priority, layer, config, is_active, created_by)
VALUES
  (1, 'cpf_exato', 1, 1, 'exato', '{"fields":["cpf"]}', TRUE, 1),
  (2, 'cpf_data_aproximada', 1, 2, 'forte', '{"fields":["cpf","sale_date"]}', TRUE, 1),
  (3, 'nome_telefone', 1, 3, 'assistido', '{"fields":["customer_name","phone_e164"]}', TRUE, 1)
ON CONFLICT DO NOTHING;

INSERT INTO reconciliation_runs (id, import_id, status, started_by, rules_snapshot)
VALUES
  (1, 1, 'concluido', 1, '{"version":1}')
ON CONFLICT DO NOTHING;

INSERT INTO reconciliations (
  id, reconciliation_run_id, normalized_sale_id, matched_sale_id, status, match_score,
  applied_rule_id, matched_fields, divergences, explanation
)
VALUES
  (1, 1, 1, 1, 'divergente', 92, 2, '{"cpf":true,"sale_date":true}', '["instalacao ausente"]', '{"reason":"data_instalacao ausente no linha a linha"}'),
  (2, 1, 2, 2, 'conciliado', 100, 1, '{"cpf":true}', '[]', '{"reason":"cpf exato"}'),
  (3, 1, 3, 3, 'match_sugerido', 74, 3, '{"name":true,"phone":true}', '["status divergente"]', '{"reason":"nome e telefone semelhantes"}')
ON CONFLICT DO NOTHING;

INSERT INTO duplicate_groups (id, identity_key, cpf, customer_name, record_count, suggested_primary_sale_id, conflict_summary)
VALUES
  (1, '12345678901', '12345678901', 'Ana Elzira de Sousa', 2, 1, '{"level":"alto"}')
ON CONFLICT DO NOTHING;

INSERT INTO duplicate_items (id, duplicate_group_id, normalized_sale_id, priority_score, is_primary, resolution_status)
VALUES
  (1, 1, 1, 96, TRUE, 'pending'),
  (2, 1, 3, 58, FALSE, 'pending')
ON CONFLICT DO NOTHING;

INSERT INTO commission_calculations (id, reference_period, company_id, operator_id, status, triggered_by, rules_snapshot)
VALUES
  (1, '2026-03-01', 1, 1, 'concluido', 1, '{"version":1}')
ON CONFLICT DO NOTHING;

INSERT INTO commission_items (
  id, commission_calculation_id, normalized_sale_id, seller_id, commission_status,
  commissionable_value, commission_amount, block_reason, explanation
)
VALUES
  (1, 1, 1, 1, 'bloqueada', 129.90, 45.00, 'Divergencia de instalacao', '{"rule":"bloqueio por divergencia"}'),
  (2, 1, 2, 2, 'aprovada', 149.90, 52.00, NULL, '{"rule":"fixa aprovado"}'),
  (3, 1, 3, 3, 'pendente', 99.90, 35.00, NULL, '{"rule":"pendente revisao"}')
ON CONFLICT DO NOTHING;
