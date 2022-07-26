import {jsPDF} from 'jspdf';
import { setCameraInCorner } from './ObjectLoader';

export const CreatePdf = (threeCanvas,projectJSON) => {
    var pdf = new jsPDF();
    let renderedImages =0;
    const imgWidth = 192;
    const imgHeight = 128;
    for (let i =0; i<9;i++) {
      setCameraInCorner(threeCanvas,projectJSON,i,)
      // threeCanvas.camera.position.set(Math.random()*30,Math.random()*30,Math.random()*30)
      // threeCanvas.renderer.render(threeCanvas.scene,threeCanvas.camera)
      const image = threeCanvas.renderer.domElement.toDataURL("image/jpeg", 1.0)
      if ((i-renderedImages)*(imgHeight+2)+imgHeight > pdf.internal.pageSize.height) {
        renderedImages = i;
        pdf.addPage()
      }

      pdf.addImage(image, 'JPEG', 0, (i-renderedImages)*(imgHeight+2),imgWidth,imgHeight,`img${i}`,'SLOW');
    }
    
    pdf.save("download.pdf");
    return (pdf);
}