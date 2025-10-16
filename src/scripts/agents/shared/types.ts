/**
 * Shared TypeScript types for the multi-agent cleanup system
 */

export interface QuarantineSession {
  id: string;
  agent: "backend" | "frontend" | "shared";
  timestamp: string;
  duration_ms: number;
  files_quarantined: number;
  size_recovered_bytes: number;
  status: "running" | "completed" | "failed" | "cancelled";
  quarantine_dir: string;
  rollback_script: string;
  manifest: QuarantineManifest;
  possible_breaks: PossibleBreak[];
  errors: string[];
}

export interface QuarantineManifest {
  session_id: string;
  created_at: string;
  agent: string;
  files: QuarantinedFile[];
  usage_map: UsageMap;
  summary: {
    total_files: number;
    total_size_bytes: number;
    categories: Record<string, number>;
    risk_levels: Record<string, number>;
  };
}

export interface QuarantinedFile {
  original_path: string;
  quarantine_path: string;
  file_hash: string;
  size_bytes: number;
  reason: string;
  category: "mock" | "seed" | "test" | "unused" | "duplicate" | "obsolete";
  risk_level: "safe" | "needs-review" | "dangerous";
  dependencies: string[];
  dependents: string[];
  moved_at: string;
  metadata: Record<string, any>;
}

export interface UsageMap {
  [filePath: string]: {
    imports: string[];
    exports: string[];
    dependents: string[];
    is_shared: boolean;
    usage_count: number;
  };
}

export interface PossibleBreak {
  file_path: string;
  break_type:
    | "import_error"
    | "runtime_error"
    | "missing_export"
    | "database_error";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  affected_files: string[];
  suggested_fix?: string;
}

export interface AgentConfig {
  name: string;
  id: string;
  description: string;
  scope: string[];
  preconditions: string[];
  tasks: AgentTask[];
  conflictResolution: {
    onApiShared: string;
    onDbDependence: string;
  };
  outputs: {
    quarantineDir: string;
    report: string;
    logEntry: string;
    usageMap: string;
  };
}

export interface AgentTask {
  step: number;
  action: string;
  detail: string;
}

export interface LockInfo {
  agent_id: string;
  timestamp: string;
  pid: number;
  status: "active" | "stale";
}

export interface DatabaseTable {
  name: string;
  exists: boolean;
  row_count?: number;
  last_accessed?: string;
  is_production: boolean;
}

export interface DependencyNode {
  file_path: string;
  imports: string[];
  exports: string[];
  dependents: string[];
  is_entry_point: boolean;
  is_shared: boolean;
  risk_score: number;
}

export interface AnalysisResult {
  candidates: QuarantineCandidate[];
  dependency_graph: DependencyNode[];
  database_tables: DatabaseTable[];
  usage_map: UsageMap;
  possible_breaks: PossibleBreak[];
}

export interface QuarantineCandidate {
  file_path: string;
  reason: string;
  category: string;
  risk_level: "safe" | "needs-review" | "dangerous";
  confidence: number;
  dependencies: string[];
  dependents: string[];
  metadata: Record<string, any>;
}

export interface CleanupLog {
  version: string;
  created_at: string;
  sessions: QuarantineSession[];
  total_files_quarantined: number;
  total_size_recovered: number;
  agents: {
    [agent: string]: {
      sessions: number;
      files_quarantined: number;
      last_run: string | null;
    };
  };
}

export interface AgentOptions {
  dryRun: boolean;
  verbose: boolean;
  skipDbCheck: boolean;
  force: boolean;
  quarantineDir?: string;
  configPath?: string;
}
