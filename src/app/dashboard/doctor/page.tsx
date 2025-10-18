"use client";

import { useState, useEffect } from "react";

import { useT } from "@/hooks/useT";
import { useTheme } from "@/core/theme";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "lucide-react";

}
interface DoctorData {
  id: string;
  fullName: string;
  speciality: string;
  todayAppointments: Array<{
    id: string;
    patientName: string;
    time: string;
    status: "pending" | "in_progress" | "completed";
    patientId: string;
  }>;
  recentPatients: Array<{
    id: string;
    name: string;
    lastVisit: string;
    status: string;
  }>;
  schedule: {
    workingHours: string;
    breaks: string[];
  };


export default function DoctorDashboard() {
  const { t } = useT();
  const { theme } = useTheme();
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await fetch("/api/doctors/me");
        if (response.ok) {
          const data = await response.json();
          setDoctorData(data);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  const handleStartAppointment = async (appointmentId: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/start`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in_progress" }),
      });

      if (response.ok) {
        // Refresh data
        window.location.reload();
      }
    } catch (error) {}
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );

  return (
    <ProtectedRoute allowedRoles={["doctor"]}>
      <div className="min-h-screen bg-surface dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("doctor.dashboard.welcome")}, Dr. {doctorData?.fullName}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t("doctor.dashboard.subtitle")} - {doctorData?.speciality}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-brand-primary mr-4" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("doctor.dashboard.today_appointments")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {doctorData?.todayAppointments?.length || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-brand-success mr-4" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("doctor.dashboard.total_patients")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {doctorData?.recentPatients?.length || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-brand-primary mr-4" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("doctor.dashboard.pending_appointments")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {doctorData?.todayAppointments?.filter(
                      (apt) => apt.status === "pending",
                    ).length || 0}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("doctor.dashboard.completed_today")}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {doctorData?.todayAppointments?.filter(
                      (apt) => apt.status === "completed",
                    ).length || 0}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Appointments */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {t("doctor.dashboard.today_schedule")}
                </h2>
                {doctorData?.todayAppointments &&
                doctorData.todayAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {doctorData.todayAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-surface dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                              <Stethoscope className="h-5 w-5 text-brand-primary" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {appointment.patientName}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {appointment.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant={
                              appointment.status === "completed"
                                ? "primary"
                                : appointment.status === "in_progress"
                                  ? "secondary"
                                  : "outline"
                          >
                            {t(`appointment.status.${appointment.status}`)}
                          </Badge>
                          {appointment.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleStartAppointment(appointment.id)
                            >
                              {t("doctor.actions.start_appointment")}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                `/doctor/patients/${appointment.patientId}`,
                                "_blank",
                              )
                          >
                            {t("doctor.actions.view_file")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      {t("doctor.dashboard.no_appointments_today")}
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Recent Patients & Quick Actions */}
            <div className="space-y-6">
              {/* Recent Patients */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t("doctor.dashboard.recent_patients")}
                </h3>
                {doctorData?.recentPatients &&
                doctorData.recentPatients.length > 0 ? (
                  <div className="space-y-3">
                    {doctorData.recentPatients.slice(0, 5).map((patient) => (
                      <div
                        key={patient.id}
                        className="flex items-center justify-between p-3 bg-surface dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {patient.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t("doctor.dashboard.last_visit")}:{" "}
                            {patient.lastVisit}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `/doctor/patients/${patient.id}`,
                              "_blank",
                            )
                        >
                          {t("doctor.actions.view")}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                    {t("doctor.dashboard.no_recent_patients")}
                  </p>
                )}
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {t("doctor.dashboard.quick_actions")}
                </h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    {t("doctor.actions.add_notes")}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    {t("doctor.actions.view_all_patients")}
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    {t("doctor.actions.manage_schedule")}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}}}}}}