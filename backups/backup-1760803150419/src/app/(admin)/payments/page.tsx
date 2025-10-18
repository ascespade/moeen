"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPayments = async () => {
    try {
      const response = await fetch("/api/payments");
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments Management</h1>
        <Button>New Payment</Button>
      </div>

      <div className="grid gap-4">
        {payments.length === 0 ? (
          <Card>
            <div className="p-8 text-center text-gray-500">
              No payments recorded yet.
            </div>
          </Card>
        ) : (
          payments.map((payment) => (
            <Card key={payment.id}>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Payment #{payment.id?.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Amount: ${payment.amount}
                    </p>
                  </div>
                  <Badge
                    variant={
                      payment.status === "completed" ? "success" : "warning"
                    }
                  >
                    {payment.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
