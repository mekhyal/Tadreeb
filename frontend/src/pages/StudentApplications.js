import React from "react";
import StudentTopbar from "../components/student/StudentTopbar";
import StudentFooter from "../components/student/StudentFooter";
import { applicationData } from "../data/studentData";

function StudentApplications() {
  const getStatusClass = (status) => {
    if (status === "Accepted") return "accepted";
    if (status === "Rejected") return "rejected";
    return "review";
  };

  return (
    <div className="student-page">
      <StudentTopbar />

      <main className="student-applications-page container">
        <div className="student-applications-card">
          <h2>My Applications</h2>
          <p>Track the opportunities you applied for</p>

          <div className="student-applications-table-wrap">
            <table className="student-applications-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Opportunity</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>

              <tbody>
                {applicationData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.company}</td>
                    <td>{item.opportunity}</td>
                    <td>
                      <span
                        className={`student-status-badge ${getStatusClass(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <StudentFooter />
    </div>
  );
}

export default StudentApplications;