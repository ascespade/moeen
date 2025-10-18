import { useState, useEffect, useCallback } from "react";

import logger from '@/lib/monitoring/logger';

import { useT } from "@/hooks/useT";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

"use client";

FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Search,
  Plus,
  Eye,
} from "lucide-react";

interface Claim {
  id: string;
  patientName: string;
  provider: string;
  amount: number;
  status: "draft" | "submitted" | "approved" | "rejected" | "under_review";
  createdAt: string;
  referenceNumber?: string;
  appointmentId: string;

interface ClaimsManagerProps {
  patientId?: string;
  onClaimUpdate?: () => void;

export default function ClaimsManager({
  patientId,
  onClaimUpdate,
}: ClaimsManagerProps) {
  const { t } = useT();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create claim form state
  const [newClaim, setNewClaim] = useState({
    provider: "",
    amount: "",
    description: "",
    diagnosis: "",
    treatment: "",
  });

  const fetchClaims = useCallback(async () => {
    try {
      const url = patientId
        ? `/api/insurance/claims?patientId=${patientId}`
        : "/api/insurance/claims";

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims || []);
      }
    } catch (error) {
      console.error("Error fetching claims:", error);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch("/api/insurance/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          provider: newClaim.provider,
          amount: parseFloat(newClaim.amount),
          description: newClaim.description,
          diagnosis: newClaim.diagnosis,
          treatment: newClaim.treatment,
        }),
      });

      if (response.ok) {
        setNewClaim({
          provider: "",
          amount: "",
          description: "",
          diagnosis: "",
          treatment: "",
        });
        setShowCreateForm(false);
        fetchClaims();
        onClaimUpdate?.();
      }
    } catch (error) {
      console.error("Error creating claim:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmitClaim = async (claimId: string) => {
    try {
      const response = await fetch(`/api/insurance/claims/${claimId}/submit`, {
        method: "PATCH",
      });

      if (response.ok) {
        fetchClaims();
        onClaimUpdate?.();
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-surface text-gray-800";
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-surface text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <FileText className="h-4 w-4" />;
      case "submitted":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <AlertCircle className="h-4 w-4" />;
      case "under_review":
        return <Clock className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </Card>
    );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {t("insurance.claims.title")}
        </h2>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("insurance.claims.create_new")}
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t("insurance.claims.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <option value="all">{t("insurance.claims.all_statuses")}</option>
          <option value="draft">{t("insurance.claims.draft")}</option>
          <option value="submitted">{t("insurance.claims.submitted")}</option>
          <option value="under_review">
            {t("insurance.claims.under_review")}
          </option>
          <option value="approved">{t("insurance.claims.approved")}</option>
          <option value="rejected">{t("insurance.claims.rejected")}</option>
        </Select>
      </div>

      {/* Create Claim Form */}
      {showCreateForm && (
        <Card className="p-4 mb-6 bg-surface dark:bg-blue-900/20">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t("insurance.claims.create_new")}
          </h3>
          <form onSubmit={handleCreateClaim} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("insurance.claims.provider")}
                </label>
                <Select
                  value={newClaim.provider}
                  onValueChange={(value) =>
                    setNewClaim((prev) => ({ ...prev, provider: value }))
                  required
                >
                  <option value="">
                    {t("insurance.claims.select_provider")}
                  </option>
                  <option value="SEHA">SEHA</option>
                  <option value="SHOON">SHOON</option>
                  <option value="TATMAN">TATMAN</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("insurance.claims.amount")}
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={newClaim.amount}
                  onChange={(e) =>
                    setNewClaim((prev) => ({ ...prev, amount: e.target.value }))
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("insurance.claims.description")}
              </label>
              <Input
                value={newClaim.description}
                onChange={(e) =>
                  setNewClaim((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                placeholder={t("insurance.claims.description_placeholder")}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("insurance.claims.diagnosis")}
                </label>
                <Input
                  value={newClaim.diagnosis}
                  onChange={(e) =>
                    setNewClaim((prev) => ({
                      ...prev,
                      diagnosis: e.target.value,
                    }))
                  placeholder={t("insurance.claims.diagnosis_placeholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("insurance.claims.treatment")}
                </label>
                <Input
                  value={newClaim.treatment}
                  onChange={(e) =>
                    setNewClaim((prev) => ({
                      ...prev,
                      treatment: e.target.value,
                    }))
                  placeholder={t("insurance.claims.treatment_placeholder")}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating
                  ? t("common.creating")
                  : t("insurance.claims.create")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.length > 0 ? (
          filteredClaims.map((claim) => (
            <div
              key={claim.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-surface dark:hover:bg-gray-800"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                    {getStatusIcon(claim.status)}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {claim.patientName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {claim.provider} - {claim.amount} SAR
                  </p>
                  {claim.referenceNumber && (
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {t("insurance.claims.reference")}: {claim.referenceNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Badge className={getStatusColor(claim.status)}>
                  {t(`insurance.claims.status.${claim.status}`)}
                </Badge>
                {claim.status === "draft" && (
                  <Button size="sm" onClick={() => handleSubmitClaim(claim.id)}>
                    {t("insurance.claims.submit")}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    window.open(`/insurance/claims/${claim.id}`, "_blank")
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              {t("insurance.claims.no_claims")}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}}}}}}}}}
