import {jsPDF} from 'jspdf';
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export const CreatePdf = (renderer) => {
    var imgData = renderer.domElement.toDataURL("image/jpeg", 1.0);
    var pdf = new jsPDF();

    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save("download.pdf");
    return (pdf);
}

const GetRenderer = () => {
  const { gl } = useThree();
  useEffect(() => {
    console.log(gl.info);
  });
  return gl.domElement;
};