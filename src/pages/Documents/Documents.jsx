import React from 'react'

const Documents = () => {
  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = "/ApplicationForm.pdf";
    link.download = "Student_Application_Form.pdf";
    link.click();
  };

  const downloadPdf1 = () => {
    const link = document.createElement("a");
    link.href = "/T&Cforrm.pdf";
    link.download = "Course_T&C_Form.pdf";
    link.click();
  };
  
  return (
    <div>
      <h2>Documents & Applications to download</h2>
      {/* RIGHT SIDE DOWNLOADS */}
        <div className="right-nav">
          <button className="download-btn" onClick={downloadPdf}>
            📄 Application Form
          </button>
          <button className="download-btn-1" onClick={downloadPdf1}>
            📄 Terms & Conditions
          </button>
        </div>
    </div>
  )
}

export default Documents
