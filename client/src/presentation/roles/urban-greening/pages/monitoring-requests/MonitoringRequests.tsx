import React from "react";
import { useMonitoringRequests } from "./logic/useMonitoringRequests";
import { Card, CardHeader, CardTitle, CardContent } from "@/presentation/components/shared/ui/card";
import { Button } from "@/presentation/components/shared/ui/button";
import { Input } from "@/presentation/components/shared/ui/input";
import TopNavBarContainer from "@/presentation/components/shared/layout/TopNavBarContainer";
import ColorDivider from "@/presentation/components/shared/layout/ColorDivider";
import { Plus } from "lucide-react";
import MapView from "../MapView";
import MonitoringRequestForm from "./components/MonitoringRequestForm";
import MonitoringRequestDetails from "./components/MonitoringRequestDetails";
import MonitoringRequestsTable from "./components/MonitoringRequestsTable";

import { useState } from "react";




const MonitoringRequests: React.FC = () => {
  const {
    requests,
    loading,
    error,
    selectedRequestId,
    mode,
    currentView,
    searchTerm,
    statusFilter,
    selectedRequest,
    formLocation,
    setCurrentView,
    setSearchTerm,
    setStatusFilter,
    setFormLocation,
    handleSelectRequest,
    handleAddRequest,
    handleCancel,
    handleEdit,
    handleDelete,
    handleSaveRequest,
    getStatusColor,
    refetchRequests,
  } = useMonitoringRequests();

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavBarContainer dashboardType="urban-greening" />
        {/* Header Section */}
        <div className="flex items-center justify-between bg-white px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Monitoring Requests</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentView(currentView === "table" ? "map" : "table")}
            >
              {currentView === "table" ? "Map View" : "Table View"}
            </Button>
            <Button onClick={handleAddRequest}>
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
        {/* Body Section */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F9FBFC]">
          <div className="px-6">
            <ColorDivider />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Main Content */}
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Monitoring Requests</span>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded px-3 py-2"
                      >
                        <option value="all">All Status</option>
                        <option value="Living">Living</option>
                        <option value="Dead">Dead</option>
                        <option value="Replaced">Replaced</option>
                      </select>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentView === "table" ? (
                    <MonitoringRequestsTable
                      requests={requests.filter((request) => {
                        // Only filter if searchTerm or statusFilter is set
                        let matchesSearch = true;
                        let matchesStatus = true;
                        if (searchTerm) {
                          matchesSearch = (
                            (request.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (request.requester_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (request.id || "").toLowerCase().includes(searchTerm.toLowerCase())
                          );
                        }
                        if (statusFilter && statusFilter !== "all") {
                          matchesStatus = request.status === statusFilter;
                        }
                        return matchesSearch && matchesStatus;
                      })}
                      selectedRequestId={selectedRequestId}
                      onSelectRequest={handleSelectRequest}
                      searchTerm={searchTerm}
                      onSearchTermChange={setSearchTerm}
                      statusFilter={statusFilter}
                      onStatusFilterChange={setStatusFilter}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      getStatusColor={getStatusColor}
                    />
                  ) : (
                    <MapView
                      requests={requests}
                      onSelectRequest={handleSelectRequest}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            {/* Sidebar */}
            <div className="col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>
                    {mode === "adding"
                      ? "New Request"
                      : mode === "editing"
                        ? "Edit Request"
                        : "Request Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {mode === "adding" || mode === "editing" ? (
                    <MonitoringRequestForm
                      mode={mode}
                      initialValues={
                        mode === "editing" && selectedRequest
                          ? { ...selectedRequest, date: new Date(selectedRequest.date) }
                          : {}
                      }
                      location={formLocation || { lat: 0, lng: 0 }}
                      onLocationChange={setFormLocation}
                      onSave={handleSaveRequest}
                      onCancel={handleCancel}
                    />
                  ) : (
                    selectedRequest && (
                      <MonitoringRequestDetails
                        request={selectedRequest}
                        onEdit={handleEdit}
                        onDelete={() => handleDelete(selectedRequest.id)}
                        getStatusColor={getStatusColor}
                      />
                    )
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringRequests;
