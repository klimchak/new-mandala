import {Component, OnInit} from '@angular/core';
import {jsPDF} from "jspdf";
import {CoreService} from "../../../../../shared/services/core/core.service";
import {ModelMandala} from "../../../../../shared/models/modelMandala";
import html2canvas from "html2canvas";

@Component({
  selector: 'app-save-image-modal',
  templateUrl: './save-image-modal.component.html',
  styleUrls: ['./save-image-modal.component.scss']
})
export class SaveImageModalComponent implements OnInit {

  public get modelMandala(): ModelMandala {
    return this.rendererService.modelMandala;
  }

  public get polygonObj(): any {
    return this.rendererService.polygonObj;
  }

  constructor(
    // private dynamicDialogConfig: DynamicDialogConfig,
    private rendererService: CoreService
  ) {
  }

  ngOnInit(): void {
  }

  public getPDFSchema() {
    // for (let i = 0; i < this.modelMandala.source.drawThisFigure.node.children.length; i++) {
    //   if (this.modelMandala.source.drawThisFigure.node.children[i].tagName === "polygon") {
    //     this.modelMandala.source.drawThisFigure.node.children[i].attributes.fill.value = '#ffffff';
    //   }
    // }
    this.getPdf(true);
  }

  public getPdf(schema: boolean) {
    let dWith = this.modelMandala.source.pageSize.width * 3.543307;
    let dHeight = this.modelMandala.source.pageSize.height * 3.543307;

    let DATA: any = document.getElementById('renderContainer');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('angular-demo.pdf');
    });


    // const doc = new jsPDF({
    //   orientation: "p",
    //   unit: "mm",
    //   compress: false
    // });
    // let svgAsText = new XMLSerializer().serializeToString(this.modelMandala.source.drawThisFigure.node);
    // console.log(this.modelMandala.source.drawThisFigure)
    // doc.addSvgAsImage(svgAsText, 20, 20, doc.internal.pageSize.width, doc.internal.pageSize.height)
    // doc.setTextColor('#231f20')
    // doc.setFillColor(255, 214, 201)
    // doc.save('testFileName')
  }
}
