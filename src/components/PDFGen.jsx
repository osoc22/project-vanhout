import {jsPDF} from 'jspdf';

export const CreatePdf = (renderer) => {
    var pdf = new jsPDF();
    // let pageCount = 1;
    let renderedImages =0;
    const imgWidth = 192;
    const imgHeight = 128;
    for (let i =0; i<9;i++) {
      const image = renderer.domElement.toDataURL("image/jpeg", 1.0)

      if ((i-renderedImages)*(imgHeight+2)+imgHeight > pdf.internal.pageSize.height) {
        // pageCount +=1;
        renderedImages = i;
        pdf.addPage()
      }

      pdf.addImage(image, 'JPEG', 0, (i-renderedImages)*(imgHeight+2),imgWidth,imgHeight,`img${i}`,'SLOW');
    }
    
    pdf.save("download.pdf");
    return (pdf);
}