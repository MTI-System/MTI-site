"use client"
import { Forms } from "@/components/forms";
import CheckboxGroupRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxGroupRegistrationField";
import CheckboxRegistrationField from "@/components/tournamentPage/Forms/Registration/Parts/CheckboxRegistrationField";
import { useState } from "react";

export default function UploadImage() {
  const [imgSrc, setImgSrc] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file); // временная ссылка на файл
    console.log("url: ", url)
    setImgSrc(url);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />

      {imgSrc && (
        <img
          src={imgSrc}
          alt="preview"
          style={{ maxWidth: "300px", marginTop: 16 }}
        />
      )}
    </div>
  );
}
