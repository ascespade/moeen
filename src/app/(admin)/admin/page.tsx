import React, { useState, useEffect } from "react";

import {

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";

// src/app/admin/page.tsx
// Admin Module with Role-Based Access Control
// Provides user management, system configuration, and security features

"use client";

  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

  Users,
  Settings,
  Shield,
  Activity,
  UserPlus,
  UserMinus,
  Key,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  permissions: string[];

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
  isSecret: boolean;

interface SecurityEvent {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form states
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "agent",
    password: "",
  });
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadAdminData();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    document.title = "Admin Panel - مُعين";
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, configsRes, eventsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/configs"),
        fetch("/api/admin/security-events"),
      ]);

      if (!usersRes.ok || !configsRes.ok || !eventsRes.ok) {
        throw new Error("Failed to load admin data");

      const [usersData, configsData, eventsData] = await Promise.all([
        usersRes.json(),
        configsRes.json(),
        eventsRes.json(),
      ]);

      setUsers(usersData.data || []);
      setConfigs(configsData.data || []);
      setSecurityEvents(eventsData.data || []);
      setCurrentUser(usersData.currentUser || null);
      setError(null);
    } catch (err) {
      console.error("Error loading admin data:", err);
      // Set mock data if APIs fail
      setUsers([
          id: "1",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin",
          status: "active",
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          permissions: ["all"],
        },
          id: "2",
          email: "doctor@example.com",
          name: "Dr. Smith",
          role: "doctor",
          status: "active",
          lastLogin: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          permissions: ["read_patients", "create_appointments"],
        },
      ]);
      setConfigs([
          id: "1",
          key: "maintenance_mode",
          value: "false",
          description: "Enable maintenance mode",
          category: "system",
          isSecret: false,
        },
          id: "2",
          key: "registration_enabled",
          value: "true",
          description: "Allow new user registrations",
          category: "auth",
          isSecret: false,
        },
      ]);
      setSecurityEvents([
          id: "1",
          userId: "1",
          action: "user_login",
          timestamp: new Date().toISOString(),
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0...",
          success: true,
        },
      ]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Failed to create user");

      await loadAdminData();
      setNewUser({ email: "", name: "", role: "agent", password: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleUpdateUserStatus = async (userId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update user");

      await loadAdminData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleUpdateConfig = async (config: SystemConfig) => {
    try {
      const response = await fetch(`/api/admin/configs/${config.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: config.value }),
      });

      if (!response.ok) throw new Error("Failed to update config");

      await loadAdminData();
      setEditingConfig(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      supervisor: "bg-purple-100 text-purple-800",
      agent: "bg-green-100 text-green-800",
      demo: "bg-surface text-gray-800",
    };
    return (
      <Badge className={colors[role as keyof typeof colors] || colors.demo}>
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };
    return (
      <Badge
        className={colors[status as keyof typeof colors] || colors.inactive}
      >
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading admin panel...</p>
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-brand-error mx-auto mb-4" />
          <p className="text-brand-error mb-4">Error: {error}</p>
          <Button onClick={loadAdminData}>Retry</Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--brand-surface)]">
      <div className="container-app py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-gray-600">
              System administration and user management
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Welcome, {currentUser?.name} ({currentUser?.role})
            </div>
            <Button onClick={loadAdminData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="admin-summary-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-brand-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-gray-600">
                {users.filter((u) => u.status === "active").length} active
              </p>
            </CardContent>
          </Card>

          <Card data-testid="admin-summary-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Configs
              </CardTitle>
              <Settings className="h-4 w-4 text-brand-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{configs.length}</div>
              <p className="text-xs text-gray-600">
                {configs.filter((c) => c.isSecret).length} secret
              </p>
            </CardContent>
          </Card>

          <Card data-testid="admin-summary-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Security Events
              </CardTitle>
              <Shield className="h-4 w-4 text-brand-error" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{securityEvents.length}</div>
              <p className="text-xs text-gray-600">Last 24 hours</p>
            </CardContent>
          </Card>

          <Card data-testid="admin-summary-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Logins
              </CardTitle>
              <Lock className="h-4 w-4 text-brand-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {securityEvents.filter((e) => !e.success).length}
              </div>
              <p className="text-xs text-gray-600">Security alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="configs">System Config</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User List */}
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>
                    Manage system users and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        data-testid="user-item"
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                            <div className="flex gap-2 mt-1">
                              {getRoleBadge(user.role)}
                              {getStatusBadge(user.status)}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {user.status === "active" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateUserStatus(user.id, "suspended")
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUpdateUserStatus(user.id, "active")
                            >
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Create User */}
              <Card>
                <CardHeader>
                  <CardTitle>Create New User</CardTitle>
                  <CardDescription>
                    Add a new user to the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        value={newUser.role}
                        onChange={(e) =>
                          setNewUser({ ...newUser, role: e.target.value })
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="agent">Agent</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>
                  Manage system settings and configurations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {configs.map((config) => (
                    <div
                      key={config.id}
                      data-testid="config-item"
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{config.key}</div>
                          <div className="text-sm text-gray-500">
                            {config.description}
                          </div>
                          <div className="text-xs text-gray-400">
                            {config.category}
                          </div>
                        </div>
                        {config.isSecret && (
                          <Key className="h-4 w-4 text-brand-warning" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type={config.isSecret ? "password" : "text"}
                          value={config.value}
                          onChange={(e) =>
                            setEditingConfig({
                              ...config,
                              value: e.target.value,
                            })
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            editingConfig && handleUpdateConfig(editingConfig)
                          disabled={
                            !editingConfig ||
                            editingConfig.value === config.value
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>
                  Monitor security events and access attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityEvents.slice(0, 20).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {event.success ? (
                          <CheckCircle className="h-5 w-5 text-brand-success" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-brand-error" />
                        )}
                        <div>
                          <div className="font-medium">{event.action}</div>
                          <div className="text-sm text-gray-500">
                            {event.ipAddress} • {event.userAgent}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant={event.success ? "success" : "error"}>
                        {event.success ? "Success" : "Failed"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>
                  Complete audit trail of all admin actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{event.action}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        User: {event.userId} • IP: {event.ipAddress}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {event.userAgent}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
