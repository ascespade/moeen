"use client";

import React from "react";
import { useState, useEffect } from "react";

interface TaskStatus {
  total_tasks: number;
  current_task: number;
  completed_tasks: number;
  failed_tasks: number;
  progress_percentage: number;
  status: string;
  last_update: string;
  estimated_completion: string;
}

interface AgentStatus {
  status: string;
  message: string;
  last_update: string;
  restart_count: number;
  mode: string;
}

interface CompletionStatus {
  status: string;
  completion_time: string;
  total_duration_seconds: number;
  total_duration_human: string;
  total_tasks: number;
  completed_tasks: number;
  failed_tasks: number;
  success_rate: string;
  message: string;
}

export default function AgentDashboard() {
  const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [completionStatus, setCompletionStatus] =
    useState<CompletionStatus | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      // Fetch task status
      const taskResponse = await fetch("/api/agent/tasks");
      if (taskResponse.ok) {
        const taskData = await taskResponse.json();
        setTaskStatus(taskData);
      }

      // Fetch agent status
      const agentResponse = await fetch("/api/agent/status");
      if (agentResponse.ok) {
        const agentData = await agentResponse.json();
        setAgentStatus(agentData);
      }

      // Fetch completion status
      const completionResponse = await fetch("/api/agent/completion");
      if (completionResponse.ok) {
        const completionData = await completionResponse.json();
        setCompletionStatus(completionData);
      }

      // Fetch recent logs
      const logsResponse = await fetch("/api/agent/logs");
      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(logsData.logs || []);
      }
    } catch (error) {
      } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-brand-success bg-green-100";
      case "completed":
        return "text-brand-primary bg-blue-100";
      case "failed":
        return "text-brand-error bg-red-100";
      case "stopped":
        return "text-gray-600 bg-surface";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--brand-surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading agent status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-surface)] py-8">
      <div className="container-app">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🤖 AI Agent Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor your continuous AI agent progress
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Agent Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Agent Status
            </h3>
            {agentStatus ? (
              <div className="space-y-2">
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(agentStatus.status)}`}
                >
                  {agentStatus.status.toUpperCase()}
                </div>
                <p className="text-sm text-gray-600">{agentStatus.message}</p>
                <p className="text-xs text-gray-500">
                  Last update: {formatTime(agentStatus.last_update)}
                </p>
                <p className="text-xs text-gray-500">
                  Mode: {agentStatus.mode}
                </p>
                {agentStatus.restart_count > 0 && (
                  <p className="text-xs text-yellow-600">
                    Restarts: {agentStatus.restart_count}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No agent status available</p>
            )}
          </div>

          {/* Task Progress */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Task Progress
            </h3>
            {taskStatus ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{taskStatus.progress_percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${taskStatus.progress_percentage}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    {taskStatus.current_task} / {taskStatus.total_tasks} tasks
                  </p>
                  <p>Completed: {taskStatus.completed_tasks}</p>
                  <p>Failed: {taskStatus.failed_tasks}</p>
                </div>
                {taskStatus.estimated_completion && (
                  <p className="text-xs text-gray-500">
                    Est. completion:{" "}
                    {formatTime(taskStatus.estimated_completion)}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No task data available</p>
            )}
          </div>

          {/* Completion Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Completion Status
            </h3>
            {completionStatus ? (
              <div className="space-y-2">
                <div
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(completionStatus.status)}`}
                >
                  {completionStatus.status.toUpperCase()}
                </div>
                <p className="text-sm text-gray-600">
                  {completionStatus.message}
                </p>
                <p className="text-xs text-gray-500">
                  Completed: {formatTime(completionStatus.completion_time)}
                </p>
                <p className="text-xs text-gray-500">
                  Duration: {completionStatus.total_duration_human}
                </p>
                <p className="text-xs text-gray-500">
                  Success rate: {completionStatus.success_rate}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Tasks still in progress</p>
            )}
          </div>
        </div>

        {/* Recent Logs */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Logs</h3>
          </div>
          <div className="p-6">
            {logs.length > 0 ? (
              <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-96">
                <pre className="text-green-400 text-sm font-mono">
                  {logs.slice(-20).join("\n")}
                </pre>
              </div>
            ) : (
              <p className="text-gray-500">No logs available</p>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchStatus}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            🔄 Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}
