import React from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./StudentProfileModal.css";
import { FaTimes, FaUserAlt, FaMapMarkerAlt, FaBook, FaCalendarAlt, FaDownload } from "react-icons/fa";
import QRCode from "qrcode";

const StudentProfileModal = ({ student, onClose }) => {
  if (!student) return null;

const generatePDF = async () =>
    {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();

  // ================================
  // PAGE 1 — PROFILE + QR
  // ================================
  pdf.setFillColor(10, 10, 10);
  pdf.rect(0, 0, pageWidth, 22, "F");
  pdf.setTextColor("#00eaff");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("SWPA ACADEMY", pageWidth / 2, 14, { align: "center" });

  pdf.setFontSize(16);
  pdf.setTextColor("#000");
  pdf.text("STUDENT PROFILE REPORT", pageWidth / 2, 35, { align: "center" });

  // PROFILE PHOTO CIRCLE
  pdf.setDrawColor("#22c55e");
  pdf.setLineWidth(1.5);
  pdf.circle(pageWidth / 2, 60, 18);

  try {
    pdf.addImage(student.avatar, "JPEG", pageWidth / 2 - 15, 45, 30, 30);
  } catch {
    pdf.text(student.fullName.charAt(0), pageWidth / 2 - 4, 63);
  }

  pdf.setFontSize(13);
  pdf.text(student.fullName, pageWidth / 2, 85, { align: "center" });
  pdf.setFontSize(11);
  pdf.text(`User ID: ${student.userId}`, pageWidth / 2, 93, { align: "center" });
  pdf.text(`Course: ${student.courseName}`, pageWidth / 2, 100, { align: "center" });

  const section = (y, title) => {
    pdf.setFillColor("#111");
    pdf.rect(0, y - 8, pageWidth, 10, "F");
    pdf.setTextColor("#00eaff");
    pdf.text(title, 10, y);
    pdf.setTextColor("#000");
  };

  // PERSONAL INFO
  section(115, "PERSONAL INFO");
  pdf.text(`Gender: ${student.gender}`, 12, 126);
  pdf.text(`DOB: ${new Date(student.dob).toLocaleDateString()}`, 12, 134);
  pdf.text(`Email: ${student.email}`, 12, 142);
  pdf.text(`Phone: ${student.phone}`, 12, 150);

  // ACADEMIC INFO
  section(165, "ACADEMIC INFO");
  pdf.text(`Batch: FSB${student.batch}`, 12, 176);
  pdf.text(`Semester: ${student.currentSem}`, 12, 184);
  pdf.text(`Month: ${student.currentMonth}`, 12, 192);
  pdf.text(`Week: ${student.currentWeek}`, 12, 200);

  // ADDRESS
  section(215, "ADDRESS");
  pdf.text(`${student.address.doorNo}, ${student.address.street}`, 12, 226);
  pdf.text(`${student.address.city}, ${student.address.state}`, 12, 234);
  pdf.text(`${student.address.pincode}`, 12, 242);

  // SYSTEM INFO
  section(260, "SYSTEM INFO");
  pdf.text(`Status: ${student.status}`, 12, 271);
  pdf.text(`Created: ${new Date(student.createdAt).toLocaleDateString()}`, 12, 279);
  pdf.text(
    `Last Login: ${student.lastLogin ? new Date(student.lastLogin).toLocaleString() : "Never"}`,
    12, 287
  );

  // QR CODE
  const qrData = `${window.location.origin}/verify/${student.userId}`;
  const qr = await QRCode.toDataURL(qrData);
  pdf.addImage(qr, "PNG", pageWidth - 50, 250, 35, 35);
  pdf.text("Scan to verify", pageWidth - 48, 290);

  // SIGNATURE AREA
  pdf.setFontSize(10);
  pdf.text("Authorized Signature", pageWidth - 70, 310);
  pdf.line(pageWidth - 85, 308, pageWidth - 20, 308);

  // PAGE END
  pdf.addPage();

  // ================================
  // PAGE 2 — ASSIGNMENTS
  // ================================
  pdf.setFontSize(18);
  pdf.text("ASSIGNMENTS RECORD", 10, 20);
  pdf.setFontSize(12);
  pdf.text(`Total Assignments: ${student.assignments.length}`, 12, 32);

  let yOffset = 45;
  if (student.assignments.length > 0) {
    student.assignments.forEach((a, i) => {
      pdf.text(
        `${i + 1}. ${a.title} — [${a.status}] — Due: ${new Date(a.dueDate).toLocaleDateString()}`,
        12, yOffset
      );
      yOffset += 8;
      if (yOffset > 280) { pdf.addPage(); yOffset = 20; }
    });
  } else {
    pdf.text("No assignments available.", 12, yOffset);
  }

  pdf.addPage();

  // ================================
  // PAGE 3 — ATTENDANCE
  // ================================
  pdf.setFontSize(18);
  pdf.text("ATTENDANCE SUMMARY", 10, 20);

  if (!student.attendance) {
    pdf.text("No attendance data available.", 12, 40);
  } else {
    pdf.setFontSize(13);
    pdf.text(`Total Classes: ${student.attendance.totalClasses}`, 12, 40);
    pdf.text(`Present: ${student.attendance.present}`, 12, 48);
    pdf.text(`Absent: ${student.attendance.absent}`, 12, 56);
    pdf.text(`Percentage: ${student.attendance.percentage}%`, 12, 64);
  }

  pdf.addPage();

  // ================================
  // PAGE 4 — CERTIFICATES
  // ================================
  pdf.setFontSize(18);
  pdf.text("ISSUED CERTIFICATES", 10, 20);

  if (!student.certificates || student.certificates.length === 0) {
    pdf.setFontSize(12);
    pdf.text("No certificates issued yet.", 12, 40);
  } else {
    student.certificates.forEach((c, i) => {
      pdf.text(
        `${i + 1}. ${c.name} — Issued on ${new Date(c.date).toLocaleDateString()}`,
        12, 40 + i * 10
      );
    });
  }

  // SAVE
  pdf.save(`${student.userId}_Full_Report.pdf`);
};


  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>

        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={onClose}><FaTimes /></button>

        {/* EXPORT BUTTON */}
        <button className="pdf-btn" onClick={generatePDF}>
          <FaDownload /> Export PDF
        </button>

        {/* PROFILE CONTENT */}
        <div id="student-profile-pdf">

          <div className="profile-header">
            <img
              src={student.avatar || "https://ui-avatars.com/api/?name=" + student.fullName}
              alt="avatar"
              className="profile-avatar"
            />
            <h2>{student.fullName}</h2>
            <p>{student.userId} • {student.courseName}</p>
          </div>

          <div className="profile-grid">

            <div className="profile-card">
              <h3><FaUserAlt /> Personal Info</h3>
              <p><strong>Gender:</strong> {student.gender}</p>
              <p><strong>DOB:</strong> {new Date(student.dob).toLocaleDateString()}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Phone:</strong> {student.phone}</p>
            </div>

            <div className="profile-card">
              <h3><FaBook /> Academic Details</h3>
              <p><strong>Course:</strong> {student.courseName}</p>
              <p><strong>Batch:</strong> FSB{student.batch}</p>
              <p><strong>Current Sem:</strong> {student.currentSem}</p>
              <p><strong>Current Month:</strong> {student.currentMonth}</p>
              <p><strong>Week:</strong> {student.currentWeek}</p>
            </div>

            <div className="profile-card">
              <h3><FaMapMarkerAlt /> Address</h3>
              <p>{student.address.doorNo}, {student.address.street}</p>
              <p>{student.address.city}, {student.address.state}</p>
              <p>{student.address.pincode}</p>
            </div>

            <div className="profile-card">
              <h3><FaCalendarAlt /> System Info</h3>
              <p><strong>Status:</strong> {student.status}</p>
              <p><strong>Last Login:</strong> {student.lastLogin ? new Date(student.lastLogin).toLocaleString() : "Never"}</p>
              <p><strong>Created:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileModal;
