import React, { useState } from "react";
// import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import "./PayslipGenerator.css";
import swpalogo from "../../assets/swpalogo.png";

const PayslipGenerator = () => {
  const [form, setForm] = useState({
    employeeName: "",
    employeeID: "",
    designation: "",
    department: "",
    payPeriod: "",
    payDate: "",
    basic: "",
    hra: "",
    travel: "",
    internet: "",
    professional: "",
    employmentType: "fulltime", // fulltime | intern
  });

  const [previewData, setPreviewData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatINR = (num) =>
    num.toLocaleString("en-IN", { style: "currency", currency: "INR" });

  // Number to words (Indian format)
  const convertToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    if ((num = num.toString()).length > 9) return "Overflow";
    const n = ("000000000" + num)
      .substr(-9)
      .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);

    if (!n) return "";
    let str = "";
    str +=
      n[1] !== "00"
        ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
        : "";
    str +=
      n[2] !== "00"
        ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
        : "";
    str +=
      n[3] !== "00"
        ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "
        : "";
    str +=
      n[4] !== "0"
        ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred "
        : "";
    str +=
      n[5] !== "00"
        ? (str !== "" ? "and " : "") +
        (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
        : "";
    return str.trim();
  };

  const formatLPA = (num) => {
    return (num / 100000).toFixed(2) + " LPA";
  };


  const handlePreview = () => {
    const basic = parseFloat(form.basic) || 0;

    // HRA auto = 40% of basic if left empty
    const hra = parseFloat(form.hra) || 0
    const travel = parseFloat(form.travel) || 0;
    const internet = parseFloat(form.internet) || 0;
    const professional = parseFloat(form.professional) || 0;

    const data = {
      ...form,
      basic,
      hra,
      travel,
      internet,
      professional,
    };

    const gross = basic + hra + travel + internet + professional;

    let pf = 0;
    let pt = 0;
    let incomeTax = 0;

    // Full-time: apply deductions; Intern: no deductions
    if (form.employmentType === "fulltime") {
      pf = basic * 0.12; // 12% of Basic
      pt = 200; // fixed
      incomeTax = gross * 0.04; // 4% of Gross
    }

    const deductions = pf + pt + incomeTax;
    const net = gross - deductions;

    data.pf = pf;
    data.pt = pt;
    data.incomeTax = incomeTax;

    // CTC calculations
    const employerPF = form.employmentType === "fulltime" ? basic * 0.12 : 0;
    const monthlyCTC = gross + employerPF;
    const yearlyCTC = monthlyCTC * 12;
    const suggestedHRA = basic * 0.4;

    setPreviewData({
      data,
      gross,
      deductions,
      net,
      employerPF,
      monthlyCTC,
      yearlyCTC,
      suggestedHRA,
    });
  };

  // const downloadImage = () => {
  //   if (!previewData) return;
  //   const payslipDiv = document.getElementById("payslip");
  //   html2canvas(payslipDiv, { scale: 2 }).then((canvas) => {
  //     const link = document.createElement("a");
  //     link.download = `${previewData.data.employeeID || "EMP"}_${
  //       previewData.data.payPeriod || "Period"
  //     }_Payslip.png`;
  //     link.href = canvas.toDataURL("image/png");
  //     link.click();
  //   });
  // };

  const downloadPDF = () => {
    if (!previewData) return;
    const payslipDiv = document.getElementById("payslip");
    const opt = {
      margin: 0,
      filename: `${previewData.data.employeeID || "EMP"}_${previewData.data.payPeriod || "Period"
        }_Payslip.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(payslipDiv).set(opt).save();
  };

  return (
    <div>
      {/* ---- FORM SECTION ---- */}
      <div className="form-section">


        <h2>Generate Payslip</h2>

        <div className="main-section-pay">

        

        <div className="left-section">
          <h3>Employee Details</h3>
          
          <label className="employment-label">
          {/* Employment Type */}
          <select
            name="employmentType"
            value={form.employmentType}
            onChange={handleChange}
          >
            <option value="fulltime">Full-Time</option>
            <option value="intern">Intern</option>
          </select>
        </label>
          
          <input className="inputBox"
          type="text"
          name="employeeName"
          placeholder="Employee Name"
          value={form.employeeName}
          onChange={handleChange}
        />
        <input className="inputBox"
          type="text"
          name="employeeID"
          placeholder="Employee ID"
          value={form.employeeID}
          onChange={handleChange}
        />
        <input className="inputBox"
          type="text"
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
        />
        <input className="inputBox"
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <input className="inputBox"
          type="text"
          name="payPeriod"
          placeholder="Pay Period (e.g., May 2025)"
          value={form.payPeriod}
          onChange={handleChange}
        />
        <input className="inputBox"
          type="date"
          name="payDate"
          value={form.payDate}
          onChange={handleChange}
        />

        </div>

        <div className="right-section">
          
        {/* <h3>Earnings Details</h3> */}

        <p className="label-pay">Basic Pay :</p>
        <input className="inputBox"
          type="number"
          name="basic"
          placeholder="Basic Pay"
          value={form.basic}
          onChange={handleChange}
        />
        
        <p className="label-pay">House Rent Allowance :</p>
          <input className="inputBox"
            type="number"
            name="hra"
            placeholder="House Rent Allowance"
            value={form.hra}
            onChange={handleChange}
          />
          
        <p className="label-pay">Travel Allowance :</p>
        <input className="inputBox"
          type="number"
          name="travel"
          placeholder="Travel Allowance"
          value={form.travel}
          onChange={handleChange}
        />

        <p className="label-pay">Medical & Internet :</p>
        <input className="inputBox"
          type="number"
          name="internet"
          placeholder="Medical & Internet"
          value={form.internet}
          onChange={handleChange}
        />

        <p className="label-pay">Performance / Special Allowance :</p>
        <input className="inputBox"
          type="number"
          name="professional"
          placeholder="Performance / Special Allowance"
          value={form.professional}
          onChange={handleChange}
        />

        </div>

        </div>

        <div className="buttons-container" style={{ marginTop: "20px" }}>
          <button className="buttons" type="button" onClick={handlePreview}>
            Preview
          </button>
          {previewData && (
            <>
              {/* <button className="buttons" type="button" onClick={downloadImage}>
                Download as Image
              </button> */}
              <button className="buttons" type="button" onClick={downloadPDF}>
                Download as PDF
              </button>
            </>
          )}
        </div>

      </div>

      {/* ---- PAYSLIP PREVIEW ---- */}
      {previewData && (
        <div id="payslip" className="payslip">
          <div className="payslip-container">
            <div className="payslip-header">
              <div>
                <h1 className="payslip-heading">
                  Saredufy Web Plus Academy Pvt. Ltd.
                </h1>
                <p>
                  <b>CIN:</b> U85307AP2024PTC116844
                </p>
                <p>
                  22-5-97/2 PLOT NO.81, Kotthapalle, Sujatha Nagar,
                  Tirupati,
                  <br />
                  Andhra Pradesh - 517501
                </p>
                <p>
                  <b>Contact:</b> +91-8886200010
                </p>
                <p>
                  <b>Email:</b> info@saredufywpa.com
                </p>
              </div>
              <div className="payslip-logo-box">
                <img src={swpalogo} alt="Company Logo" />
              </div>
            </div>

            <hr />

            <div className="employee-summary">
              <div className="emp-summary-block">
                <div className="emp-heading">
                  {previewData.data.employmentType === "intern"? "INTERN PAY SUMMARY" : "EMPLOYEE PAY SUMMARY" }
                </div>
                <div className="emp-data">
                  {previewData.data.employmentType === "intern"? "Intern " : "Employee " }
                    Name{" "}
                  <b className="emp-details">
                    : {previewData.data.employeeName}
                  </b>
                </div>
                <div className="emp-data">
                  Employee ID{" "}
                  <b className="emp-details">
                    : {previewData.data.employeeID}
                  </b>
                </div>
                <div className="emp-data">
                  Designation{" "}
                  <b className="emp-details">
                    : {previewData.data.designation}
                  </b>
                </div>
                <div className="emp-data">
                  Department{" "}
                  <b className="emp-details">
                    : {previewData.data.department}
                  </b>
                </div>
                <div className="emp-data">
                  Work Type{" "}
                  <b className="emp-details">
                    :{" "}
                    {previewData.data.employmentType === "intern"
                      ? "Intern"
                      : "Full-Time"}
                  </b>
                </div>
              </div>

              <div className="net-box">
                <div className="green-box">
                  <div className="net-amount">
                    {formatINR(previewData.net)}
                  </div>
                  <div className="net-label">Total Net Pay</div>
                </div>
                <div className="net-days">
                  Pay Period : {previewData.data.payPeriod}
                  <br />
                  Pay Date : {previewData.data.payDate}
                </div>
              </div>
            </div>

            <div className="earnings-deductions">
              <table>
                <thead>
                  <tr>
                    <th>EARNINGS</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Salary</td>
                    <td>{formatINR(previewData.data.basic)}</td>
                  </tr>
                  <tr>
                    <td>House Rent Allowance</td>
                    <td>{formatINR(previewData.data.hra)}</td>
                  </tr>
                  <tr>
                    <td>Travel Allowance</td>
                    <td>{formatINR(previewData.data.travel)}</td>
                  </tr>
                  <tr>
                    <td>Medical & Internet</td>
                    <td>{formatINR(previewData.data.internet)}</td>
                  </tr>
                  <tr>
                    <td>Performance Allowance</td>
                    <td>{formatINR(previewData.data.professional)}</td>
                  </tr>
                  <tr className="highlight">
                    <td>
                      <strong>Gross Earnings</strong>
                    </td>
                    <td>
                      <strong>
                        {formatINR(previewData.gross)}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table>
                <thead>
                  <tr>
                    <th>DEDUCTIONS</th>
                    <th>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Employee PF
                      <br /> (12% of Basic)
                    </td>
                    <td>{formatINR(previewData.data.pf)}</td>
                  </tr>
                  <tr>
                    <td>
                      Professional Tax
                      <br /> (fixed)
                    </td>
                    <td>{formatINR(previewData.data.pt)}</td>
                  </tr>
                  <tr>
                    <td>
                      Income Tax
                      <br /> (4% of Gross)
                    </td>
                    <td>{formatINR(previewData.data.incomeTax)}</td>
                  </tr>
                  <tr className="highlight">
                    <td>
                      <strong>Total Deductions</strong>
                    </td>
                    <td>
                      <strong>
                        {formatINR(previewData.deductions)}
                      </strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* NET PAYABLE */}
            <div className="net-payable-section">
              <div className="net-pay-container">
                <div className="net-payable-label">
                  TOTAL NET PAYABLE
                  <span>Gross Earnings - Total Deductions</span>
                </div>
                <div className="net-payable-box">
                  {formatINR(previewData.net)}
                </div>
              </div>
              <p style={{ marginTop: "20px" }}>
                <strong>Amount in Words :</strong> Indian Rupees{" "}
                {convertToWords(Math.round(previewData.net))} Only
              </p>
            </div>

            {/* CTC SUMMARY */}
            <div className="ctc-section">
              <h3>CTC Summary</h3>
              <div className="ctc-grid">
                <div className="ctc-item">
                  <span className="ctc-label">
                    Monthly Gross (Earnings)
                  </span>
                  <span className="ctc-value">
                    {formatINR(previewData.gross)}
                  </span>
                </div>
                <div className="ctc-item">
                  <span className="ctc-label">
                    Employer PF (12% of Basic)
                  </span>
                  <span className="ctc-value">
                    {formatINR(previewData.employerPF)}
                  </span>
                </div>
                <div className="ctc-item">
                  <span className="ctc-label">Monthly CTC</span>
                  <span className="ctc-value">
                    {formatINR(previewData.monthlyCTC)}
                  </span>
                </div>
                <div className="ctc-item">
                  <span className="ctc-label">Annual CTC</span>
                  <span className="ctc-value">
                    {formatLPA(previewData.yearlyCTC)}
                  </span>

                </div>
                
              </div>
              {previewData.data.employmentType === "intern" &&
                <p className="ctc-note">
                  * For interns, statutory deductions are not applied in
                  this payslip. CTC is calculated without PF deductions.
                </p>}
            </div>

            <p className="footer-note">
              -- This is a system-generated document. --
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayslipGenerator;
