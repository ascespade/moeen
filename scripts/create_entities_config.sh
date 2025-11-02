#!/usr/bin/env bash
#
# create_entities_config.sh
# إنشاء ملف إعدادات Cursor Cloud Entities
#

CONFIG_FILE="cursor_cloud_entities.json"

cat > "$CONFIG_FILE" <<'EOF'
{
  "entities": {
    "code_agent": {
      "id": "entity_001",
      "name": "Code Agent",
      "type": "code",
      "enabled": true,
      "config": {
        "focus": ["src/app", "src/components"],
        "tasks": ["fix_errors", "refactor", "optimize"],
        "auto_commit": false,
        "notify_on_complete": true
      },
      "communication": {
        "can_receive": ["entity_002", "entity_003", "entity_004"],
        "can_send": ["entity_002", "entity_003", "entity_004"],
        "priority": "high"
      }
    },
    "docs_agent": {
      "id": "entity_002",
      "name": "Documentation Agent",
      "type": "documentation",
      "enabled": true,
      "config": {
        "focus": ["docs", "README.md", "*.md"],
        "tasks": ["update_docs", "generate_docs", "validate_links"],
        "auto_commit": false,
        "notify_on_complete": true
      },
      "communication": {
        "can_receive": ["entity_001", "entity_003", "entity_004"],
        "can_send": ["entity_001", "entity_003", "entity_004"],
        "priority": "medium"
      }
    },
    "test_agent": {
      "id": "entity_003",
      "name": "Testing Agent",
      "type": "testing",
      "enabled": true,
      "config": {
        "focus": ["tests", "**/*.spec.ts", "**/*.test.ts"],
        "tasks": ["run_tests", "fix_tests", "write_tests"],
        "auto_commit": false,
        "notify_on_complete": true
      },
      "communication": {
        "can_receive": ["entity_001", "entity_002", "entity_004"],
        "can_send": ["entity_001", "entity_002", "entity_004"],
        "priority": "high"
      }
    },
    "audit_agent": {
      "id": "entity_004",
      "name": "Audit Agent",
      "type": "audit",
      "enabled": true,
      "config": {
        "focus": ["src", "*.config.*", "package.json"],
        "tasks": ["code_quality", "security_audit", "performance_check"],
        "auto_commit": false,
        "notify_on_complete": true
      },
      "communication": {
        "can_receive": ["entity_001", "entity_002", "entity_003"],
        "can_send": ["entity_001", "entity_002", "entity_003"],
        "priority": "medium"
      }
    }
  },
  "coordination": {
    "shared_workspace": true,
    "communication_channel": "workspace",
    "conflict_resolution": "priority_based",
    "log_directory": ".cursor_entities_logs"
  }
}
EOF

echo "✅ تم إنشاء ملف الإعدادات: $CONFIG_FILE"
echo ""
echo "الآن يمكنك استخدام:"
echo "  ./scripts/manage_cursor_entities.sh start all"
