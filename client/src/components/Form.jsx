import { saveAs } from "file-saver";
import React, { useState } from "react";
import Education from "./Education";
import Experiences from "./Experiences";
import Extras from "./Extras";
import PersonalDetails from "./PersonalDetails";
import Project from "./Project";
import Success from "./Success";

import axiosInstance from "../utils/axios";

const Form = () => {
  const [success, setSuccess] = useState(false);
  const [loading,setLoading]=useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    skills: "",

    exp1_org: "",
    exp1_pos: "",
    exp1_desc: "",
    exp1_dur: "",
    exp2_org: "",
    exp2_pos: "",
    exp2_des: "",
    exp2_dur: "",

    proj1_title: "",
    proj1_link: "",
    proj1_desc: "",
    proj2_title: "",
    proj2_link: "",
    proj2_desc: "",

    edu1_school: "",
    edu1_year: "",
    edu1_qualification: "",
    edu1_desc: "",
    edu2_school: "",
    edu2_year: "",
    edu2_qualification: "",
    edu2_desc: "",

    extra_1: "",
    extra_2: "",
  });

  const [page, setPage] = useState(0);

  const FormTitle = [
    "Personal Details",
    "Education",
    "Experience",
    "Projects",
    "Extras",
  ];

   

  const PageDisplay = () => {
    if (page === 0) {
      return <PersonalDetails formData={formData} setFormData={setFormData} />;
    } else if (page === 1) {
      return <Education formData={formData} setFormData={setFormData} />;
    } else if (page === 2) {
      return <Experiences formData={formData} setFormData={setFormData} />;
    } else if (page === 3) {
      return <Project formData={formData} setFormData={setFormData} />;
    } else {
      return <Extras formData={formData} setFormData={setFormData} />;
    }
  };



  const dwonloadOrNextHandler= async()=>{ 
    
    if (page === FormTitle.length - 1) {

         setLoading(true)
      const res= await axiosInstance.post("create-pdf", formData)
        if(res?.data){
           const res = await axiosInstance.get("fetch-pdf", {
            responseType: "blob",
          })


          if(res?.data){
            const pdfBlob = new Blob([res.data],{type:'application/pdf'})  ;

            setSuccess(true && res.status === 200);
            saveAs(pdfBlob, "Resume.pdf");

             setLoading(false)

          }


        }

    } else {
      setPage(( currPage ) => currPage + 1 );
    }
    
  }
   

  return (
    <div>
      <div className="d-flex justify-content-center">
        <h1 className="text-center">{FormTitle[page]}</h1>
      </div>
      <div className="progressbar">
        <div
          
          style={{
            width:
              page === 0
                ? "20%"
                : page === 1
                ? "40%"
                : page === 2
                ? "60%"
                : page === 3
                ? "80%"
                : "100%",
            margin:"auto"
                
          }}
        ></div>
      </div>

      <div>{PageDisplay()}</div>

      <div className="d-flex justify-content-center gap-3 py-5">
        <button
        
          className="btn btn-dark"
          disabled={page === 0 || loading}
          onClick={() => {
            setPage((currPage) => currPage - 1);
          }}
        >
          Prev
        </button>
        <button
          className="btn btn-primary"
          disabled={loading}
          onClick={dwonloadOrNextHandler}
        >
          {page === FormTitle.length - 1 ? `${loading?"Downloading........":"Download Pdf"}` : "Next"}
        </button>
        
      </div>

      
      {success && <Success />}
    </div>
  );
};

export default Form;
