"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { backendApiClient } from "@/lib/backend-api-client";
import { AccountSidebar } from "@/features/account/components/shared/account-sidebar";
import { BackToAccountLink } from "@/features/account/components/shared/back-to-account-link";

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [isMarkingDelivered, setIsMarkingDelivered] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Check if order is already delivered on page load
  useEffect(() => {
    const checkDeliveryStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const orderResponse = await backendApiClient.get(`/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const order = orderResponse.data.data;

        // Check if any shipment is delivered
        if (order.shipments && order.shipments.length > 0) {
          const hasDeliveredShipment = order.shipments.some(
            (shipment: any) => shipment.isDelivered,
          );
          setIsDelivered(hasDeliveredShipment);
        }
      } catch (error) {
        console.error("Error checking delivery status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkDeliveryStatus();
  }, [orderId]);

  const handleMarkAsDelivered = async () => {
    try {
      setIsMarkingDelivered(true);
      setMessage("");

      const token = localStorage.getItem("authToken");

      // First, get the order to find the shipment ID
      setMessage("📋 Fetching order details...");
      const orderResponse = await backendApiClient.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const order = orderResponse.data.data;

      let shipmentId: string;

      // Check if shipments exist, if not create one
      if (!order.shipments || order.shipments.length === 0) {
        setMessage("📦 No shipment found. Creating shipment...");

        const trackingNumber = `TEST-${Date.now()}`;
        const carrier = "Standard Shipping";
        const service = "Ground";

        // Create a shipment for testing purposes
        const shipmentResponse = await backendApiClient.post(
          `/orders/${orderId}/shipments`,
          {
            carrier,
            service,
            trackingNumber,
            giftReceipt: false,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        shipmentId = shipmentResponse.data.data.shipmentId;
        setMessage("✅ Shipment created! Now marking as shipped...");

        // Small delay to show the message
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mark the shipment as shipped first
        await backendApiClient.post(
          `/orders/${orderId}/shipments/${shipmentId}/mark-shipped`,
          {
            carrier,
            service,
            trackingNumber,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setMessage(
          "✅ Shipment marked as shipped! Now marking as delivered...",
        );

        // Small delay to show the message
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        shipmentId = order.shipments[0].shipmentId;
        const shipment = order.shipments[0];

        // Check if shipment is already shipped
        if (!shipment.isShipped) {
          setMessage(
            "📦 Shipment found but not shipped. Marking as shipped first...",
          );

          // Mark as shipped before delivering
          await backendApiClient.post(
            `/orders/${orderId}/shipments/${shipmentId}/mark-shipped`,
            {
              carrier: shipment.carrier || "Standard Shipping",
              service: shipment.service || "Ground",
              trackingNumber: shipment.trackingNumber || `TEST-${Date.now()}`,
            },
            { headers: { Authorization: `Bearer ${token}` } },
          );

          setMessage(
            "✅ Shipment marked as shipped! Now marking as delivered...",
          );

          // Small delay to show the message
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          setMessage("📦 Shipment found and shipped. Marking as delivered...");
        }
      }

      // Mark shipment as delivered
      await backendApiClient.post(
        `/orders/${orderId}/shipments/${shipmentId}/mark-delivered`,
        { deliveredAt: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Update order status to DELIVERED
      await backendApiClient.patch(
        `/orders/${orderId}/status`,
        { status: "DELIVERED" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setMessage(
        "✅ Order marked as delivered! Loyalty points have been awarded. Check your Loyalty Program page!",
      );
      setIsDelivered(true);
    } catch (error: any) {
      console.error("Error marking order as delivered:", error);
      setMessage(
        `❌ Error: ${error.response?.data?.error || error.message || "Unknown error"}`,
      );
    } finally {
      setIsMarkingDelivered(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#EFECE5]">
      {/* Top Strip - Back Link */}
      <div className="w-full flex justify-center border-t border-b border-[#C3B0A5]/30">
        <div className="w-full max-w-[1440px] px-4 md:px-[60px] py-[32px]">
          <BackToAccountLink />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-[60px] pt-[56px] pb-20">
        <div className="flex flex-col md:flex-row gap-6 lg:gap-12">
          {/* Left Sidebar */}
          <AccountSidebar />

          {/* Right Content */}
          <div className="flex-1 max-w-[745px]">
            <h1
              className="text-[24px] font-normal text-[#765C4D] mb-8"
              style={{ fontFamily: "Raleway, sans-serif" }}
            >
              Order Details
            </h1>

            <div className="bg-[#FBF9F6] p-8 min-h-[400px]">
              <div className="space-y-6">
                <div>
                  <p
                    className="text-[14px] text-[#888888] mb-2"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    Order ID
                  </p>
                  <p
                    className="text-[16px] text-[#232D35] font-mono"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    {orderId}
                  </p>
                </div>

                <div className="border-t border-[#E5E0D6] pt-6">
                  <h2
                    className="text-[18px] text-[#232D35] font-medium mb-4"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    Mark Order as Delivered
                  </h2>
                  <p
                    className="text-[14px] text-[#888888] mb-4"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    Click the button below to mark this order as delivered. This
                    will automatically award loyalty points based on the order
                    total.
                  </p>

                  <button
                    onClick={handleMarkAsDelivered}
                    disabled={isMarkingDelivered || isDelivered || isLoading}
                    className={`h-[48px] px-8 text-white text-[12px] uppercase tracking-widest transition-colors disabled:cursor-not-allowed flex items-center gap-2 ${
                      isDelivered
                        ? "bg-green-600 hover:bg-green-600"
                        : "bg-[#232D35] hover:bg-[#3E4851] disabled:opacity-50"
                    }`}
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading...
                      </>
                    ) : isMarkingDelivered ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : isDelivered ? (
                      <>
                        <span className="text-[16px]">✓</span>
                        Order Delivered
                      </>
                    ) : (
                      "Mark as Delivered"
                    )}
                  </button>

                  {message && (
                    <div
                      className={`mt-4 p-4 rounded ${
                        message.startsWith("✅")
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <p
                        className={`text-[14px] ${
                          message.startsWith("✅")
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                        style={{ fontFamily: "Raleway, sans-serif" }}
                      >
                        {message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[#E5E0D6] pt-6">
                  <p
                    className="text-[12px] text-[#888888]"
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    💡 Tip: In a production environment, orders would be
                    automatically marked as delivered by your shipping provider
                    or admin panel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
